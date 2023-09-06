/**
 * This module contains many builders (embeds, buttons...) that are used in the bot.
 */
const d = require('discord.js')

const rulesEmbed = new d.EmbedBuilder()
    .setTitle("Règles du serveur")
    .setColor("#5bc98e")
    .setDescription("Voici les règles du serveur. Merci de les respecter.")
    .addFields(
        { name: "Règle 1", value: "On respecte les membres du serveur. Toute forme de harcèlement est évidemment interdite." },
        { name: "Règle 2", value: "On n'envoie pas de contenu choquant ni de message déplacé." },
        { name: "Règle 3", value: "Les bans sont définitifs. Réfléchissez bien avant d'enfreindre les règles." },
        { name: "Règle 4", value: "@everyone et @here sont réservés uniquement aux membres du Staff et Modérateurs." },
        { name: "Règle 5", value: "Toute publicité est interdite." },
        { name: "Règle 6", value: "Le spam est intedit." },
        { name: "Règle 7", value: "On évite de mentionner avec insistance les membres du serveurs." },
        { name: "Règle 8", value: "On respecte les sujets des salons, on évite de trop s'en éloigner." },
    )

const rulesButton = new d.ActionRowBuilder()
    .addComponents(
        new d.ButtonBuilder()
            .setCustomId("rules")
            .setLabel("Accepter le règlement")
            .setStyle(d.ButtonStyle.Success)
    )

module.exports = {
    rulesEmbed,
    rulesButton
}