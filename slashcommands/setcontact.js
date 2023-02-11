const d = require('discord.js')

module.exports = { 
    data: new d.SlashCommandBuilder()
        .setName("setcontact")
        .setDescription("Configure le message de contact.")
        .setDefaultMemberPermissions(d.PermissionsBitField.Flags.ManageMessages),

    async execute(interaction, client) {
        const { member, guild, channel } = interaction

        await interaction.deferReply({
            ephemeral: true,
        })

        const recruitEmbed = new d.EmbedBuilder()
            .setColor('#4287f5')
            .setTitle('Contacter le staff')
            .setDescription("Appuie sur le bouton pour créer un salon privé avec les membre du staff.")
            .setFooter({ text: "⚠️ Merci de ne pas utiliser ce système inutilement. Tout abus sera sanctionné !" })

        const contactButton = new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder()
                .setCustomId('contact')
                .setLabel("Contacter le staff")
                .setStyle(d.ButtonStyle.Success)
                .setEmoji('📩')
            )

        // Envoie le message
        channel.send({
            embeds: [recruitEmbed],
            components: [contactButton]
        });

        // Envoie le message de confiramtion
        interaction.editReply({ content: "Message de contact envoyé !" })
    }
}