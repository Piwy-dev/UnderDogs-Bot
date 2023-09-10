const d = require('discord.js')

const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config()
const axios = require('axios');
const config = require('./config.json');
const client = new d.Client({
    intents: [ d.GatewayIntentBits.Guilds, d.GatewayIntentBits.GuildMessages, d.GatewayIntentBits.GuildMembers ]
});

const mongo = require('./db/mongo')

// Liste des features
const buttonsManager = require('./events/buttonsManager')
const levels = require('./events/levels')
const welcome = require('./events/welcome')
const sellect = require('./events/sellect');
const { channel } = require('node:diagnostics_channel');


const commands = [];
client.commands = new d.Collection();
const foldersPath = path.join(__dirname, 'slashcommands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new d.REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			d.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), // TEST
            //d.Routes.applicationCommands(process.env.CLIENT_ID), // PRODUCTION
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();


client.on(d.Events.ClientReady, async() => {
    await mongo().then(mongoose => {
        try {
            console.log('Base de donnée connectée');
        } finally {
			mongoose.set('strictQuery', false)
            mongoose.connection.close();
        }
    })

    buttonsManager(client)
    levels(client)
    welcome(client)
    sellect(client)
    
    console.log(`Currently in ${client.guilds.cache.size} servers`)
    client.user.setPresence({
        activities: [{
            name: `/info`,
            type: d.ActivityType.Watching
        }],
        status: 'online'
    });
})


client.on(d.Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(process.env.TOKEN)


const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchOAuthToken = process.env.TWITCH_OAUTH_TOKEN;
const twitchUsername = process.env.TWITCH_USERNAME;
const twitchApiUrl = `https://api.twitch.tv/helix/streams?user_login=${twitchUsername}`;
async function checkTwitchStreamStatus() {
	try {
	  const response = await axios.get(twitchApiUrl, {
		headers: {
		  'Client-ID': twitchClientId,
		  'Authorization': `Bearer ${twitchOAuthToken}`,
		},
	  });
  
	  const streamData = response.data.data[0];
	  
	  if (streamData && streamData.type === 'live') {
		for (const guild of client.guilds.cache.values()) {
		  const twitchChannel = guild.channels.cache.get(config.twitchChannels[guild.id]["channel_id"]);
		  if (twitchChannel) {
			twitchChannel.send(`Un nouveau live vient de démarrer ! \nRegarde-le ici : https://www.twitch.tv/${twitchUsername}`);
		  }
		}
	  }
	} catch (error) {
	  console.error('Error checking Twitch stream status:', error);
	}
  }
  
  // Check Twitch stream status every 5 minutes
  //setInterval(checkTwitchStreamStatus, 1 * 60 * 1000);
  

  async function checkTokenScopes() {
	try {
	  const response = await axios.get('https://id.twitch.tv/oauth2/validate', {
		headers: {
			'Authorization': `OAuth ${twitchOAuthToken}`,
		},
	  });
  
	  console.log('Token Scopes:', response.data.scopes);
	} catch (error) {
	  console.error('Error checking token scopes:', error);
	}
  }
  
  checkTokenScopes();