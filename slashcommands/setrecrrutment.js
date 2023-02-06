const d = require('discord.js')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("setrecrutement")
        .setDescription("Configure le recrutement.")
        .setDefaultMemberPermissions(d.PermissionsBitField.Flags.ManageMessages),

    async execute(interaction, client) {
        const { member, guild, channel } = interaction

        await interaction.deferReply({
            ephemeral: true,
        })

        const recruitEmbed = new d.EmbedBuilder()
            .setColor('#4287f5')
            .setTitle('Recrutement Clash of Clans')
            .setDescription("Appuie sur le bouton ci-dessus pour postuler pour rejoindre le clan ADH.")
            .setFooter({ text: "⚠️ Merci de ne pas utiliser ce système inutilement. Tout abus sera sanctionné !" })

        const contactButton = new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder()
                .setCustomId('recrutement')
                .setLabel("Postuler")
                .setStyle(d.ButtonStyle.Success)
                .setEmoji('📩')
            )

        // Envoie le message
        channel.send({
            embeds: [recruitEmbed],
            components: [contactButton]
        });

        // Envoie le message de confiramtion
        interaction.editReply({ content: "Message de recrutement envoyé !" })
    }
}