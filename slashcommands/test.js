const { MessageEmbed, Permissions, MessageAttachment, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders')
const Canvas = require('canvas')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Commande de test.")
        .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR),

    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction

        await interaction.deferReply({})

        Canvas.registerFont('././ressources/paladins.ttf', { family: 'Comic Sans' })
        const canvas = Canvas.createCanvas(1280, 384);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('././ressources/rank.png');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Affiche le premier texte
        context.font = '45px Comic Sans'
        context.fillStyle = '#357ae8';
        let t = `Nouveau rang !`
        context.fillText(t, canvas.width / 2 - (context.measureText(t).width / 2), 140)

        //Affiche le second texte
        context.font = '60px Comic Sans'
        context.fillStyle = '#ffffff';
        let textLvl = 'Rare'
        context.fillText(textLvl, canvas.width / 2 - (context.measureText(t).width / 2.5), 240)

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

        interaction.editReply({
            content: `Bienvenue dans le serveur ${member}, tu es le ${guild.memberCount}ème membre !`,
            files: [attachment]
        })
    }
}