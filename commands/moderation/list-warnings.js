const { MessageEmbed, Permissions } = require('discord.js');

const warnShema = require('../../models/warn-schema')
const mongo = require('../../mongo');

let result;

module.exports = {
    commands: ['list-warnings', 'lw'],
    minArgs: 1,
    expectedArgs: '<Membre dont on veut voir les avertissements>',

    callback: async(message, args) => {
        const { guild, member, author } = message

        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({
            content: 'Pour effectuer cette action, tu dois avoir la permission de gérer les messages.',
            ephemeral: true
        })

        // Récupère le membre dont on veut voir les avertissements
        const target = message.mentions.members.first() || guild.members.cache.get(args[0]);
        if (!target) {
            message.reply("Je n'ai pas pu trouver ce membre!");
            return;
        }

        await mongo().then(async(mongoose) => {
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

        const warnEmbed = new MessageEmbed()
            .setTitle(`Récapitulatif des avertissemnts`)
            .setDescription(`Voici les avertissements de ${target}:`)

        for (let counter = 0; counter < result.reasons.length; ++counter) {
            const warnAuthor = result.warnAuthors[counter]
            const warnDate = result.warnDates[counter]
            const reason = result.reasons[counter]

            warnEmbed.addField(`Avertissement ${counter + 1}`, `Reçu par <@${warnAuthor}> le ${new Date(warnDate).toLocaleDateString()}, \n Raison: ${reason}`)
        }

        message.channel.send({
            embeds: [warnEmbed]
        });

    }
}