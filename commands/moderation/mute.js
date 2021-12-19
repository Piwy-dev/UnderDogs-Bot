const { MessageEmbed, Permissions } = require('discord.js');
const mongo = require('../../mongo');
const muteSchema = require('../../models/mute-schema')

module.exports = {
    commands: ['mute'],
    minArgs: 1,
    expectedArgs: '<Membre a mute> [raison]',

    callback: async (message, args) => {
        const { guild, member } = message

        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({
            content: 'Pour effectuer cette action, tu dois avoir la permission de gérer les messages.',
            ephemeral: true
        })

        const target = message.mentions.members.first() || guild.members.cache.get(args[0]);

        args.shift();
        const reason = args.join(" ");

        if (!target) {
            message.reply("Je n'ai pas pu trouver ce membre!");
            return;
        }

        if (!target.bannable) {
            message.reply("Je n'ai pas les permissions pour mute ce membre.");
            return;
        }

        const muteRole = guild.roles.cache.get('921894147105894470')
        if (!muteRole) return message.reply("Je n'ai pas pu trouvé le role mute!")

        if (target.roles.cache.has(muteRole.id)) return message.reply("Ce membre est déjà mute.")

        target.roles.add(muteRole)

        await mongo().then(async (mongoose) => {
            try {
                await muteSchema.findOneAndUpdate({
                    _id: guild.id
                }, {
                    _id: guild.id,
                    $push: {
                        Users: target.id
                    },
                }, {
                    upsert: true
                })
            } finally {
                mongoose.connection.close()
            }
        })

        message.channel.send(`${target} a été mute! Raison: ${reason}`)

        //#region logs du serveur
        // Récupère le channel des logs
        const logChannel = guild.channels.cache.get('922053058442178620')
        if (!logChannel) return console.log("Le channel des logs n'existe pas !")

        // La date du message
        const date = new Date(message.createdTimestamp)
        
        const deleteEmbed = new MessageEmbed()
            .setTitle("Un utilisateur a été mute !")
            .setColor('#ff0022')
            .setDescription(`${target} a été mute par ${message.author}`)
            .addField("Raison", `${reason}`)
            .addField("Date", `${date.toLocaleString()}`)

        logChannel.send({
            embeds: [deleteEmbed]
        })
        //#endregion
    }
}