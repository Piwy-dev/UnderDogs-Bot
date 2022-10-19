const { SlashCommandBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Efface plusieurs messages.")
        .addNumberOption((option) => option
            .setName("nombre")
            .setDescription("Nombre de messages à effacer.")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

    async execute(interaction, client) {
        const { member, channel } = interaction

        await interaction.deferReply({
            ephemeral: true
        })

        const claerAmount = interaction.options.getNumber("nombre")

        if (claerAmount > 100) return interaction.editReply({
            content: "Impossible de suprimmer plus de 100 messages en une fois.",
        });
        if (claerAmount < 1) return interaction.editReply({
            content: "Impossible de supprimer moins de 1 message."
        });

        await channel.messages.fetch({ limit: claerAmount }).then(messages => {
            channel.bulkDelete(messages).catch(e => {
                if (e) return interaction.editReply({
                    content: "Désolé, je ne peux pas supprimer des messages datant de plus que 14 jours."
                });
            })
        });

        interaction.editReply({
            content: "Les messages ont été effacés !",
        })
    }
}