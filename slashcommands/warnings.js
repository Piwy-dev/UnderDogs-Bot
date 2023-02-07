const d = require('discord.js');

const mongo = require('../mongo.js')
const warnSchema = require('../models/warn-schema')

let result;

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Montre les avertissements d'un membre")
        .addUserOption((option) => option
            .setName("membre")
            .setDescription("Le membre dont on veut voir les avertissements")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(d.PermissionFlagsBits.ManageChannels),

    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction

        await interaction.deferReply({ ephemeral: true })

        // Récupère le membre dont on veut voir les avrtissements
        const target = guild.members.cache.get(options.getUser("membre").id)

        await mongo().then(async(mongoose) => {
            try {
                result = await warnSchema.findOne({
                    guildId: guild.id,
                    userId: target.id
                })
            } finally {
                mongoose.connection.close()
            }
        })

        if (!result) return interaction.editReply({ content: "Ce membre n'a pas d'avertissements.", ephemeral: true })

        const warnEmbed = new d.EmbedBuilder()
            .setTitle(`Avertissements de ${target.user.username}`)

        // Get all the warnings
        for (let counter = 0; counter < result.warnings.length; ++counter) {
            const warn = result.warnings[counter]

            warnEmbed.addFields({ name: `Avertissement ${counter + 1}`, 
            value: `Reçu par : <@${warn.authorId}> le ${new Date(warn.date).toLocaleDateString()}, 
                    **Raison**: ${warn.reason} \n**Identifiant**: ${counter + 1}` })
        }

        // Envoie le message dans le channel
        channel.send({
            embeds: [warnEmbed]
        });

        // Envoie un message de confirmation
        interaction.editReply({ content: `Les avertissements de ${target.user.username} ont été envoyés dans ${channel}`, ephemeral: true })
    }
}