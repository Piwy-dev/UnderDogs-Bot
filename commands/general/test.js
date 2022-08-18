const { MessageEmbed, Permissions, MessageAttachment } = require('discord.js');
const Canvas = require('canvas')

module.exports = {
    commands: ['test'],
    callback: async (message, arguments, text, client) => {
        const { member, guild, channel } = message
        if (!member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply("Tu n'as pas la permession d'effectuer cette action.")

        Canvas.registerFont('././ressources/paladins.ttf', { family: 'Comic Sans' })
        const canvas = Canvas.createCanvas(1280, 384);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('././ressources/img_lvl.png');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Affiche le premier texte
        context.font = '36px Comic Sans'
        context.fillStyle = '#357ae8';
        let t = `Niveau atteint !`
        context.fillText(t, canvas.width / 2 - 30 - (context.measureText(t).width / 2), 140)

        //Affiche le second texte
        context.font = '65px Comic Sans'
        context.fillStyle = '#ffffff';
        let textLvl = 'Niveau 10'
        context.fillText(textLvl, canvas.width / 2  - 268, 240)

        // Rogne les bords de la pp
        context.beginPath();
        context.arc(190, 190, 137.5, 0, Math.PI * 2, true);
        context.closePath();
        context.clip(); 

        // Importe la pp
        const avatar = await Canvas.loadImage(
            member.user.displayAvatarURL({
                format: 'png',
            })
        )
        context.drawImage(avatar, 52, 52, 275, 275);

        const attachment = new MessageAttachment(canvas.toBuffer())

        message.reply({
            context: 'test',
            files: [attachment]
        })
    }
}