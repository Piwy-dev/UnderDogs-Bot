const { MessageEmbed, Permissions } = require('discord.js');
const mongo = require('../../mongo');
const muteSchema = require('../../models/mute-schema')

module.exports = {
    commands: ['unmute'],
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

        if (!target) {
            message.reply("Je n'ai pas pu trouver ce membre!");
            return;
        }

        const muteRole = guild.roles.cache.get('921894147105894470')
        if (!muteRole) return message.reply("Je n'ai pas pu trouvé le role mute!")

        if (!target.roles.cache.has(muteRole.id)) return message.reply("Ce membre n'est pas mute.")
        target.roles.remove(muteRole)

        await mongo().then(async (mongoose) => {
            try {
                // Trouve la liste des membres mutes
                const result = await muteSchema.findOne({ _id: guild.id })
                if(!result) return message.reply("Il n'y a pas de membres mute dans le serveur.")

                // Trouve le membre cyble dans la liste
                const user = result.Users.findIndex((prop) => prop === target.id)
                if (user == -1) return message.reply("Ce membre n'est pas mute")

                // Supprime le membre de la liste
                await result.Users.splice(user, 1)
                await result.save()
            } finally {
                mongoose.connection.close()
            }
        })

        message.reply(`${target} a été unmute !`)

         //#region logs du serveur
        // Récupère le channel des logs
        const logChannel = guild.channels.cache.get('922053058442178620')
        if (!logChannel) return console.log("Le channel des logs n'existe pas !")

        // La date du message
        const date = new Date(message.createdTimestamp)
        
        const deleteEmbed = new MessageEmbed()
            .setTitle("Un utilisateur a été unmute !")
            .setColor('#00ff2f')
            .setDescription(`${target} a été unmute par ${message.author}`)
            .addField("Date", `${date.toLocaleString()}`)

        logChannel.send({
            embeds: [deleteEmbed]
        })
        //#endregion
    }
}