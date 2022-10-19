const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setexplserv")
        .setDescription("Ajoute le message des explications des salons.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {
        const { guild, channel } = interaction

        // Création de l'embed
        const explEmbed = new EmbedBuilder()
            .setColor('#4babfa')
            .setTitle('Rooster Brawl Stars')
            .setDescription('**Manager:** <@905594051787624539> \n**Analist:** <@692355433293283358> \n**Coach:** <@523744994880782336> \n**Players:** \n<@973170356275798087> \n<@974603958473596948> \n<@814346587526397962>')
            .setImage('https://imag.malavida.com/qa/qa-brawl-stars-1379.jpg')

        channel.send({ embeds: [explEmbed] })
        interaction.reply({
            content: "Le message des explications a bien été envoyé.",
            ephemeral: true
        })
    }
}