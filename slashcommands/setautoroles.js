const d = require('discord.js')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("setautoroles")
        .setDescription("Configure les autoroles.")
        .setDefaultMemberPermissions(d.PermissionsBitField.Flags.ManageMessages),

    async execute(interaction, client) {
        const { channel } = interaction

        await interaction.deferReply({ ephemeral: true, })

        const resetEmbed = new d.EmbedBuilder()
            .setColor('#ff392b')
            .setTitle('Supression des autorôles')
            .setDescription("Cliquez sur les boutons ci-dessous pour supprimer les autorôles.")
            
        const resetButton = new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder()
                    .setCustomId('resetRoles')
                    .setEmoji("🗑️")
                    .setLabel("Supprimer les autorôles")
                    .setStyle(d.ButtonStyle.Danger),
            )

        channel.send({
            embeds: [resetEmbed],
            components: [resetButton]
        });

        interaction.editReply({ content: "Message des autorôles envoyé !" })
    }
}