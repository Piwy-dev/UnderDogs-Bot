const d = require('discord.js');

const mongo = require('../mongo.js')
const muteSchema = require('../models/mute-schema.js')

const config = require('../config.json')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("mute")
        .setDescription("Empêche un membre de parler.")
        .addUserOption((option) => option
            .setName("membre")
            .setDescription("Le membre qui sera muté")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("raison")
            .setDescription("La raison du mute")
        )
        .setDefaultMemberPermissions(d.PermissionFlagsBits.ManageRoles),

    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction

        await interaction.deferReply({ ephemeral: true }, )

        // Vérifie que le membre aie la permission
        if (!member.permissions.has(d.PermissionFlagsBits.ManageMessages)) return interaction.editReply({
            content: 'Pour effectuer cette action, tu dois avoir la permission de gérer les messages.',
            ephemeral: true
        })

        // Récupère le membre à mute
        const target = guild.members.cache.get(options.getUser("membre").id)

        if (!target) {
            interaction.editReply("Je n'ai pas pu trouver ce membre!");
            return;
        }

        // Vérifie que le membre puisse être mute
        if (!target.bannable) {
            interaction.editReply("Je n'ai pas les permissions pour mute ce membre.");
            return;
        }

        const muteRole = guild.roles.cache.get(config.muteRoles[guild.id])
        if (!muteRole) return interaction.editReply("Je n'ai pas pu trouvé le role mute!")

        if (target.roles.cache.has(muteRole.id)) return interaction.editReply("Ce membre est déjà mute.")

        target.roles.add(muteRole)

        await mongo().then(async(mongoose) => {
            try {
                await muteSchema.findOneAndUpdate({
                    _id: guild.id
                }, {
                    _id: guild.id,
                    $push: {
                        Users: target.id
                    },
                }, {
                    upsert: true
                })
            } catch (error) {
                console.log(error)
            } finally {
                mongoose.connection.close()
            }
        })

        // Envoie un message de confirmation
        interaction.editReply({
            content: `${target} a été mute.`,
            ephemeral: true
        })

        // Envoie un message d'alerte aux membres du serveur
        const muteEmbed = new d.EmbedBuilder()
            .setColor('#575757')
            .setTitle('Un membre a été mute !')
            .setDescription(`${target} a été mute par ${member} !`)
            .addFields({ name: 'Raison', value: options.getString("raison") || "Non spécifiée" }, )

        
        // Find the channel where the ban logs are sent
        const logChannel = guild.channels.cache.get(config.logsChannels[guild.id]);
        if(!logChannel) return interaction.reply({
            content: "Je n'ai pas trouvé le salon des logs.",
            ephemeral: true
        });

        logChannel.send({
            embeds: [muteEmbed]
        })
    }
}