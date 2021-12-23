const Discord = require('discord.js')
const { Intents } = require('discord.js')
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



const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS] },
    { partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"] });

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

    // Charge les tweets
    var T = new Twit({
        consumer_key: config.twitter_consumer_key,
        consumer_secret: config.twitter_consumer_secret,
        access_token: config.twitter_access_token,
        access_token_secret: config.twitter_access_token_secret,
        timeout_ms: 60 * 1000,
        strictSSL: true
    })

    var stream = T.stream('statuses/filter', {
        follow: [config.twitter_user_id],
    })

    stream.on('tweet', function (tweet) {
        console.log('Nouveau tweet.')
        var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;

        try {
            const tweetChannel = client.channels.cache.get('922246791829798953')
            if (!tweetChannel) return console.log("Le channel de tweet n'existe pas !")

            tweetChannel.send(url).catch(err => {
                console.log(err)
            })
        } catch (err) {
            console.log(err)
        }
    })

    // Charge Twitch
    /* const streamer = 'ahrityr_';

    const api = `https://api.twitch.tv/kraken/streams/${streamer}?client_id=${config.TWITCH_CLIENT_id}`;

    snekfetch.get(api).then(r => {
        if (r.body.stream === null) {
            setInterval(() => {
                snekfetch.get(api).then(console.log(r.body))
            }, 30000); // Set to 30 seconds, less than this causes 'node socket hang up'
        } else {
            const embed = new Discord.RichEmbed()
                .setAuthor(
                    `${r.body.stream.channel.display_name} is live on Twitch`,
                    `${r.body.stream.channel.logo}`,
                    `${r.body.stream.channel.url}`
                )
                .setThumbnail(`http://static-cdn.jtvnw.net/ttv-boxart/${encodeURI(r.body.stream.channel.game)}-500x500.jpg`)
                .addField('Stream Title', `${r.body.stream.channel.status}`, true)
                .addField('Playing', `${r.body.stream.channel.game}`, true)
                .addField('Followers', `${r.body.stream.channel.followers}`, true)
                .addField('Views', `${r.body.stream.channel.views}`, true)
                .setImage(r.body.stream.preview.large)

            return client.channels.get('922148004289450024').send({ 
                embeds: [embed] 
            });
        }
    }); */
    
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    
    const verifyTwitchSignature = (req, res, buf, encoding) => {
      const messageId = req.header("Twitch-Eventsub-Message-Id");
      const timestamp = req.header("Twitch-Eventsub-Message-Timestamp");
      const messageSignature = req.header("Twitch-Eventsub-Message-Signature");
      const time = Math.floor(new Date().getTime() / 1000);
      console.log(`Message ${messageId} Signature: `, messageSignature);
    
      if (Math.abs(time - timestamp) > 600) {
        // needs to be < 10 minutes
        console.log(
          `Verification Failed: timestamp > 10 minutes. Message Id: ${messageId}.`
        );
        throw new Error("Ignore this request.");
      }
    
      if (!twitchSigningSecret) {
        console.log(`Twitch signing secret is empty.`);
        throw new Error("Twitch signing secret is empty.");
      }
    
      const computedSignature =
        "sha256=" +
        crypto
          .createHmac("sha256", twitchSigningSecret)
          .update(messageId + timestamp + buf)
          .digest("hex");
      console.log(`Message ${messageId} Computed Signature: `, computedSignature);
    
      if (messageSignature !== computedSignature) {
        throw new Error("Invalid signature.");
      } else {
        console.log("Verification successful");
      }
    };
    
    app.use(express.json({ verify: verifyTwitchSignature }));
    
    app.post("/webhooks/callback", async (req, res) => {
      const messageType = req.header("Twitch-Eventsub-Message-Type");
      if (messageType === "webhook_callback_verification") {
        console.log("Verifying Webhook");
        return res.status(200).send(req.body.challenge);
      }
    
      const { type } = req.body.subscription;
      const { event } = req.body;
    
      console.log(
        `Receiving ${type} request for ${event.broadcaster_user_name}: `,
        event
      );
    
      res.status(200).end();
    });
    
    const listener = app.listen(port, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });
    
      
})

client.login(config.token)