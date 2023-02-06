const d = require('discord.js')

const mongo = require('../mongo')
const ticketSchema = require('../models/ticket-schema')

module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;
        await interaction.deferReply({ ephemeral: true, })

        const { member, guild, channel, message } = interaction

        if (interaction.customId === "ticket") {

            const ticketChannel = await guild.channels.create({
                name : `ticket-${member.displayName}`,
                type: d.ChannelType.GuildText,
                permissionOverwrites: [{
                        id: guild.id,
                        deny: [d.PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: member.user.id,
                        allow: [d.PermissionFlagsBits.ViewChannel],
                    },
                ],
            });

            const newTicketEmbed = new d.EmbedBuilder()
                .setColor('#42f569')
                .setTitle('Nouveau ticket !')
                .setDescription(`${member} Merci d'expliquer ta question, plainte, proposition, ...`)
                .setFooter({ text: "Tu recevras un message privé quand ce salon sera fermé." })


            const closeButton = new d.ActionRowBuilder()
                .addComponents(
                    new MessageButton()
                    .setCustomId('closeTicket')
                    .setLabel("Fermer")
                    .setStyle(d.ButtonStyle.Danger)
                    .setEmoji('🔒')
                )

            await ticketChannel.send({
                content: `${member}`,
                embeds: [newTicketEmbed],
                components: [closeButton]
            })

            // Enregistre l'id du channel et du membre dans la bdd
            await mongo().then(async(mongoose) => {
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

            await interaction.editReply({ content: "Un salon privé a été crée !" });
        }
        // Quand on appuie sur le bouton pour fermer le salon
        else if (interaction.customId === "closeTicket") {
            // Vérifie que le membre aie la permission de supprimer le salon
            if (!member.permissions.has(d.PermissionFlagsBits.Administrator)) return interaction.reply({
                content: 'Tu ne peux pas supprimer le ticket, seul un administrateur peux le faire.',
                ephemeral: true
            })

            await interaction.editReply({ content: "Ce salon va être supprimé !"});

            // Envoie un message privé au créateur du ticket
            await mongo().then(async mongoose => {
                try {
                    const result = await ticketSchema.findOne({ _id: channel.id })
                    if (!result) return console.log("Ce salon n'a pas été enregistré dans la base de données !")

                    const target = client.users.cache.get(result.memberId)
                    if (!target) return console.log("Le créateur du ticket n'a pas pu être trouvé !")

                    const date = new Date(message.createdTimestamp)

                    const closeTicketEmbed = new d.EmbedBuilder()
                        .setColor('#4287f5')
                        .setTitle('Ticket fermé !')
                        .setDescription(`Ton ticket dans le serveur ${guild.name} a été fermé.`)
                        .addFields({
                            name: "Ouvert par:",
                            value: `${target}`
                        }, {
                            name: "Fermé par:",
                            value: `${member}`
                        }, {
                            name: "Date de création",
                            value: `${date.toLocaleString()}`
                        })

                    target.send({
                        embeds: [closeTicketEmbed]
                    });
                } finally {
                    mongoose.connection.close()
                }
            })

            // Supprime le salon et le document de la bdd
            setTimeout(() => interaction.channel.delete(), 5000)
            await mongo().then(async(mongoose) => {
                try {
                    await ticketSchema.findOneAndDelete({
                        _id: channel.id
                    })
                } finally {
                    mongoose.connection.close()
                }
            })
        } else return;
    });
}