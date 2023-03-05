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
            .setTitle('Recrutement')
            .setDescription("Si tu souhaite rejoindre notre clan, merci de cliquer sur le bouton '**Rejoindre le clan**' ci-dessous. \n\n \
            Si tu souhaite rejoindre notre éqiupe e-sport, merci de cliquer sur le bouton '**Rejoindre l'équipe e-sport**' ci-dessous. \n\n \
            Ceci créera un salon de recrutement privé entre toi et le staff.")
            .setFooter({ text: "⚠️ Merci de ne pas utiliser ce système inutilement. Tout abus sera sanctionné !" })

        const recruitButtons = new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder()
                .setCustomId('recrutement')
                .setLabel("Rejoindre le clan")
                .setStyle(d.ButtonStyle.Success)
                .setEmoji('📩')
            )
            .addComponents(
                new d.ButtonBuilder()
                .setCustomId('esport')
                .setLabel("Rejoindre l'équipe e-sport")
                .setStyle(d.ButtonStyle.Primary)
                .setEmoji('🎮')
            )

        // Edit the message
        const message = await channel.messages.fetch('1072253212997976114')
        if (!message) return interaction.editReply({ content: "Le message n'a pas été trouvé !" })
        message.edit({ embeds: [recruitEmbed], components: [recruitButtons] });

        // Envoie le message de confiramtion
        interaction.editReply({ content: "Message de recrutement envoyé !" })
    }
}