/*const { Permissions } = require('discord.js');

module.exports = (client) => {
    client.on("messageCreate", async (message) => {
        const { member, guild, content, author } = message

        // Vérifie que le message sois dans un serveur
        if (!message.guild) return;

        // Laisse la possibilité aux administrateurs de poster une invitation
        if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;

        function deleteMessage() {
            message.delete()
            message.channel.send(`${author} Ton message a été supprimé, car il contenait une invitation à un autre serveur.`)
        }

        const links = ['discord.gg/', 'discord.com/invite/']
        const forbidenLinks = ['discord.io/', 'pornhub.com/, youporn.com/']

        forbidenLinks.forEach((link) => {
            if (content.includes(link)) {
                message.delete()
                message.channel.send(`${author} Ton message a été supprimé, car il contenait un lien interdit.`)
            }
        })

        for (const link of links) {
            // Vérifie si le message contient un lien d'invitation
            if (!content.includes(link)) return

            const code = content.split(link)[1].split(" ")[0]
            const isguildInvite = guild.invites.cache.has(code)

            if (!isguildInvite) {
                try {
                    const vanity = await message.fetchVanityData();
                    if (!code !== vanity?.code) return deleteMessage();
                }
                catch (err) {
                    deleteMessage()
                }
            }
        }
    })
}*/