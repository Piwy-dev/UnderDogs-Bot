const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js')

const mongo = require('../mongo.js')
const warnSchema = require('../models/warn-schema')

let result;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unwarn")
        .setDescription("Retire un ou plusieurs avertissement•s à un membre.")
        .addUserOption((option) => option
            .setName("membre")
            .setDescription("Le membre dont on veut retirer le•s avetissement•s.")
            .setRequired(true)
        )
        .addBooleanOption((option) => option
            .setName("all")
            .setDescription("Retire tous les avertissements du membre.")
            .setRequired(true)
        )
        .addIntegerOption((option) => option
            .setName("number")
            .setDescription("Le nombre d'avertissements à retirer.")
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction

        await interaction.deferReply()

        // Récupère le membre dont on veut voir les avrtissements
        const target = guild.members.cache.get(options.getUser("membre").id)

        // Récupère la valeur pour savoir si on retire tous les avertissements ou pas
        const all = options.getBoolean("all")

        // Vérifie que le membre aie des avertissements
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

        // Si on veut retirer tout les avertissements
        if (all) {
            await mongo().then(async(mongoose) => {
                try {
                    await warnSchema.findOneAndDelete({
                        _id: guild.id,
                        userId: target.id
                    })
                } finally {
                    mongoose.connection.close()
                }
            })
            interaction.editReply(`Tout les avertissements de ${target} ont été retirés.`)
        }
        // Si on veut retirer un seul avertissement
        else {
            // Récupère le numero de l'avetissement à retirer
            const warn = options.getInteger("number") - 1

            // Vérifie qu'il existe un avertissement avec ce numéro
            if (!result.reasons[warn]) return interaction.editReply({ content: "Aucun avertissement ne correspond à ce numéro.", ephemeral: true })

            // Supprime l'avertissement
            await mongo().then(async(mongoose) => {
                try {
                    result = await warnSchema.findOneAndUpdate({
                        _id: guild.id,
                        userId: target.id
                    })

                    await result.reasons.splice(warn, 1)
                    await result.warnAuthors.splice(warn, 1)
                    await result.warnDates.splice(warn, 1)
                    await result.save()
                } finally {
                    mongoose.connection.close()
                }
            })

            interaction.editReply(`L'avertissement numéro ${warn + 1} a été retiré de ${target}`)
        }
    }
}