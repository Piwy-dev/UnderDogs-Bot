const d = require('discord.js')

const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")

const fs = require('fs')
require('dotenv').config()

const client = new d.Client({
    intents: [ d.GatewayIntentBits.Guilds, d.GatewayIntentBits.GuildMessages, d.GatewayIntentBits.Guilds, d.GatewayIntentBits.GuildMembers ]
});

const mongo = require('./mongo')

// Liste des features
const buttonsManager = require('./events/buttonsManager')
const levels = require('./events/levels')
const createVoiceChannel = require('./events/createVoiceChannel')
//const logs = require('./events/logs')
const welcome = require('./events/welcome')
const censor = require('./events/censor')
const antiSpam = require('./events/anti-spam')

// Laisse le bot en ligne
var http = require('http');
http.createServer(function(req, res) {
    res.write("I'm alive");
    res.end();
}).listen(8080);

// Fichier pour les commandes
const commandFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'));
const commands = [];
client.commands = new d.Collection();
for (const file of commandFiles) {
    const command = require(`./slashcommands/${file}`)
    commands.push(command.data.toJSON())
    client.commands.set(command.data.name, command)
}

client.on('ready', async() => {
    console.log(`Currently in ${client.guilds.cache.size} servers`)

    // Charge les commandes slash
    const clientID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(process.env.TOKEN);

    (async() => {
        try {
            await rest.put(Routes.applicationCommands(clientID), {
                body: commands
            })
            console.log("Les commandes ont été chargées généralement correctement.")
        } catch (err) {
            if (err) console.error(err)
        }
    })()

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
    //createVoiceChannel(client)
    //logs(client)
    welcome(client)
        //censor(client)
        //antiSpam(client)
    client.user.setActivity(`la version 0.0.6`, { type: "WATCHING" })
})

// Lance les commandes slash
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

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