const { Client, GatewayIntentBits, Collection, PermissionsBitField } = require('discord.js')

const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")

const fs = require('fs')
require('dotenv').config()

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.Guilds
    ]
});

const mongo = require('./mongo')

// Liste des features
const rules = require('./features/rules')
const ticket = require('./features/ticket')
const recrutement = require('./features/recrutement')
const createVoiceChannel = require('./features/createVoiceChannel')
const logs = require('./features/logs')
const welcome = require('./features/welcome')
const censor = require('./features/censor')
const antiSpam = require('./features/anti-spam')

// Laisse le bot en ligne
var http = require('http');
http.createServer(function(req, res) {
    res.write("I'm alive");
    res.end();
}).listen(8080);

// Fichier pour les commandes
const commandFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'));
const commands = [];
client.commands = new Collection();
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
    rules(client)
    ticket(client)
    recrutement(client)
        // createVoiceChannel(client)
    logs(client)
    welcome(client)
        //censor(client)
        //antiSpam(client)

    // Censure des invitations
    /*client.guilds.cache
        .filter((g) => g.me.permissions.has(PermissionsBitField.Flags.ManageGuild))
        .forEach((g) => g.invites.fetch({ cache: true })); */

    client.user.setActivity(`la version 0.0.4`, { type: "WATCHING" })
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