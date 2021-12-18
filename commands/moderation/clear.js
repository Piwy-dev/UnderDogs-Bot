const { Permissions } = require('discord.js');

module.exports = {
    commands: ['clear'],
    minArgs: 1,
    expectedArgs: '<Nombre de messages à éffacer>',

    callback: async ( message, arguments ) => {
        const { member, guild } = message
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
    }
}