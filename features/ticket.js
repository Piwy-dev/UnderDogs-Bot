const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const mongo = require('../mongo')
const ticketSchema = require('../models/ticket-schema')

module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        const { member, guild, channel, message } = interaction

        if (interaction.customId === "ticket") {

            const ticketChannel = await guild.channels.create(`ticket-${member.displayName}`, {
                type: 'GUILD_TEXT',
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                    {
                        id: member.user.id,
                        allow: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                ],
            });

            const newTicketEmbed = new MessageEmbed()
                .setColor('#42f569')
                .setTitle('Nouveau ticket !')
                .setDescription(`${member} Merci d'expliquer ta question, plainte, proposition, ...`)
                .setFooter("Tu recevras un message privé quand ce salon sera fermé.")


            const closeButton = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('closeTicket')
                        .setLabel("Fermer")
                        .setStyle('DANGER')
                        .setEmoji('🔒')
                )

            await ticketChannel.send({
                content: `${member}`,
                embeds: [newTicketEmbed],
                components: [closeButton]
            })

            // Enregistre l'id du channel et du membre dans la bdd
            await mongo().then(async (mongoose) => {
                try {
                    await ticketSchema.findOneAndUpdate({
                        _id: ticketChannel.id
                    }, {
                        _id: ticketChannel.id,
                        memberId: member.id
                    }, {
                        upsert: true
                    })
                } finally {
                    mongoose.connection.close()
                }
            })

            await interaction.reply({
                content: "Un salon privé a été crée !",
                ephemeral: true
            });
        }
        // Quand on appuie sur le bouton pour fermer le salon
        else if (interaction.customId === "closeTicket") {
            // Vérifie que le membre aie la permission de supprimer le salon
            if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({
                content: 'Tu ne peux pas supprimer le ticket, seul un administrateur peux le faire.',
                ephemeral: true
            })

            await interaction.reply({
                content: "Ce salon va être supprimé !",
            });

            // Envoie un message privé au créateur du ticket
            await mongo().then(async mongoose => {
                try {
                    const result = await ticketSchema.findOne({ _id: channel.id })
                    if (!result) return console.log("Ce salon n'a pas été enregistré dans la base de données !")

                    const target = client.users.cache.get(result.memberId)
                    if (!target) return console.log("Le créateur du ticket n'a pas pu être trouvé !")

                    const date = new Date(message.createdTimestamp)

                    const closeTicketEmbed = new MessageEmbed()
                    .setColor('#4287f5')
                    .setTitle('Ticket fermé !')
                    .setDescription(`Ton ticket dans le serveur ${guild.name} a été fermé.`)
                    .addField("Ouvert par:", `${target}`)
                    .addField("Fermé par:", `${member}`)
                    .addField("Date de création", `${date.toLocaleString()}`)

                    target.send({
                        embeds: [closeTicketEmbed]
                    });
                } finally {
                    mongoose.connection.close()
                }
            })

            // Supprime le salon et le document de la bdd
            setTimeout(() => interaction.channel.delete(), 5000)    
            await mongo().then(async (mongoose) => {
                try {
                    await ticketSchema.findOneAndDelete({
                        _id: channel.id
                    })
                } finally{
                    mongoose.connection.close()
                }
            })
        }
        else return;
    });
}
