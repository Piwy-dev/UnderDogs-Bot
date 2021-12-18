const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    commands: ['ban'],
    expectedArgs: "<Membre à bannir> [Raison]",
    minArgs: 1,

    callback: (message, arguments) => {
        const {member} = message
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
        const reason = arguments.join(" ");

        if (reason === " " || "") {
            reason = "non spécifiée"
        }

        target.ban({
            reason,
        });

        message.channel.send(`${target} à été ban! Raison: ${reason}`);
    },
};