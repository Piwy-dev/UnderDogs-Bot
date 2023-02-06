const { PermissionsBitField, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("Affiche les logs de mise à jour.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {
        const { guild, channel } = interaction

        const updateEmbed = new EmbedBuilder()
            .setTitle('Nouvelle mise à jour (version 0.0.6) - Octobtre 2022')
            .setDescription("Cette version est la version de pré-lancement. La prochaine version devrait apporter la mise en place de l'hébergement et de la connection à la base de donnée pour tous les serveurs.")
            .setThumbnail('https://pbs.twimg.com/profile_images/1480638649008066569/ZYdgTYU-_400x400.jpg')
            .setColor('#7dffa0')
            .addFields({
                name: "Nouveautés",
                value: "→ Mise à jour des photos de bienvue et de niveau avec le nouveau logo \n→ Revision du système de messages de bienvenue \n→ Ajout de la pp du bot \n→ Modifications et ajout des permissions pour les commandes de modération \n→ Début du système pour les recrutements"
            }, {
                name: "Prochaine mise à jour",
                value: "Version 1.0.1 Prévu : novembre / décembre 2022 \n→ Passage à discord.js v14 \n→ Changement d'hébergeur "
            })
            .setFooter({ text: "Bot mis à jour by Piwy#2703" })

        channel.send({
            embeds: [updateEmbed]
        })
    }
}