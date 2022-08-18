/*const { Permissions } = require('discord.js');

module.exports = (client) => {
    client.on("messageCreate", async (message) => {
        const { member, guild, content, author, channel } = message

        let filter = msg => {
            return msg.author == author
        }

        channel.awaitMessages(filter, { maxMatches: 10, time: 10 * 1000 })
            .then(collected => {
                console.log('test')
                console.log(collected)
            }).catch(console.error);
    })
} */