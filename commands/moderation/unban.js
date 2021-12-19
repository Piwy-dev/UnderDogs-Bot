const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    commands: ['unban'],
    expectedArgs: "<Membre à débannir>",
    minArgs: 1,
    maxArgs: 1,

    callback: async (message, arguments) => {
        const { member, guild } = message
        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply({
            content: 'Pour effectuer cette action, tu dois avoir la permission de bannir des membres.',
            ephemeral: true
        })

        // Vérifie que l'identifiant sois un valide
        if (isNaN(arguments[0])) return message.reply("Merci d'entrer un identifiant valide");
        if (arguments.toString().length !== 18) return message.reply("Merci d'entrer un identifiant valide");

        try {
            // Trouve l'utilisateur a débanir
            const banList = await message.guild.bans.fetch();
            const bannedUser = banList.get(arguments[0]);

            if (bannedUser) {
                guild.members.unban(bannedUser.user.id)
                message.channel.send(`${bannedUser.user.username} est débanni.`);
                //#region logs du serveur
                // Récupère le channel des logs
                const logChannel = guild.channels.cache.get('922053058442178620')
                if (!logChannel) return console.log("Le channel des logs n'existe pas !")

                // La date du message
                const date = new Date(message.createdTimestamp)

                const unbanLogEmbed = new MessageEmbed()
                    .setTitle("Un utilisateur a été débanni !")
                    .setColor('#00ff2f')
                    .setDescription(`${bannedUser.user.username} a été unban par ${message.author}`)
                    .addField("Date", `${date.toLocaleString()}`, true)

                logChannel.send({
                    embeds: [unbanLogEmbed]
                })
                //#endregion
            }
            else return message.channel.send("Cet utilisateur n'est pas banni.");
        } catch (err) {
            console.error(err);
        }
    },
};