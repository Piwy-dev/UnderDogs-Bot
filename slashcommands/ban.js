const { MessageEmbed, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Banni un membre du serveur.")
        .addUserOption((option) => option
            .setName("membre")
            .setDescription("Le membre à bannir")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("raison")
            .setDescription("La raison du bannissement")
        )
        .setDefaultMemberPermissions(Permissions.FLAGS.BAN_MEMBERS),

    async execute(interaction, client) {
        const { member, guild, options } = interaction

        // Récupère le membre à bannir
        const target = guild.members.cache.get(options.getUser("membre").id)

        // Vérifie que le membre puisse être banni
        if (!target.bannable) {
            interaction.reply({
                content: "Je n'ai pas les permissions pour ban ce membre.",
                ephemeral: true
            })
            return;
        }

        // Récupère la raison du bannissement
        const reason = options.getString("raison") || "Aucune raison fournie."

        // Bannissement du membre
        target.ban({
            reason,
        });

        // Création de l'embed
        const banEmbed = new MessageEmbed()
            .setColor('#961a26')
            .setTitle('Membre banni !')
            .addFields({
                name: 'Membre',
                value: `<@${target.id}>`
            }, {
                name: 'Raison',
                value: reason
            })

        interaction.reply({
            embeds: [banEmbed]
        })
    }
}