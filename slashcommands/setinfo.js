const d = require('discord.js')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("setinfo")
        .setDescription("Configure les informations du bot.")
        .setDefaultMemberPermissions(d.PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true, })

        const infoEmbed = new d.EmbedBuilder()
            .setColor('#ffb82b')
            .setTitle('Informations du bot')
            .setDescription("Dans ce salon, vous trouverez toutes les informations concernant le bot. \
            N'hésitez pas à demander pour n'importe quelle fonctionnalité qu'il faudrait ajouter, modifier ou supprimer !\
            \n\nCe bot dispose d'un hébergeur permanent, il devrait donc être disponible 24/7. Si vous remarquez que le bot n'est pas en ligne, prévenez <@523447196050522123>. Le coût de cet hébergeur est de 2€/mois. \n\n ")
            .addFields({
                name: "Langage", value: "JavaScript", inline: true
            }, {
                name: "Plateforme d'hébergement", value: "Daki Bot Hosting", inline: true
            }, {
                name: "Version", value: "0.0.8", inline: true
            }, {
                name: "Date de la dernière mise à jour", value: "06/02/2023"
            })
            .setThumbnail(client.user.avatarURL())
            .setFooter({ text: "Bot développé par Piwy#2703", iconURL: "https://pbs.twimg.com/profile_images/1480638649008066569/ZYdgTYU-_400x400.jpg" })

        const featuresEmbed = new d.EmbedBuilder()
            .setColor('#5abf67')
            .setTitle('Fonctionnalités mises en place')
            .addFields({
                name: "Modération", value: "Clear  |  Kick  |  Ban | Unban"
            }, {
                name: "Serveur Coc", value: "Règlement  |  Autorôles | Recrutement"
            })

        const nextFeaturesEmbed = new d.EmbedBuilder()
            .setColor('#4a94e8')
            .setTitle('Fonctionnalités à venir')
            .addFields({
                name: "Modération", value: "Mute  |  Unmute  |  Warn  |  Unwarn"
            }, {
                name: "Serveur Coc", value: "Tickets  |  Système de niveaux"
            })


        const message = await client.guilds.cache.get("874958380844859435").channels.cache.get("1072193591998435339").messages.fetch("1072207647798984764")
        message.edit({
            embeds: [infoEmbed, featuresEmbed, nextFeaturesEmbed],
        });

        interaction.editReply({ content: "Message des informations envoyé !" })
    }
}