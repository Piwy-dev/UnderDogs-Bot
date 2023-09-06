const d = require('discord.js');

const mongo = require('../../db/mongo.js')
const warnSchema = require('../../db/warn-schema')

const config = require('../../config.json')

let result;

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("removewarn")
        .setDescription("Retire un avertissement à un membre")
        .addUserOption((option) => option
            .setName("cyble")
            .setDescription("Le membre dont on veut retirer l'avertissement")
            .setRequired(true)
        )
        .addIntegerOption((option) => option
            .setName("identifiant")
            .setDescription("L'identifiant de l'avertissement à retirer")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(d.PermissionFlagsBits.ManageChannels),

    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction

        await interaction.deferReply( { ephemeral: true } )

        // Récupère le membre dont on veut voir les avrtissements
        const target = guild.members.cache.get(options.getUser("cyble").id)

        // Vérifie que le membre aie des avertissements
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
        if (!result) return interaction.editReply({ content: "Ce membre n'a pas d'avertissement", ephemeral: true })

        // Récupère l'id de l'avertissement à supprimer
        const warnId = options.getInteger("identifiant")

        // Vérifie que l'id de l'avertissement existe
        if (warnId > result.warnings.length || warnId < 1) return interaction.editReply({ content: "Cet avertissement n'existe pas.", ephemeral: true })

        // Supprime l'avertissement
        await mongo().then(async(mongoose) => {
            try {
                result = await warnSchema.findOneAndUpdate({
                    guildId: guild.id,
                    userId: target.id
                }, {
                    $pull: {
                        warnings: result.warnings[warnId - 1]
                    },
                }, {
                    upsert: true,
                    new: true,
                })
            } finally {
                mongoose.connection.close()
            }
        })
        
        // Find the channel where the logs are sent
        const logChannel = guild.channels.cache.get(config.logsChannels[guild.id]);
        if(!logChannel) return interaction.reply({
            content: "Je n'ai pas trouvé le salon des logs.",
            ephemeral: true
        });

        // Création de l'embed
        const warnEmbed = new d.EmbedBuilder()
        .setTitle('Avertissement retiré !')
        .setColor('#3dd98b')
        .setDescription(`L'avertsissement n°${warnId} à été retiré de ${target} par ${member}. \nIl a maintenant: ${result.warnings.length} avertissement(s).`)

        // Send the log message
        logChannel.send({
            embeds: [warnEmbed]
        });

        // Envoie un message de confirmation
        interaction.editReply(`L'avertissement n°${warnId} à été retiré de ${target}.`)
    }
}