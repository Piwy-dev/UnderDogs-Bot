const { MessageEmbed, Permissions, MessageAttachment } = require('discord.js');
const Canvas = require('canvas')

module.exports = {
    commands: ['w'],
    callback: async (message, arguments, text, client) => {
        const { member, guild, channel } = message
        if (!member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply("Tu n'as pas la permession d'effectuer cette action.")

        Canvas.registerFont('././ressources/paladins.ttf', { family: 'Comic Sans' })
        const canvas = Canvas.createCanvas(1280, 720);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('././ressources/img_welcome.jpg');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Rogne les bords de la pp
        context.beginPath();
        context.arc(426, 339, 205, 0, Math.PI * 2, true);
        context.closePath();
        context.clip(); 

        // Importe la pp
        const avatar = await Canvas.loadImage(
            member.user.displayAvatarURL({
                format: 'png',
            })
        )
        context.drawImage(avatar, 220.5, 133.5, 410, 410);

        const attachment = new MessageAttachment(canvas.toBuffer())

        message.reply({
            context: 'test',
            files: [attachment]
        })
    }
}