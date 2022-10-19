const { PermissionsBitField, SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban un membre.")
        .addUserOption((option) => option
            .setName("membre")
            .setDescription("Membre à bannir.")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("raison")
            .setDescription("Raison du bannissement")
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),

    async execute(interaction, client) {
        const { member, channel, guild } = interaction

        await interaction.deferReply({
            ephemeral: true
        })

        // Récupère le membre à ban
        const user = interaction.options.getUser("membre")
        const target = guild.members.cache.get(user.id)

        // Vérifie que le bot peut ban la cible
        if (!target.bannable) {
            interaction.editReply("Je n'ai pas les permissions pour ban ce membre.");
            return;
        }

        // Récupère la raison du ban
        let reason = interaction.options.getString("raison")
        if (!reason) reason = "non définie"

        await target.ban({
            reason,
        });

        interaction.editReply({
            content: `${target} à été ban! Raison: ${reason}`,
            ephemeral: false
        })
    }
}