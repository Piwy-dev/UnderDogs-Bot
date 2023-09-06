const d = require('discord.js');

const config = require('../../config.json');

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("ban")
        .setDescription("Banni un membre")
        .addUserOption((option) => option
            .setName("membre")
            .setDescription("Le membre à bannir")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("raison")
            .setDescription("La raison du bannissement")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(d.PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const { options, guild } = interaction

        const reason = options.getString("raison")

        // Get the member to ban
        const member = await guild.members.fetch(options.getUser("membre").id)

        // Check if the member is admin or moderator
        if (member.permissions.has(d.PermissionFlagsBits.Administrator) || member.permissions.has(d.PermissionFlagsBits.BanMembers)) return interaction.reply({
            content: "Tu ne peux pas bannir ce membre.",
            ephemeral: true
        });
        
        // Ban the member
        await member.ban({
            reason,
        });

        // Find the channel where the ban logs are sent
        const logChannel = guild.channels.cache.get(config.logsChannels[guild.id]);
        if(!logChannel) return interaction.reply({
            content: "Je n'ai pas trouvé le salon des logs.",
            ephemeral: true
        });

        // Send the ban logs
        const banEmbed = new d.EmbedBuilder()
            .setTitle('Membre banni')
            .setColor('#f54e42')
            .addFields(
                { name: 'Membre', value: `${member}` },
                { name: 'Raison', value: `${reason}` },
            )
            .setFooter({ text: `Banni par ${interaction.user.tag}` })
        
        await logChannel.send({ embeds: [banEmbed] });
       
        // Send the confirmation message
        await interaction.reply({ content: `${member} a été banni !`, ephemeral: true })
    }
}