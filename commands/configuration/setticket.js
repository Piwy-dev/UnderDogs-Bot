const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['setticket', 'st'],

    callback: async (message, args, text, client) => {
        const ticketEmbed = new MessageEmbed()
            .setColor('#4287f5')
            .setTitle('Contacter le staff')
            .setDescription("Si tu as une question, une remarque, une proposition, ..., tu peux contacter le staff en cliquant sur le bouton sous se message. Ceci créera un salon privé entre toi et le staff.")
            .setFooter("⚠️ Merci de ne pas spammer et de ne pas utiliser ce système inutilement. Tout abus sera senctioné !")

        const contactButton = new MessageActionRow()
        .addComponents(
            new MessageButton() 
                .setCustomId('ticket')
                .setLabel("Contacter le staff")
                .setStyle('PRIMARY')
                .setEmoji('📩')
        )

        message.channel.send({ 
            embeds: [ticketEmbed],
            components: [contactButton]
        });

    },
}
