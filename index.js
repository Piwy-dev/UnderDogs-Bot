const { Client, Intents, Permissions, Collection } = require('discord.js')

const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")

const path = require('path')
const fs = require('fs')

// Données sensibles du bot
const config = require('./keys.json');

const express = require("express");
const crypto = require("crypto");
const app = express();
const port = process.env.PORT || 3000;
const twitchSigningSecret = config.TWITCH_SIGNING_secret;

const snekfetch = require('snekfetch');

const Twit = require('twit')

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_VOICE_STATES", "GUILD_MEMBERS", "GUILD_INVITES"]
})

const mongo = require('./mongo')

/*const { ApiClient } = require("twitch");
const { ClientCredentialsAuthProvider } = require("twitch-auth");
const authProvider = new ClientCredentialsAuthProvider(
    config.TWITCH_CLIENT_id,
    config.TWITCH_CLIENT_secret
);
const twitch = new ApiClient({ authProvider });
console.log(twitch) */

// Liste des features
const rules = require('./features/rules')
const ticket = require('./features/ticket')
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

    // Charge les commands
    const baseFile = 'command-base.js'
    const commandBase = require(`./commands/${baseFile}`)
    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file))
                commandBase(client, option)
            }
        }
    }
    readCommands('commands')

    // Charge les commandes slash
    const clientID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(config.token);

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
    createVoiceChannel(client)
    logs(client)
    welcome(client)
        //censor(client)
        //antiSpam(client)

    // Censure des invitations
    client.guilds.cache
        .filter((g) => g.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
        .forEach((g) => g.invites.fetch({ cache: true }));

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

client.login(config.token)