const d = require('discord.js');

const config = require('../config.json');

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("unban")
        .setDescription("Débanni un membre")
        .addStringOption((option) => option
            .setName("userid")
            .setDescription("L'id du membre à débannir")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(d.PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const { options, guild } = interaction;

        const userId = options.getString("userid");

        // Check if the user is banned
        const bannedUsers = await guild.bans.fetch();
        if (bannedUsers.size === 0) return interaction.reply({
            content: "Il n'y a aucun membre banni dans ce serveur.",
            ephemeral: true
        });

        // Get the member to unban
        const user = bannedUsers.find((u) => u.user.id === userId);
        if (!user) return interaction.reply({
            content: "Ce membre n'est pas banni.",
            ephemeral: true
        });

        // Unban the member
        await interaction.guild.members.unban(user.user, "Débanni par " + interaction.user.tag);
        
        // Find the channel where the ban logs are sent
        const logChannel = guild.channels.cache.get(config.logsChannels[guild.id]);
        if(!logChannel) return interaction.reply({
            content: "Je n'ai pas trouvé le salon des logs.",
            ephemeral: true
        });

        // Send the unban logs
        const unbanEmbed = new d.EmbedBuilder()
            .setTitle('Utilisateur débanni')
            .setColor('#42f584')
            .addFields(
                { name: 'Utilisateur', value: `${userId}` },
            )
            .setFooter({ text: `Débanni par ${interaction.user.tag}` })

        await logChannel.send({
            embeds: [unbanEmbed],
        });

        // Send the confirmation message
        await interaction.reply({ content: `${userId} a été débanni !`, ephemeral: true })
    }
}