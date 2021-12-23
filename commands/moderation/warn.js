const { MessageEmbed, Permissions } = require('discord.js');
const warnShema = require('../../models/warn-schema')
const mongo = require('../../mongo');

let result;

module.exports = {
    commands: ['warn', 'avert'],
    minArgs: 1,
    expectedArgs: '<Membre à avertir> <Warn>',

    callback: async (message, args) => {
        const { guild, member, author } = message

        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({
            content: 'Pour effectuer cette action, tu dois avoir la permission de gérer les messages.',
            ephemeral: true
        })

        // Récupère la cible du warn
        const target = message.mentions.members.first() || guild.members.cache.get(args[0]);
        if (!target) {
            message.reply("Je n'ai pas pu trouver ce membre!");
            return;
        }

        // Récupère la raison du warn
        args.shift();
        let reason = args.join(" ");
        if (!reason) {
            reason = "non spécifiée"
        }

        // La date du message
        const date = new Date(message.createdTimestamp)

        await mongo().then(async (mongoose) => {
            try {
                result = await warnShema.findOneAndUpdate({
                    _id: guild.id,
                    userId: target.id
                }, {
                    _id: guild.id,
                    userId: target.id,
                    $push: {
                        warnAuthors: author.id,
                        warnDates: date,
                        reasons: reason,
                    },
                }, {
                    upsert: true,
                    new: true,
                })
            }
            finally {
                mongoose.connection.close()
            }
        })

        const warnEmbed = new MessageEmbed()
            .setTitle('Nouvel avertissemnt !')
            .setDescription(`${target} a reçu un nouvel avertissement par ${author}. \n Il a maintenant ${result.reasons.length} avertissement(s)`)
            .addField('Raison', reason)
            .addField('Date', date.toLocaleString())

        message.channel.send({
            embeds: [warnEmbed]
        });

    }
}

module.exports.warns = async (guildId, userId) => {
    return await mongo().then(async (mongoose) => {
        try {
            const result = await warnShema.findOneAndUpdate({
                guildId,
                userId
            }, {
                guildId,
                userId: userId,
                $push: {
                    warnings: warning
                },
                $inc: {
                    amountWarns: 1,
                },
            }, {
                upsert: true
            })
            return result.amountWarns
        }
        finally {
            mongoose.connection.close()
        }
    })
}