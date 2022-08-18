const { MessageEmbed, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders')

const mongo = require('../mongo.js')
const warnSchema = require('../models/warn-schema')

let result;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Averti un membre qu'il a enfreint les règles.")
        .addUserOption((option) => option
            .setName("membre")
            .setDescription("Le membre à avertire.")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("raison")
            .setDescription("La raison de l'avertissement.")
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction

        await interaction.deferReply({ ephemeral: true })

        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply({
            content: 'Pour effectuer cette action, tu dois avoir la permission de gérer les messages.',
        })

        // Récupère le membre à avertire
        const target = guild.members.cache.get(options.getUser("membre").id)

        // Récupère la raison du l'avertissement
        const reason = options.getString("raison") || "Aucune raison fournie."

        // La date du message
        const date = new Date(interaction.createdTimestamp)

        await mongo().then(async(mongoose) => {
            try {
                result = await warnSchema.findOneAndUpdate({
                    _id: guild.id,
                    userId: target.id
                }, {
                    _id: guild.id,
                    userId: target.id,
                    $push: {
                        warnAuthors: member.id,
                        warnDates: date,
                        reasons: reason,
                    },
                }, {
                    upsert: true,
                    new: true,
                })
            } finally {
                mongoose.connection.close()
            }
        })

        // Création de l'embed
        const warnEmbed = new MessageEmbed()
            .setTitle('Nouvel avertissemnt !')
            .setDescription(`${target} a reçu un nouvel avertissement par ${member}. \n Il a maintenant ${result.reasons.length} avertissement(s)`)
            .addFields({ name: 'Raison', value: reason }, { name: 'Date', value: date.toLocaleString() })

        // Envoie le message d'avertissement
        channel.send({
            embeds: [warnEmbed]
        });

        // Envoie un message de confirmation
        interaction.editReply({ content: `${target} a été averti par ${member} pour la raison suivante : ${reason}` })
    }
}

module.exports.warns = async(guildId, userId) => {
    return await mongo().then(async(mongoose) => {
        try {
            const result = await warnSchema.findOneAndUpdate({
                guildId,
                userId
            }, {
                guildId,
                userId: userId,
                $push: {
                    warnings: warning
                },
                $inc: {
                    amountWarns: 1,
                },
            }, {
                upsert: true
            })
            return result.amountWarns
        } finally {
            mongoose.connection.close()
        }
    })
}