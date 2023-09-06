const d = require('discord.js')

const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config()

const client = new d.Client({
    intents: [ d.GatewayIntentBits.Guilds, d.GatewayIntentBits.GuildMessages, d.GatewayIntentBits.GuildMembers ]
});

const mongo = require('./mongo')

// Liste des features
const buttonsManager = require('./events/buttonsManager')
const levels = require('./events/levels')
const welcome = require('./events/welcome')
const sellect = require('./events/sellect')

// Laisse le bot en ligne
var http = require('http');
http.createServer(function(req, res) {
    res.write("I'm alive");
    res.end();
}).listen(8080);

const commands = [];
const commandsPath = path.join(__dirname, 'slashcommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./slashcommands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new d.REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
	try {
		const data = await rest.put(
			d.Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();


client.on(d.Events.ClientReady, async() => {
    console.log(`Currently in ${client.guilds.cache.size} servers`)

    // Connecte à la base de données
    await mongo().then(mongoose => {
        try {
            console.log('Base de donnée connectée');
        } finally {
            mongoose.connection.close();
        }
    })

    // Execute les features
    buttonsManager(client)
    levels(client)
    welcome(client)
    sellect(client)

    //client.user.setActivity(`la version 0.0.1`, { type: "WATCHING" })
})

client.on(d.Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
        await command.execute(interaction, client)
    } catch (err) {
        if (err) console.error(err)

        await interaction.reply({
            content: "Une erreur s'est produite pendant l'exécution. Merci de réessayer ou de rapporter un bug.",
            ephemeral: true
        })
    }
})

client.login(process.env.TOKEN)