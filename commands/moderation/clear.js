const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    commands: ['clear'],
    minArgs: 1,
    expectedArgs: '<Nombre de messages à éffacer>',

    callback: async ( message, arguments, text, client) => {
        const { member, guild, channel } = message
        if (!member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply("Tu n'as pas la permession d'effectuer cette action.")

        const claerAmount = arguments[0];

        if (isNaN(claerAmount)) return message.reply("Il faut que l'argument sois un nombre.");

        if (claerAmount > 100) return message.reply("Impossible de suprimmer plus de 100 messages en une fois.");
        if (claerAmount < 1) return message.reply("Impossible de supprimer moins de 1 messages.");

        await message.channel.messages.fetch({ limit: claerAmount }).then(messages => {
            message.channel.bulkDelete(messages).catch(e => {
                if (e) return message.reply("Désolé, je ne peux pas supprimer des messages datant de plus que 14 jours.");
            })
        });

        //#region logs du serveur
        // Récupère le channel des logs
        const logChannel = guild.channels.cache.get('922053058442178620')
        if (!logChannel) return console.log("Le channel des logs n'existe pas !")

        // La date du message
        const date = new Date(message.createdTimestamp)
        
        const deleteEmbed = new MessageEmbed()
            .setTitle("Suppression de plusieurs messages !")
            .setDescription(`<@${client.user.id}> a supprimé ${claerAmount} messages dans ${channel}`)
            .addField("Date", `${date.toLocaleString()}`)

        logChannel.send({
            embeds: [deleteEmbed]
        })
        //#endregion
    }
}