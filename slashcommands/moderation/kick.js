const d = require('discord.js');

const config = require('../../config.json');

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("kick")
        .setDescription("Expulse un membre du serveur")
        .addUserOption((option) => option
            .setName("membre")
            .setDescription("Le membre à expulser")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("raison")
            .setDescription("La raison de l'expulsion")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(d.PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const { options, guild } = interaction

        const reason = options.getString("raison")

        // Get the member to kick
        const member = await guild.members.fetch(options.getUser("membre").id)

        // Check if the member is admin or moderator
        if (member.permissions.has(d.PermissionFlagsBits.Administrator) || member.permissions.has(d.PermissionFlagsBits.KickMembers)) return interaction.reply({
            content: "Tu ne peux pas expulser ce membre.",
            ephemeral: true
        });
        
        // Kick the member
        await member.kick({
            reason,
        });

        // Find the channel where the kick logs are sent
        const logChannel = guild.channels.cache.get(config.logsChannels[guild.id]);
        if(!logChannel) return interaction.reply({
            content: "Je n'ai pas trouvé le salon des logs.",
            ephemeral: true
        });

        // Send the kick logs
        const banEmbed = new d.EmbedBuilder()
            .setTitle('Membre expulsé')
            .setColor('#f54e42')
            .addFields(
                { name: 'Membre', value: `${member}` },
                { name: 'Raison', value: `${reason}` },
            )
            .setFooter({ text: `Expulsé par ${interaction.user.tag}` })
        
        await logChannel.send({ embeds: [banEmbed] });
       
        // Send the confirmation message
        await interaction.reply({ content: `${member} a été expulsé !`, ephemeral: true })
    }
}