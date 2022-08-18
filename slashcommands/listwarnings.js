const { MessageEmbed, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders')

const mongo = require('../mongo.js')
const warnSchema = require('../models/warn-schema')

let result;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("listwarnings")
        .setDescription("Affiche tous les avertissemnts d'un membre.")
        .addUserOption((option) => option
            .setName("membre")
            .setDescription("Le membre dont on veut voir les avrtissements.")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_MESSAGES),

    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction

        await interaction.deferReply()

        // Récupère le membre dont on veut voir les avrtissements
        const target = guild.members.cache.get(options.getUser("membre").id)

        await mongo().then(async(mongoose) => {
            try {
                result = await warnSchema.findOne({
                    _id: guild.id,
                    userId: target.id
                })
            } finally {
                mongoose.connection.close()
            }
        })

        if (!result) return interaction.editReply({ content: "Ce membre n'a pas d'avertissements.", ephemeral: true })

        const warnEmbed = new MessageEmbed()
            .setTitle(`Récapitulatif des avertissemnts`)

        for (let counter = 0; counter < result.reasons.length; ++counter) {
            const warnAuthor = result.warnAuthors[counter]
            const warnDate = result.warnDates[counter]
            const reason = result.reasons[counter]

            warnEmbed.addFields({ name: `Avertissement ${counter + 1}`, value: `Reçu par <@${warnAuthor}> le ${new Date(warnDate).toLocaleDateString()}, \n Raison: ${reason}` })
        }

        // Envoie le message dans le channel
        channel.send({
            embeds: [warnEmbed]
        });

        // Envoie un message de confirmation
        interaction.editReply(`Voici les avertissements de ${target}.`)
    }
}