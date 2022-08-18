const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bug")
        .setDescription("repport a bug to the bot's creator")
        .addStringOption((option) => option
            .setName("bug")
            .setDescription("The descrition of the bug you want to repport")
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const { guild, user, options } = interaction

        // Création de l'embed
        const bugEmbed = new MessageEmbed()
            .setColor('#eb1a47')
            .setTitle('Nouveau bug')
            .addFields({
                name: 'Description',
                value: options.getString("bug")
            }, {
                name: 'Utilisateur',
                value: `<@user.id>`
            }, {
                name: 'Serveur',
                value: guild.name
            })

        // Envoie le rapport de bug
        client.guilds.cache.get('921685478888058920').channels.cache.get('1006952974247002243').send({ embeds: [bugEmbed] })

        // Envoie un message de confirmation
        interaction.reply({
            content: "Merci, votre bug a bien été repporté !",
            ephemeral: true
        })
    }
}