const d = require('discord.js')

const mongo = require('../../db/mongo.js')
const warnSchema = require('../../db/warn-schema')

const config = require('../../config.json')

let result;

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("warn")
        .setDescription("Avertit un membre")
        .addUserOption((option) => option
            .setName("membre")
            .setDescription("Le membre à avertir")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("raison")
            .setDescription("La raison de l'avertissement")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(d.PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const { member, guild, options } = interaction

        await interaction.deferReply({ ephemeral: true })

        const target = guild.members.cache.get(options.getUser("membre").id)
        const reason = options.getString("raison")

        // Date of the warning
        const date = new Date(interaction.createdTimestamp)

        // Check if the target is admin or moderator
        if (target.permissions.has(d.PermissionFlagsBits.ManageChannels || d.PermissionFlagsBits.Administrator))
            return interaction.editReply({ content: "Tu ne peux pas avertir ce membre !" });

        // Create the warning
        const warning = {
            reason: reason,
            authorId: member.id,
            date: date
        }

        // Add the warning to the database
        await mongo().then(async (mongoose) => {
            try {
                result = await warnSchema.findOneAndUpdate({
                    guildId: guild.id,
                    userId: target.id
                }, {
                    guildId: guild.id,
                    userId: target.id,
                    $push: {
                        warnings: warning
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
        const warnEmbed = new d.EmbedBuilder()
            .setTitle('Nouvel avertissement !')
            .setDescription(`${target} a reçu un nouvel avertissemnt par : ${member}. \nIl a maintement : ${result.warnings.length} avertissement(s).`)
            .addFields(
                { name: 'Raison', value: `${reason}` },
                { name: 'Date', value: date.toLocaleString() },
                { name: 'Warning Id', value: `${result.warnings.length}` }
            )

        // Find the channel where the ban logs are sent
        const logChannel = guild.channels.cache.get(config.logsChannels[guild.id]);
        if (!logChannel) return interaction.reply({
            content: "Je n'ai pas trouvé le salon des logs.",
            ephemeral: true
        });

        // Envoie le message d'avertissement
        logChannel.send({
            embeds: [warnEmbed]
        });

        // Envoie un message de confirmation
        interaction.editReply({ content: `${target} a reçu un avertisssemnt de : ${member}, pour la raison : ${reason}`, ephemeral: true })
    }
}
