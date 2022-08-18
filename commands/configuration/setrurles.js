const Discord = require('discord.js')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['setrules', 'sr'],

    callback: async(message, args, text, client) => {
        const rulesEmbed = new MessageEmbed()
            .setColor('#5bc98e')
            .setTitle('Règlement du serveur')
            .setDescription(
                "Bienvenue à toi sur le serveur de ADH E-Sport ! \n\nAvant toute chose, je te conseille très fortement de lire les règles ci-dessous afin de mieux comprendre le fonctionnement du serveur. Celles-ci s'appliquent à tous les salon textuels et vocaux. \n\n Le staff du serveur se réserve le droit de supprimer tout message pour des motifs d’organisation (afin de rendre plus lisible les salons) ou à des fins de modération, ainsi que de sanctionner toute personne dont le comportement serait jugé mauvais pour le serveur. Nous nous réservons aussi le droit de changer et/ou modifier ce règlement. \n\n Vous pouvez signaler un comportement contraire aux règles en contactant un membre du staff dans <#1006661672863289474>. \n\n N'hésitez pas à faire un tour dans le salon <#1006662021921644587> pour en apprendre plus sur le serveur! \n\n Pour rappel voici les règles d'utilisation de discord que vous devez respecter: https://discord.com/guidelines."
            )
            .addField("Règle 1", "Les abus de majuscules et d'emojis sont interdits.")
            .addField("Règle 2", "Pas de NSFW, de racisme, de sexisme, de harcèlement ou autres.")
            .addField("Règle 3", "Ce serveur est francophone, merci d'écrire et de parler en français.")
            .addField("Règle 4", "Les liens vers des sites douteux/inconnus sont strictement interdits.")
            .addField("Règle 5", "Les bans sont définitifs. Réfléchissez bien avant d'enfreindre les règles.")
            .addField("Règle 6", "@everyone et @here sont réservés uniquement aux membres du Staff et Modérateurs.")
            .addField("Règle 7", "Toute publicité est interdite.")
            .addField("Règle 8", "Le spam est intedit.")
            .setFooter("Afin d'accéder au serveur, merci de confirmer que tu acceptes le présent règlement.")

        const acceptButton = new MessageActionRow()
            .addComponents(
                new MessageButton() // Création du bouton d'invitation
                .setCustomId('rules')
                .setLabel("J'accepte le règlement")
                .setStyle('PRIMARY')
            )

        message.channel.send({
            embeds: [rulesEmbed],
            components: [acceptButton]
        });

    },
}