const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    commands: ['kick'],
    expectedArgs: "<Membre à kick> [Raison]",
    minArgs: 1,

    callback: (message, args) => {
        const { member } = message

        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.reply({
            content: 'Pour effectuer cette action, tu dois avoir la permission de kick des membres.',
            ephemeral: true
        })

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!target) {
            message.reply("Je n'ai pas pu trouver ce membre!");
            return;
        }

        if (!target.bannable) {
            message.reply("Je n'ai pas les permissions pour kick ce membre.");
            return;
        }

        args.shift();
        const reason = args.join(" ");

        if (reason === " " || "" || undefined) {
            reason = "non spécifiée"
        }

        target.kick();

        message.channel.send(`${target} à été kick! Raison: ${reason}`);
    },
};