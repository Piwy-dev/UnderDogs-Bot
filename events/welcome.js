const Canvas = require('canvas')

const d = require('discord.js')

const config = require('../config.json')

const muteSchema = require('../db/mute-schema')
const mongo = require('../db/mongo');

module.exports = (client) => {
    client.on(d.Events.GuildMemberAdd, async(member) => {
        const { guild } = member

        const canvas = Canvas.createCanvas(1280, 720);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('././ressources/bienvenue.jpg');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Rogne les bords de la pp
        context.beginPath();
        context.arc(415.5, 363, 213, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        // Importe la pp
        const avatar = await Canvas.loadImage(
            member.user.displayAvatarURL({
                extension: 'jpg',
            })
        )
        context.drawImage(avatar, 202, 150, 427.5, 427.5);

        const attachment = new d.AttachmentBuilder(canvas.toBuffer())

        // Récupère le channel de bienvenue
        const welcomeChannel = guild.channels.cache.find(c => c.id === config.welcomeChannels[guild.id])
        if (!welcomeChannel) return console.log("Je n'ai pas pu trouver le salon de bienvenue !")

        await welcomeChannel.send({
            content: `Bienvenue dans le serveur <@${member.id}>, tu es le ${member.guild.memberCount}ème membre !`,
            files: [attachment]
        })

        //// Mute le membre si il est déjà mute ////
        
        // Cherche si il y a des gens mute sur le serv
        await mongo().then(async mongoose => {
            try {
                // Cherche si il y a des gens mutes sur le serv
                const data = await muteSchema.findById(guild.id)
                if (!data) return

                // Cherche si le membre qui a rejoins est mute
                const user = data.Users.findIndex((prop) => prop === member.id)
                if (user == -1) return

                const muteRole = guild.roles.cache.get(config.muteRoles[guild.id])
                if (!muteRole) return interaction.editReply("Je n'ai pas pu trouvé le role mute!")

                member.roles.add(muteRole)
            } finally {
                mongoose.connection.close();
            }
        })
    })
}