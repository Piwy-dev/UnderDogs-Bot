const { MessageEmbed, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Déanni un utilisateur.")
        .addStringOption((option) => option
            .setName("id")
            .setDescription("L'id de l'utilisateur à débannir")
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const { member, guild, options } = interaction

        await interaction.deferReply();

        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.editReply({
            content: 'Pour effectuer cette action, tu dois avoir la permission de bannir des membres.',
            ephemeral: true
        })

        // Vérifie que l'identifiant sois un nombre valide
        const id = parseInt(interaction.options.getString("id"))
        console.log(id)

        if (isNaN(id)) return interaction.editReply({
            content: "Merci d'entrer un identifiant valide",
            ephemeral: true
        });
        if (id.toString().length !== 18) return message.reply({
            content: "Merci d'entrer un identifiant valide",
            ephemeral: true
        });

        try {
            // Trouve l'utilisateur a débanir
            const banList = await guild.bans.fetch();
            const target = banList.get(id);
            console.log(target)

            // Création de l'embed
            const unbanEmbed = new MessageEmbed()
                .setTitle("Un utilisateur a été débanni !")
                .setColor('#00ff2f')
                .setDescription(`${target} a été unban par ${member}`)

            if (target.user.id) {
                guild.members.unban(target.user.id)
                interaction.editReply({
                    embeds: [unbanEmbed]
                });
            } else return interaction.editReply({
                content: "Cet utilisateur n'est pas banni.",
                ephemeral: true
            });
        } catch (err) {
            console.error(err);
        }
    }
}