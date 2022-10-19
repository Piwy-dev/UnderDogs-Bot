const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setrecrutement")
        .setDescription("Configure le recrutement.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction

        await interaction.deferReply({
            ephemeral: true,
        })

        const ticketEmbed = new EmbedBuilder()
            .setColor('#4287f5')
            .setTitle('Recrutement')
            .setDescription("Appuie sur le bouton ci-dessus pour postuler pour rejoindre l'équipe ou le staff ADH.")
            .setFooter({ text: "⚠️ Merci de ne pas spammer et de ne pas utiliser ce système inutilement. Tout abus sera sanctionné !" })

        const contactButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('recrutement')
                .setLabel("Postuler")
                .setStyle('PRIMARY')
                .setEmoji('📩')
            )

        // Envoie le message
        channel.send({
            embeds: [ticketEmbed],
            components: [contactButton]
        });

        // Envoie le message de confiramtion
        interaction.editReply({ content: "Message de recrutement envoyé !" })
    }
}