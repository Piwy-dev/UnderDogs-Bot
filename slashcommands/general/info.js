const d = require('discord.js');


module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("info")
        .setDescription("shows how to use the bot")
        .setDescriptionLocalizations({
            fr: 'Montre comment utiliser le bot.',
        }),

    async execute(interaction) {
        console.log("info command executed")
    }
}