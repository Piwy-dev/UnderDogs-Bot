const d = require('discord.js')
const Canvas = require('canvas')

const config = require('../config.json')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("test")
        .setDescription("Commande de test.")
        .setDefaultMemberPermissions(d.PermissionFlagsBits.Administrator),

    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction
        await interaction.deferReply({ ephemeral: true })

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

        //Affiche le second texte
        context.font = '50px Comic Sans'
        context.fillStyle = '#ffffff';
        let textLvl = 'Villageois'
        context.fillText(textLvl, canvas.width / 2 - (context.measureText(t).width / 2.5), 240)

        // Rogne les bords de la pp
        context.beginPath();
        context.arc(190, 190, 137.5, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        // Importe la pp
        const avatar = await Canvas.loadImage(
            member.user.displayAvatarURL({
                extension: 'jpg',
            })
        )
        context.drawImage(avatar, 52, 52, 275, 275);

        const attachment = new d.AttachmentBuilder(canvas.toBuffer())

        await interaction.editReply({
            content: `Bravo ${member}, tu a obtenus un nouveau niveau !`,
            files: [attachment]
        })
    }
}