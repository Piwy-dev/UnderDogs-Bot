const { MessageEmbed, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Efface plusieurs messages.")
        .addNumberOption((option) => option
            .setName("nombre")
            .setDescription("Le nombre de messages à supprimer.")
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction

        await interaction.deferReply({ ephmeral: true });

        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply("Tu n'as pas la permession d'effectuer cette action.")

        const claerAmount = options.getNumber("nombre");

        if (claerAmount > 100) return interaction.editReply({
            content: "Impossible de suprimmer plus de 100 messages en une fois.",
            ephmeral: true
        });
        if (claerAmount < 1) return interaction.editReply({
            content: "Impossible de supprimer moins de 1 messages.",
            ephmeral: true
        });

        // Efface les messages
        await channel.messages.fetch({ limit: claerAmount }).then(messages => {
            channel.bulkDelete(messages).catch(e => {
                if (e) return interaction.editReply({
                    content: "Désolé, je ne peux pas supprimer des messages datant de plus que 14 jours.",
                    ephmeral: true
                });
            })
        });

        // Envoie un message de confirmation
        interaction.editReply({
            content: `${claerAmount} messages ont été supprimés.`,
            ephmeral: true
        });
    }
}