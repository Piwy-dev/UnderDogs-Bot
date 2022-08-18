const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setexplserv")
        .setDescription("Ajoute le message des explications des salons."),

    async execute(interaction, client) {
        const { guild } = interaction

        // Création de l'embed
        const explEmbed = new MessageEmbed()
            .setColor('#4287f5')
            .setTitle('Catégorie Global')
            .addFields({
                name: 'Salon 1',
                value: "<#878783592547901450> : Salon des annonces d'ADH."
            }, {
                name: 'Salon 2',
                value: '<#879699393484324924>: Salon des giveaways.'
            }, {
                name: 'Salon 3',
                value: '<#879699463982166027>: Salon des résultats des giveaways.'
            }, {
                name: 'Salon 4',
                value: '<#1004870776987598898> : Salon pour paler de tout avec les membres.'
            }, {
                name: 'Salon 5',
                value: '<#878783810022547497> : Salon pour partager ses créations. :warning: Pas de Publicité !'
            }, {
                name: 'Salon 6',
                value: '<#879699744832765992> : Salon pour partager ses idées pour le serveur et pour ADH.'
            }, {
                name: 'Salon 7',
                value: '<#881981798194761790>: Salon pour se présenter.'
            })

        interaction.channel.send({ embeds: [explEmbed] })
        interaction.reply({
            content: "Le message des explications a bien été envoyé.",
            ephemeral: true
        })
    }
}