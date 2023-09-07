const d = require('discord.js');


module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("info")
        .setDescription("Donne des informations sur le bot."),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        const mainEmbed = new d.EmbedBuilder()
            .setTitle("Informations")
            .setColor("#3570bd")
            .setDescription("UnderDogs Bot est le bot officiel de la structure UnderDogs. Il gère la modération et les différente features accessibles aux membres.")
            .addFields(
                { name: "Développeur", value: `<@${process.env.DEV_ID}>`, inline: true },
                { name: "Version", value: "2.0.0", inline: true },
                { name: "Langage", value: "JavaScript", inline: true },
                { name: "Hébergeur", value: "Aucun pour le moment"},
                { name: "Code", value: "https://github.com/Piwy-dev/UnderDogs-Bot"},
            )
            .setTimestamp()

        const moderationEmbed = new d.EmbedBuilder()
            .setTitle("Modération")
            .setColor("#f72a3b")
            .setDescription("Liste des commandes de modération :")
            .addFields(
                { name: "💥 /ban", value: "Bannir un membre du serveur." },
                { name: "🗑️ /clear", value: "Supprimer plusieurs messages dans un salon." },
                { name: "♻️ /clearwarns", value: "Supprimer tous les avertissement d'un membre."},
                { name: "🚀 /kick", value: "Expulser un membre du serveur." },
                { name: "🔇 /mute", value: "Muter un membre du serveur." },
                { name: "🚮 /removewarn", value: "Retirer un avertissement d'un membre." },
                { name: "⏰ /tempmute", value: "Muter temporairement un membre."},
                { name: "🛬 /unban", value: "Débannir un utilisateur." },
                { name: "🔉 /unmute", value: "Démuter un membre du serveur." },
                { name: "⚠️ /warn", value: "Avertir un membre du serveur." },
                { name: "📌 /warnings", value: "Montrer la liste des avertissemnts d'un membre." },
            )

        interaction.editReply({ embeds: [mainEmbed, moderationEmbed] })
    }
}