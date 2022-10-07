const { MessageEmbed, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Exclu un membre du serveur.")
        .addUserOption((option) => option
            .setName("membre")
            .setDescription("Le membre à exclure")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("raison")
            .setDescription("La raison de l'exclusion")
        )
        .setDefaultMemberPermissions(Permissions.FLAGS.KICK_MEMBERS),

    async execute(interaction, client) {
        const { member, guild, options } = interaction

        // Récupère le membre à exclure
        const target = guild.members.cache.get(options.getUser("membre").id)

        // Vérifie que le membre puisse être exclus
        if (!target.bannable) {
            interaction.reply({
                content: "Je n'ai pas les permissions pour exclure ce membre.",
                ephemeral: true
            })
            return;
        }

        // Récupère la raison du l'exclusion
        const reason = options.getString("raison") || "Aucune raison fournie."

        // Exclusion du membre
        target.kick();

        // Création de l'embed
        const banEmbed = new MessageEmbed()
            .setColor('#961a26')
            .setTitle('Membre exclus !')
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