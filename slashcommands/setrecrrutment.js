const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setrecrutement")
        .setDescription("Configure le recrutement.")
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_MESSAGES),

    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction

        await interaction.deferReply({
            ephemeral: true,
        })

        const ticketEmbed = new MessageEmbed()
            .setColor('#4287f5')
            .setTitle('Recrutement')
            .setDescription("Appuie sur le bouton ci-dessus pour postuler pour rejoindre l'équipe ou le staff ADH.")
            .setFooter({ text: "⚠️ Merci de ne pas spammer et de ne pas utiliser ce système inutilement. Tout abus sera sanctionné !" })

        const contactButton = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('recrutement')
                .setLabel("Postuler")
                .setStyle('PRIMARY')
                .setEmoji('📩')
            )

        // Envoie le message
        channel.send({
            embeds: [ticketEmbed],
            components: [contactButton]
        });

        // Envoie le message de confiramtion
        interaction.editReply({ content: "Message de recrutement envoyé !" })
    }
}