const d = require('discord.js');

const config = require('../config.json');

const mongo = require('../db/mongo')
const recrutementSchema = require('../db/recrutement-schema')
const contactSchema = require('../db/contact-schema')
const troupesSchema = require('../db/troupes-schema');

autoroles = [ "883336486475411467", "883336534227550299", "883336562081955881", "883336587176468481", "1071819593053642872", "1071839872773541968", "1071839970832166922", "1071840052759507074", "1071840106224308257", "1071840150973325343"]

module.exports = (client) => {
    client.on(d.Events.InteractionCreate, async interaction => {
        if (!interaction.isButton()) return;

        await interaction.deferReply({ ephemeral: true, })
        const { member, channel, guild, message } = interaction

        //// BOUTON REGLEMENT ////
        if (interaction.customId === "rules") {
            // Trouve le role membre en fonction de l'id du serveur
            const memberRole = guild.roles.cache.find(r => r.id === config.memberRoles[guild.id]);
            if (!memberRole) return console.log("Le rôle membre n'existe pas !")
            member.roles.add(memberRole)
            interaction.editReply({content: "Merci d'avoir accepté le règlement !"})
        }

        //// BOUTONS HDV ////
        else if (interaction.customId in config.hdvRoles) {
            const hdvRole = guild.roles.cache.find(r => r.id === config.hdvRoles[interaction.customId]);
            if (!hdvRole) return console.log("Le rôle HDV n'existe pas !")
            member.roles.add(hdvRole)
            interaction.editReply({content: "Rôle ajouté !"})
        }

        //// BOUTONS MDO ////
        else if (interaction.customId in config.mdoRoles) {
            const mdoRole = guild.roles.cache.find(r => r.id === config.mdoRoles[interaction.customId]);
            if (!mdoRole) return console.log("Le rôle MDO n'existe pas !")
            member.roles.add(mdoRole)
            interaction.editReply({content: "Rôle ajouté !"})
        }

        //// BOUTON RESET ROLES ////
        else if (interaction.customId === "resetRoles") {
            for (const role of autoroles) {
                const autorole = guild.roles.cache.find(r => r.id === role);
                if (!autorole) return console.log("Le rôle n'existe pas !")
                member.roles.remove(autorole)
            }
            interaction.editReply({content: "Rôles supprimés !"})
        }

        //// BOUTON RECRUTEMENT ////
        else if (interaction.customId === "recrutement") {
            // Vérifie si le membre a déjà un salon de recrutement
            let data = false
            await mongo().then(async(mongoose) => {
                try {
                    data = await recrutementSchema.findOne({
                        creatorId: member.id
                    })
                } finally {
                    mongoose.connection.close()
                }
            })
            if (data) return interaction.editReply({content: "Tu as déjà un salon de recrutement !"})

            const ticketChannel = await guild.channels.create({
                name: `recrutement-${member.displayName}`,
                type: d.ChannelType.GuildText,
                permissionOverwrites: [{
                        id: guild.id,
                        deny: [d.PermissionFlagsBits.ViewChannel],
                    }, {
                        id: member.user.id,
                        allow: [d.PermissionFlagsBits.ViewChannel, d.PermissionFlagsBits.SendMessages, d.PermissionFlagsBits.EmbedLinks, d.PermissionFlagsBits.AttachFiles, d.PermissionFlagsBits.AddReactions, d.PermissionFlagsBits.UseExternalEmojis, d.PermissionFlagsBits.ReadMessageHistory, d.PermissionFlagsBits.UseExternalStickers, d.PermissionFlagsBits.UseApplicationCommands],
                    }, {
                        id: "882646756742037515",
                        allow: [d.PermissionFlagsBits.ViewChannel],
                    }

                ]
            });

            const recrutementEmbed = new d.EmbedBuilder()
                .setColor('#42f569')
                .setTitle('Recrutement Clan')
                .setDescription(`Bonjour ${member}, merci de répondre aux questions suivantes pour que nous puissions examiner ta demande au plus vite !
                                - Pseudo
                                - Petit mot sur toi
                                - Niveau d'HDV (+screen)
                                - Compos Maîtrisées.
                                - Palmarès E-Sport.
                                - Palmarès serveur.
                                - Palmarès IG divers.`
                )
                .setFooter({ text: "Tu recevras un message privé quand ce salon sera fermé." })

            const closeButton = new d.ActionRowBuilder()
                .addComponents(
                    new d.ButtonBuilder()
                    .setCustomId('closeTicket')
                    .setLabel("Fermer")
                    .setStyle(d.ButtonStyle.Danger)
                    .setEmoji('🔒')
                )

            await ticketChannel.send({
                content: `${member}`,
                embeds: [recrutementEmbed],
                components: [closeButton]
            })

            // Enregistre le salon de recrutement dans la base de données
            await mongo().then(async(mongoose) => {
                try {
                    await recrutementSchema.findOneAndUpdate({
                        creatorId: member.id
                    }, {
                        creatorId: member.id,
                        channelId: ticketChannel.id,
                    }, {
                        upsert: true
                    })
                } finally {
                    mongoose.connection.close()
                }
            })

            interaction.editReply({content: "Un salon de recrutement a été créé !"})
        }

        //// BOUTON RECRUTEMENT ////
        else if (interaction.customId === "esport") {
            // Vérifie si le membre a déjà un salon de recrutement
            let data = false
            await mongo().then(async(mongoose) => {
                try {
                    data = await recrutementSchema.findOne({
                        creatorId: member.id
                    })
                } finally {
                    mongoose.connection.close()
                }
            })
            if (data) return interaction.editReply({content: "Tu as déjà un salon de recrutement !"})

            const recruitChannel = await guild.channels.create({
                name: `esport-${member.displayName}`,
                type: d.ChannelType.GuildText,
                permissionOverwrites: [{
                        id: guild.id,
                        deny: [d.PermissionFlagsBits.ViewChannel],
                    }, {
                        id: member.user.id,
                        allow: [d.PermissionFlagsBits.ViewChannel, d.PermissionFlagsBits.SendMessages, d.PermissionFlagsBits.EmbedLinks, d.PermissionFlagsBits.AttachFiles, d.PermissionFlagsBits.AddReactions, d.PermissionFlagsBits.UseExternalEmojis, d.PermissionFlagsBits.ReadMessageHistory, d.PermissionFlagsBits.UseExternalStickers, d.PermissionFlagsBits.UseApplicationCommands],
                    }, {
                        id: "882646756742037515",
                        allow: [d.PermissionFlagsBits.ViewChannel],
                    }

                ]
            });

            const recrutementEmbed = new d.EmbedBuilder()
                .setColor('#42f569')
                .setTitle('Recrutement E-Sport')
                .setDescription(`Bonjour ${member}, merci de répondre aux questions suivantes pour que nous puissions examiner ta demande au plus vite !
                - Pseudo
                - Niveau HDV + Screen de ton profil (Troupes, héros...)
                - Compos maîtrisées
                - Expérience en E-Sport
                - Palmarès E-Sport`
                )
                .setFooter({ text: "Tu recevras un message privé quand ce salon sera fermé." })

            const closeButton = new d.ActionRowBuilder()
                .addComponents(
                    new d.ButtonBuilder()
                    .setCustomId('closeTicket')
                    .setLabel("Fermer")
                    .setStyle(d.ButtonStyle.Danger)
                    .setEmoji('🔒')
                )

            await recruitChannel.send({
                content: `${member}`,
                embeds: [recrutementEmbed],
                components: [closeButton]
            })

            // Enregistre le salon de recrutement dans la base de données
            await mongo().then(async(mongoose) => {
                try {
                    await recrutementSchema.findOneAndUpdate({
                        creatorId: member.id
                    }, {
                        creatorId: member.id,
                        channelId: recruitChannel.id,
                    }, {
                        upsert: true
                    })
                } finally {
                    mongoose.connection.close()
                }
            })

            interaction.editReply({content: "Un salon de recrutement a été créé !"})
        }

        //// BOUTON FERMER RECRUTEMENT ////
        else if (interaction.customId === "closeTicket") {
            // Vérifie que le membre aie la permission de supprimer le salon
            if (!member.permissions.has(d.PermissionFlagsBits.ManageChannels)) return interaction.editReply({
                content: 'Tu ne peux pas supprimer le ticket, seul un administrateur peux le faire.',
                ephemeral: true
            })

            interaction.editReply({content: "Ce salon va être supprimé !"})

            await mongo().then(async mongoose => {
                try {
                    const result = await recrutementSchema.findOne({ channelId: channel.id })
                    if (!result) return interaction.editReply({content: "Ticket de recrutement non trouvé !"})
                    const target = client.users.cache.get(result.creatorId)
                    if (!target) return interaction.editReply({content: "Le membre du ticket non trouvé !"})

                    // Envoie un message pour les archives
                    const closeRecruitEmbed = new d.EmbedBuilder()
                        .setColor('#4287f5')
                        .setTitle('Ticket de recrutement fermé !')
                        .addFields({
                            name: "Ouvert par", value: `${target}`, inline: true
                        }, {
                            name: "Fermé par", value: `${member}`, inline: true
                        }, {
                            name: "Serveur", value: `${guild.name}`, inline: true
                        }, {
                            name: "Date de création", value: `${result.createdAt.toLocaleString()}`
                        }, {
                            name: "Date de fermeture", value: `${new Date().toLocaleString()}`
                        })
                    const recrutementsLogsChannel = guild.channels.cache.find(c => c.id === config.recrutmentLogs[guild.id])
                    recrutementsLogsChannel.send({
                        embeds: [closeRecruitEmbed]
                    })

                    // Envoie un message privé au créateur du ticket
                    target.send({
                        embeds: [closeRecruitEmbed]
                    });

                } finally {
                    mongoose.connection.close()
                }
            })

            // Supprime le salon et le document de la bdd
            setTimeout(() => interaction.channel.delete(), 5000)
            await mongo().then(async(mongoose) => {
                try {
                    await recrutementSchema.findOneAndDelete({
                        channelId: channel.id
                    })
                } finally {
                    mongoose.connection.close()
                }
            })
        }

        //// BOUTON RECRUTEMENT ////
        else if (interaction.customId === "contact") {
            // Vérifie si le membre a déjà un salon de contact
            let data = false
            await mongo().then(async(mongoose) => {
                try {
                    data = await contactSchema.findOne({
                        creatorId: member.id
                    })
                } finally {
                    mongoose.connection.close()
                }
            })
            if (data) return interaction.editReply({content: "Tu as déjà un salon de contact !"})

            const ticketChannel = await guild.channels.create({
                name: `contact-${member.displayName}`,
                type: d.ChannelType.GuildText,
                permissionOverwrites: [{
                        id: guild.id,
                        deny: [d.PermissionFlagsBits.ViewChannel],
                    }, {
                        id: member.user.id,
                        allow: [d.PermissionFlagsBits.ViewChannel, d.PermissionFlagsBits.SendMessages, d.PermissionFlagsBits.EmbedLinks, d.PermissionFlagsBits.AttachFiles, d.PermissionFlagsBits.AddReactions, d.PermissionFlagsBits.UseExternalEmojis, d.PermissionFlagsBits.ReadMessageHistory, d.PermissionFlagsBits.UseExternalStickers, d.PermissionFlagsBits.UseApplicationCommands],
                    }, {
                        id: "882646756742037515",
                        allow: [d.PermissionFlagsBits.ViewChannel],
                    }

                ]
            });

            const contactEmbed = new d.EmbedBuilder()
                .setColor('#42f569')
                .setTitle('Contact du staff')
                .setDescription(`Bonjour ${member}, tu peux poser tes questions ici, un membre du staff te répondra dans les plus brefs délais.`)
                .setFooter({ text: "Tu recevras un message privé quand ce salon sera fermé." })

            const closeButton = new d.ActionRowBuilder()
                .addComponents(
                    new d.ButtonBuilder()
                    .setCustomId('closeContact')
                    .setLabel("Fermer")
                    .setStyle(d.ButtonStyle.Danger)
                    .setEmoji('🔒')
                )

            await ticketChannel.send({
                content: `${member}`,
                embeds: [contactEmbed],
                components: [closeButton]
            })

            // Enregistre le salon de contact dans la base de données
            await mongo().then(async(mongoose) => {
                try {
                    await contactSchema.findOneAndUpdate({
                        creatorId: member.id
                    }, {
                        creatorId: member.id,
                        channelId: ticketChannel.id,
                    }, {
                        upsert: true
                    })
                } finally {
                    mongoose.connection.close()
                }
            })

            interaction.editReply({content: "Un salon de contact a été créé !"})
        }

        //// BOUTON FERMER CONTACT ////
        else if (interaction.customId === "closeContact") {
            // Vérifie que le membre aie la permission de supprimer le salon
            if (!member.permissions.has(d.PermissionFlagsBits.Administrator)) return interaction.reply({
                content: 'Tu ne peux pas supprimer le salon, seul un administrateur peux le faire.',
                ephemeral: true
            })

            interaction.editReply({content: "Ce salon va être supprimé !"})

            // Envoie un message privé au créateur du ticket
            await mongo().then(async mongoose => {
                try {
                    const result = await contactSchema.findOne({ creatorId: member.id })
                    if (!result) return interaction.editReply({content: "Tu n'as pas de salon de contact !"})

                    const target = client.users.cache.get(result.creatorId)
                    if (!target) return interaction.editReply({content: "Le membre n'existe pas !"})

                    const closeContactEmbed = new d.EmbedBuilder()
                        .setColor('#4287f5')
                        .setTitle('Salon de contact fermé !')
                        .addFields({
                            name: "Ouvert par", value: `${target}`, inline: true
                        }, {
                            name: "Fermé par", value: `${member}`, inline: true
                        }, {
                            name: "Serveur", value: `${guild.name}`, inline: true
                        }, {
                            name: "Date de création", value: `${result.createdAt.toLocaleString()}`
                        }, {
                            name: "Date de fermeture", value: `${new Date().toLocaleString()}`
                        })

                    target.send({
                        embeds: [closeContactEmbed]
                    });

                    const contactLogsChannel = guild.channels.cache.find(c => c.id === config.recrutmentLogs[guild.id])
                    contactLogsChannel.send({
                        embeds: [closeContactEmbed]
                    })

                } finally {
                    mongoose.connection.close()
                }
            })

            // Supprime le salon et le document de la bdd
            setTimeout(() => interaction.channel.delete(), 5000)
            await mongo().then(async(mongoose) => {
                try {
                    await contactSchema.findOneAndDelete({
                        creatorId: member.id
                    })
                } finally {
                    mongoose.connection.close()
                }
            })
        }

        //// BOUTON HAS-GEMMES ////
        else if (interaction.customId === "has-gemmes") {
            let result;
            await mongo().then(async (mongoose) => {
                try {
                    result = await troupesSchema.findOneAndUpdate({
                        guildId: guild.id,
                    }, {
                        guildId: guild.id,
                        $push: { gemmes: `<@${member.id}>` }
                    }, {
                        upsert: true,
                    })
                } finally {
                    mongoose.connection.close()
                }
            })

            const gemmesEmbed = new d.EmbedBuilder()
            .setColor('#6db586')
            .setTitle('Don à une gemme')
            .setDescription(`Liste des membres du clan qui ont les dons à une gemme : \n ${result.gemmes.join('\n') || "/"}`)
            .setFooter({ text: `Indique au membres du clan si tu as les dons à une gemme avec les réactions ci-dessous.`})
        
            const gemmesButtons = new d.ActionRowBuilder()
                .addComponents(
                    new d.ButtonBuilder()
                        .setCustomId('has-gemmes')
                        .setLabel('Oui')
                        .setStyle(d.ButtonStyle.Success))
                .addComponents(
                    new d.ButtonBuilder()
                    .setCustomId('not-gemmes')
                    .setLabel('Non')
                    .setStyle(d.ButtonStyle.Danger))

            await message.edit({ embeds: [gemmesEmbed], components: [gemmesButtons] })
            await interaction.editReply({content: "Tu as été ajouté dans les dons à une gemme !"})
        }

        //// BOUTON NOT-GEMMES ////
        else if (interaction.customId === "not-gemmes") {
            let result;
            await mongo().then(async (mongoose) => {
                try {
                    result = await troupesSchema.findOneAndUpdate({
                        guildId: guild.id,
                    }, {
                        guildId: guild.id,
                        $pull: { gemmes: `<@${member.id}>` }
                    }, {
                        upsert: true,
                    })
                } finally {
                    mongoose.connection.close()
                }
            })

            const gemmesEmbed = new d.EmbedBuilder()
            .setColor('#6db586')
            .setTitle('Don à une gemme')
            .setDescription(`Liste des membres du clan qui ont les dons à une gemme : \n ${result.gemmes.join('\n') || "/"}`)
            .setFooter({ text: `Indique au membres du clan si tu as les dons à une gemme avec les réactions ci-dessous.`})
        
            const gemmesButtons = new d.ActionRowBuilder()
                .addComponents(
                    new d.ButtonBuilder()
                        .setCustomId('has-gemmes')
                        .setLabel('Oui')
                        .setStyle(d.ButtonStyle.Success))
                .addComponents(
                    new d.ButtonBuilder()
                    .setCustomId('not-gemmes')
                    .setLabel('Non')
                    .setStyle(d.ButtonStyle.Danger))

            await message.edit({ embeds: [gemmesEmbed], components: [gemmesButtons] })
            await interaction.editReply({content: "Tu as été retiré des dons à une gemme !"})
        }
    });
}