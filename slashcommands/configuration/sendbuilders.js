const d = require('discord.js')
const builders = require('../../builders')


module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("sendbuilders")
        .setDescription("Envoie un message avec les builders (embeds, boutons...) sellectionnés.")
        .setDefaultMemberPermissions(d.PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        interaction.reply({ 
            embeds: [builders.rulesEmbed],
            components: [builders.rulesButton]
        })
    }
}