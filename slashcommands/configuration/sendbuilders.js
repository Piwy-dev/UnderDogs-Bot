const d = require('discord.js')
const builders = require('../../builders')


module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("sendbuilders")
        .setDescription("Envoie un message avec les builders (embeds, boutons...) sellectionnés.")
        .setDefaultMemberPermissions(d.PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const { channel } = interaction

        await interaction.deferReply({ ephemeral: true })

        channel.send({
            embeds: [builders.rulesEmbed],
            components: [builders.rulesButton]
        })

        interaction.editReply({ 
            content: "Message envoyé !",
            ephemeral: true
        })
    }
}