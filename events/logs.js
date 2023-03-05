const { MessageEmbed, Permissions } = require('discord.js');
const d = require('discord.js');

module.exports = (client) => {
    //#region quand un utilisateur quitte ou est expulisé
    client.on(d.Events.GuildMemberRemove, async member => {
        const { guild } = member

        // Trouve le channel des logs
        const logChannel = guild.channels.cache.get('922053058442178620')
        if (!logChannel) return console.log("Le channel des logs n'existe pas !")

        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });
        // Since there's only 1 audit log entry in this collection, grab the first one
        const kickLog = fetchedLogs.entries.first();

        // Si il n'y a jamais eu de kick
        if (!kickLog) return console.log("Il n'y a pas de logs de kick")

        // Now grab the user object of the person who kicked the member
        // Also grab the target of this action to double-check things
        const { executor, target } = kickLog;

        // Si l'utilisateur a été kick
        if (target.id === member.id) {
            const kickEmbed = new MessageEmbed()
                .setTitle('Un membre a été expulsé du serveur !')
                .setColor('#d40b00')
                .setDescription(`<@${member.user.id}> a été expulsé par ${executor}`)


            logChannel.send({
                embeds: [kickEmbed]
            })
        } 
        // Si l'utilisateur a quitté par lui même
        else {
            const leaveEmbed = new MessageEmbed()
                .setTitle('Un membre a quitté le serveur !')
                .setColor('#d40b00')
                .setDescription(`<@${member.user.id}> a quitté le serveur`)

            logChannel.send({
                embeds: [leaveEmbed]
            })
        }
    });
    //#endregion
}