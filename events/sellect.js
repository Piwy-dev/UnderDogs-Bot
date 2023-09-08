const d = require('discord.js');
const config = require('../config.json');


module.exports = (client) => {
    client.on(d.Events.InteractionCreate, async interaction => {
        if (!interaction.isStringSelectMenu()) return;

        await interaction.deferReply({ ephemeral: true });

        const { values, member, guild, component } = interaction

        if (interaction.customId === 'notification') {
            const removed = component.options.filter((option) => {
                return !values.includes(option.values)
            })

            for(const notif of removed){
                member.roles.remove(config.notificationRoles[guild.id][notif.value])
            }

            for(const notif of values){
                member.roles.add(config.notificationRoles[guild.id][notif])
            }

            interaction.editReply({ content: "Merci d'avoir sélectionné tes notifications !" })
        }
    })
}