const Canvas = require('canvas')

const d = require('discord.js')

const config = require('../config.json')

const mongo = require('../db/mongo');
const levelsSchema = require('../db/levelsSchema');

const levelUp = {0: 1, 1: 10, 2: 11, 3: 21, 4: 32, 5: 53, 6: 85, 7: 138, 8: 223, 9: 361, 10: 584, 11: 945, 12: 1529, 13: 2474, 14: 4003, 15: 6477}

let isRunning = false

module.exports = (client) => {
    client.on(d.Events.MessageDelete, async(message) => {
        const { guild, author, channel } = message

        if (message.author.bot) return;

        if (channel.type === d.ChannelType.DM) return;

        if (isRunning) return;
        isRunning = true

        // Set a cooldown for the user
        let cooldown = 5
        let res = false
        await mongo().then(async(mongoose) => {
            try {
                res = await levelsSchema.findOne({
                    guildId: guild.id,
                    userId: author.id,
                })
            } finally {
                mongoose.connection.close()
            }
        })
        if ( res && Date.now() - res.lastMessage < cooldown * 1000) return;

        let result = false
        await mongo().then(async(mongoose) => {
            try {
                await levelsSchema.findOneAndUpdate({
                    guildId: guild.id,
                    userId: author.id,
                }, {
                    guildId: guild.id,
                    userId: author.id,
                    $inc: {
                        xp: 1,
                    },
                }, {
                    upsert: true,
                })
                result = await levelsSchema.findOne({
                    guildId: guild.id,
                    userId: author.id,
                })
            } finally {
                mongoose.connection.close()
            }
        })

        if (result.xp >= levelUp[result.level]) {
            await mongo().then(async(mongoose) => {
                try {
                    await levelsSchema.findOneAndUpdate({
                        guildId: guild.id,
                        userId: author.id,
                    }, {
                        guildId: guild.id,
                        userId: author.id,
                        xp: 0,
                        $inc: {
                            level: 1,
                        },
                    }, {
                        upsert: true,
                    })
                } finally {
                    mongoose.connection.close()
                }
            })

            Canvas.registerFont('././ressources/paladins.ttf', { family: 'Comic Sans' })
            const canvas = Canvas.createCanvas(1280, 384);
            const context = canvas.getContext('2d');

            const background = await Canvas.loadImage('././ressources/level.jpg');
            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            // Affiche le premier texte
            context.font = '40px Comic Sans'
            context.fillStyle = '#357ae8';
            let t = `Nouveau niveau !`
            context.fillText(t, canvas.width / 2 - (context.measureText(t).width / 2), 140)

            const member = await guild.members.cache.get(author.id)
            if (result.level >= 1) {
                const previousLevelRole = await guild.roles.cache.get(config.levelsRoles[guild.id][result.level])
                if(!previousLevelRole) return console.log(`Le rôle de niveau n'existe pas !`)
                await member.roles.remove(previousLevelRole)
            }
            if (result.level >= 15) return
            const levelRole = await guild.roles.cache.get(config.levelsRoles[guild.id][result.level + 1])
            if(!levelRole) return console.log(`Le rôle de niveau n'existe pas !`)
            await member.roles.add(levelRole)

            //Affiche le second texte
            context.font = '50px Comic Sans'
            context.fillStyle = '#ffffff';
            let textLvl = `${levelRole.name}`
            context.fillText(textLvl, canvas.width / 2 - (context.measureText(t).width / 2.5), 240)

            // Rogne les bords de la pp
            context.beginPath();
            context.arc(190, 190, 137.5, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            // Importe la pp
            const avatar = await Canvas.loadImage(
                author.displayAvatarURL({ extension: 'jpg' })
            )
            context.drawImage(avatar, 52, 52, 275, 275);

            const attachment = new d.AttachmentBuilder(canvas.toBuffer())

            const levelChannel = await guild.channels.cache.get(config.levelsChannels[guild.id])
            if(!levelChannel) return console.log(`Le salon de niveau n'existe pas !`)

            await levelChannel.send({
                content: `Bravo ${author}, tu a obtenus un nouveau niveau !`,
                files: [attachment]
            })
        }
        isRunning = false
    })
}