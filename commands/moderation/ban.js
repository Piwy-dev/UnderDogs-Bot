const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    commands: ['ban'],
    expectedArgs: "<Membre à bannir> [Raison]",
    minArgs: 1,

    callback: (message, arguments) => {
        const {member, guild } = message
        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply({
            content: 'Pour effectuer cette action, tu dois avoir la permission de ban des membres.',
            ephemeral: true
        })
        const target = message.mentions.members.first() || message.guild.members.cache.get(arguments[0]);

        if (!target) {
            message.reply("Je n'ai pas pu trouver ce membre!");
            return;
        }

        if (!target.bannable) {
            message.reply("Je n'ai pas les permissions pour ban ce membre.");
            return;
        }

        arguments.shift();
        let reason = arguments.join(" ");

        if (reason === " " || "") {
            reason = "non spécifiée"
        }

        target.ban({
            reason,
        });

        message.channel.send(`${target} à été ban! Raison: ${reason}`);

        //#region logs du serveur
        // Récupère le channel des logs
        const logChannel = guild.channels.cache.get('922053058442178620')
        if (!logChannel) return console.log("Le channel des logs n'existe pas !")

        // La date du message
        const date = new Date(message.createdTimestamp)
        
        const banLogEmbed = new MessageEmbed()
            .setTitle("Un utilisateur a été ban !")
            .setColor('#ff0022')
            .setDescription(`${target} a été ban par ${message.author}`)
            .addField("Raison", `${reason}`)
            .addField("Date", `${date.toLocaleString()}`, true)

        logChannel.send({
            embeds: [banLogEmbed]
        })
        //#endregion
    },
};