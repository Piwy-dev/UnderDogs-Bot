const { MessageEmbed, Permissions } = require('discord.js');
const warnShema = require('../../models/warn-schema')
const mongo = require('../../mongo');

let result;

module.exports = {
    commands: ['unwarn'],
    minArgs: 2,
    expectedArgs: '<Membre à unwarn> <numéro du warn ou "all"',

    callback: async (message, args) => {
        const { guild, member, author, channel } = message

        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({
            content: 'Pour effectuer cette action, tu dois avoir la permission de gérer les messages.',
        })

        // Récupère la cible pour retirer un warn
        const target = message.mentions.members.first() || guild.members.cache.get(args[0]);
        if (!target) {
            message.reply("Je n'ai pas pu trouver ce membre!");
            return;
        }

        // Vérifie que le membre aie des avertissements
        await mongo().then(async (mongoose) => {
            try {
                result = await warnShema.findOne({
                    _id: guild.id,
                    userId: target.id
                })
            } finally {
                mongoose.connection.close()
            }
        })
        if (!result) return message.reply("Ce membre n'a pas d'avertissements.")

        // Si on veut retirer tout les avertissements
        if (isNaN(args[1])) {
            await mongo().then(async (mongoose) => {
                try {
                    await warnShema.findOneAndDelete({
                        _id: guild.id,
                        userId: target.id
                    })
                } finally {
                    mongoose.connection.close()
                }
            })
            channel.send(`Tout les avertissements de ${target} ont été retirés.`)
        }
        // Si on veut retirer un seul avertissement
        else {
            // Récupère le numero de l'avetissement à retirer
            const warn = args[1] - 1

            // Vérifie qu'il existe un avertissement avec ce numéro
            if (!result.reasons[warn]) return message.reply("Aucun avertissement ne correspond à ce numéro.")

            // Supprime l'avertissement
            await mongo().then(async (mongoose) => {
                try {
                    result = await warnShema.findOneAndUpdate({
                        _id: guild.id,
                        userId: target.id
                    })

                    await result.reasons.splice(warn, 1)
                    await result.warnAuthors.splice(warn, 1)
                    await result.warnDates.splice(warn, 1)
                    await result.save()
                } finally {
                    mongoose.connection.close()
                }
            })

            message.reply(`L'avertissement numéro ${warn + 1} a été retiré de ${target}`)
        }
    }
}

