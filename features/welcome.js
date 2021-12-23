//const Canvas = require('canvas')
//const {registerFont} = require('canvas')
const { MessageAttachment } = require('discord.js')

const muteSchema = require('../models/mute-schema')
const mongo = require('../mongo');

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        const { guild } = member

        /*registerFont('./comic-sans-ms.ttf', { family: 'Comic Sans' })
        const canvas = Canvas.createCanvas(700, 300);
        const context = canvas.getContext('2d');
        context.fillStyle = '#3c8ece';

        const background = await Canvas.loadImage('./background.png');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.font = '25px Comic Sans'
        context.fillStyle = '#3c8ece';

        let t = `${member.displayName} Bienvenue !`
        context.fillText(t, canvas.width / 2 - context.measureText(t).width / 2, 40)

        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI, false);
        context.stroke();

        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const avatar = await Canvas.loadImage(
            member.user.displayAvatarURL({
                format: 'png',
            })
        )
        context.drawImage(avatar, canvas.width / 2 - 100, canvas.height / 2 - 100, 200, 200);

        const attachment = new MessageAttachment(canvas.toBuffer()) */

        const welcomeChannel = client.channels.cache.get('922138291078320138')

        welcomeChannel.send({
            content: `Bienvenue dans le serveur <@${member.id}>, tu es le ${member.guild.memberCount}ème membre !`
        })

        /*const rol1 = member.guild.roles.cache.get('861991177708109855')
        if (!rol1) return console.log("le premier rôle n'existe pas")
        const rol2 = member.guild.roles.cache.get('861991954375245874')
        if (!rol1) return console.log("le deuxième rôle n'existe pas")
        const newMemberRol = member.guild.roles.cache.get('867422871205707806')
        if (!newMemberRol) return console.log("le troisième rôle n'existe pas")
        member.roles.add(rol1)
        member.roles.add(rol2)
        member.roles.add(newMemberRol)*/

        //#region Mute le membre si il est déjà mute

        // Cherche si il y a des gens mute sur le serv
        // Connecte à la base de données
        await mongo().then(async mongoose => {
            try {
                // Cherche si il y a des gens mutes sur le serv
                const data = await muteSchema.findById(guild.id)
                if (!data) return
        
                // Cherche si le membre qui a rejoins est mute
                const user = data.Users.findIndex((prop) => prop === member.id)
                if (user == -1) return
        
                // Assigne le rôle de mute
                const muteRole = guild.roles.cache.get('921894147105894470')
                if (!muteRole) return console.log("le rôle de mute n'existe pas!")
        
                member.roles.add(muteRole)
            } finally {
                mongoose.connection.close();
            }
        })
        //#endregion
    })
}
