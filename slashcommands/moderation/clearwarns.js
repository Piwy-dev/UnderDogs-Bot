const d = require('discord.js');

const mongo = require('../../db/mongo.js')
const warnSchema = require('../../db/warn-schema')

const config = require('../../config.json')

let result;

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("clearwarns")
        .setDescription("Retire tous les avertissements d'un membre")
        .addUserOption((option) => option
            .setName("target")
            .setDescription("Le membre à qui retirer les avertissements")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(d.PermissionFlagsBits.ManageChannels),

    async execute(interaction, client) {
        const { member, guild, options } = interaction

        await interaction.deferReply( { ephemeral: true } )

        // Get the member to remove the warnings from
        const target = guild.members.cache.get(options.getUser("target").id)

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
        if (!result) return interaction.editReply({ content: "Ce membre n'a pas d'avertissements", ephemeral: true })

        // Delete all warnings from the database
        await mongo().then(async(mongoose) => {
            try {
                await warnSchema.findOneAndDelete({
                    guildId: guild.id,
                    userId: target.id
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
        .setTitle('Tous les avertissemtns retirés !')
        .setColor('#3dd98b')
        .setDescription(`Tous les avertissemnts de ${target} ont été retirés par : ${member}.`)

        // Send the log message
        logChannel.send({
            embeds: [warnEmbed]
        });

        // Envoie un message de confirmation
        interaction.editReply(`Tous les avertissements de ${target} ont été retirés.`)
    }
}