const Discord = require('discord.js')
const { Intents } = require('discord.js')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const {token} = require('./keys.json')

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS] },
    { partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"] });

const mongo = require('./mongo')

// Liste des features
const rules = require('./features/rules')
const ticket = require('./features/ticket')
const createVoiceChannel = require('./features/createVoiceChannel')
const logs = require('./features/logs')

// Laisse le bot en ligne
var http = require('http');  
http.createServer(function (req, res) {   
  res.write("I'm alive");    
  res.end(); 
}).listen(8080);

client.on('ready', async () => {
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

    // Connecte la bdd
    await mongo().then(mongoose => { // Connecte à la base de données
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

    client.user.setPresence({ activities: [{ name: 'in development' }] });
})

client.on('guildBanAdd', async ban => {
    console.log("utilisateur banni")
});

client.on('guildBanRemove', async ban => {
    console.log("utilisateur débanni")
});

client.login(token)