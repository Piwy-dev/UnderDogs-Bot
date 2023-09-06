const d = require('discord.js');

const mongo = require('../../db/mongo.js')

const muteSchema = require('../../db/mute-schema.js')

const config = require('../../config.json')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Permert à un membre de parler à nouveau.")
        .addUserOption((option) => option
            .setName("membre")
            .setDescription("Le membre qui sera unmute")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(d.PermissionFlagsBits.ManageRoles),
        
    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction

        await interaction.deferReply({ ephemeral: true }, )

        if(!member.permissions.has(d.PermissionFlagsBits.ManageMessages)) return interaction.editReply({
            content: 'Pour effectuer cette action, tu dois avoir la permission de gérer les messages.',
        })

        const target = guild.members.cache.get(options.getUser("membre").id)

        if (!target) {
            interaction.editReply("Je n'ai pas pu trouver ce membre!");
            return;
        }

        const muteRole = guild.roles.cache.get(config.muteRoles[guild.id])
        if (!muteRole) return interaction.editReply("Je n'ai pas pu trouvé le role mute!")

        // Vérifie si le membre est mute
        if (!target.roles.cache.has(muteRole.id)) return interaction.editReply("Ce membre n'est pas mute.")

        target.roles.remove(muteRole)

        await mongo().then(async(mongoose) => {
            try {
                // Trouve la liste des membres mutes
                const result = await muteSchema.findOne({ _id: guild.id })
                if (!result) return interaction.editReply("Il n'y a pas de membres mute dans le serveur.")

                // Trouve le membre cyble dans la liste
                const user = result.Users.findIndex((prop) => prop === target.id)
                if (user == -1) return interaction.editReply("Ce membre n'est pas mute")

                // Supprime le membre de la liste
                await result.Users.splice(user, 1)
                await result.save()
            } finally {
                mongoose.connection.close()
            }
        })

        // Envoie un message de confirmation
        interaction.editReply({
            content: `${target} a été unmute.`,
            ephemeral: true
        })

        const muteEmbed = new d.EmbedBuilder()
            .setColor('#1a965c')
            .setTitle('Un membre a été unmute !')
            .setDescription(`${target} a été unmute par ${member} !`)

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