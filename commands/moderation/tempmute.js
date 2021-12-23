const { MessageEmbed, Permissions } = require('discord.js');
const mongo = require('../../mongo');
const muteSchema = require('../../models/mute-schema')

const ms = require('ms')

module.exports = {
    commands: ['tempmute'],
    minArgs: 2,
    expectedArgs: '<Membre a mute> [raison]',

    callback: async (message, args) => {
        const { guild, member } = message

        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply({
            content: 'Pour effectuer cette action, tu dois avoir la permission de gérer les messages.',
            ephemeral: true
        })

        // Récupère la cible du mute
        const target = message.mentions.members.first() || guild.members.cache.get(args[0]);
        if (!target) {
            message.reply("Je n'ai pas pu trouver ce membre!");
            return;
        }

        // Récupère la raison du mute
        args.shift();
        let reason = args.join(" ");

        // Change la raison en non spécifié si elel n'est pas remplie
        if (reason === "" || " " || undefined) {
            reason = "non spécifiée"
        }

        // Vérifie si le bot a le droit de mute la cible
        if (!target.bannable) {
            message.reply("Je n'ai pas les permissions pour mute ce membre.");
            return;
        }

        // Récupère le temps du mute
        const time = args.shift()
        if (!time) return message.reply("Tu dois préciser un temps pour le mute.")

        // Récupère le rôle mute
        const muteRole = guild.roles.cache.get('921894147105894470')
        if (!muteRole) return message.reply("Je n'ai pas pu trouvé le role mute!")

        // Vérifie si la cible est déjà mute, sinon mute la cible
        if (target.roles.cache.has(muteRole.id)) return message.reply("Ce membre est déjà mute.")
        target.roles.add(muteRole)

        // Enregistre le mute dans la bdd
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

        const muteEmbed = new MessageEmbed()
            .setColor('#575757')
            .setTitle('Un membre a été mute !')
            .setDescription(`${target} a été mute par ${message.author} !`)
            .addField('Raison', reason)

        message.channel.send({
            embeds: [muteEmbed]
        })

        //#region <logs du serveur> 

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

        setTimeout(async function () {
            // Vérifie si le membre est encore mute
            if (!target.roles.cache.has(muteRole.id)) return message.reply("Commande de tempmute annulée car le membre n'est pas mute.")
            target.roles.remove(muteRole)

            await mongo().then(async (mongoose) => {
                try {
                    // Trouve la liste des membres mutes
                    const result = await muteSchema.findOne({ _id: guild.id })
                    if (!result) return message.reply("Commande de tempmute annulée car le membre n'est pas mute.")

                    // Trouve le membre cyble dans la liste
                    const user = result.Users.findIndex((prop) => prop === target.id)
                    if (user == -1) return message.reply("Commande de tempmute annulée car le membre n'est pas mute.")

                    // Supprime le membre de la liste
                    await result.Users.splice(user, 1)
                    await result.save()
                } finally {
                    mongoose.connection.close()
                }
            })

            const unmuteEmbed = new MessageEmbed()
                .setColor('#575757')
                .setTitle('Un membre a été unmute !')
                .setDescription(`${target} a été unmute après ${time}.`)

            message.channel.send({
                embeds: [unmuteEmbed]
            })

            //#region <logs du serveur>
            // Récupère le channel des logs
            const logChannel = guild.channels.cache.get('922053058442178620')
            if (!logChannel) return console.log("Le channel des logs n'existe pas !")

            // La date du message
            const date = new Date(message.createdTimestamp)

            const logsEmbed = new MessageEmbed()
                .setTitle("Un utilisateur a été unmute !")
                .setColor('#00ff2f')
                .setDescription(`${target} a été unmute par ${message.author}`)
                .addField("Date", `${date.toLocaleString()}`)

            logChannel.send({
                embeds: [logsEmbed]
            })
            //#endregion
        }, ms(time))
    }
}