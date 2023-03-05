const d = require('discord.js')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("setrosters")
        .setDescription("Ajoute le message des roosters.")
        .setDefaultMemberPermissions(d.PermissionFlagsBits.Administrator),

    async execute(interaction, client) {
        const { guild, channel } = interaction

        const cocEmbed = new d.EmbedBuilder()
            .setColor('#ffc800')
            .setTitle('Roster Clash of Clans')
            .setDescription("Le roster Clash of Clans est formé d'un tout nouveau clan. L'objectif pour celui-ci est dans un premier temps d'avoir une base concrète et stable de joueurs motivés et actifs (th 12-15), afin d'éventuellement plus tard pouvoir s'investir sur la scène E-sport Coc.")
            .addFields({
                name: "Nom du clan", value: "AdHonores", inline: true
            }, {
                name: "Nombre de membres", value: "32/50", inline: true
            }, {
                name: "Niveau du clan", value: "1", inline: true
            }, {
                name: "Niveau de la capitale", value: "0", inline: true
            }, {
                name: "Nombre de guerres gagnées", value: "1/1", inline: true
            }, {
                name: "Chef", value: "<@272784474448592898>", inline: true
            }, {
                name: "Chefs adjoints", value: "Axis \nClément \n<@585501748660011010> \nzRobin"
            })
            .setFooter({ text: "Si vous voulez plus d'informations ou si vous voulez rejoindre le clan, rejoignez le serveur dédié via le lien ci-dessous."})
        
        const linkButton = new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder()
                    .setLabel("Serveur du roster")
                    .setStyle(d.ButtonStyle.Link)
                    .setURL("https://discord.gg/s2HtHVJ4rh")
            )

        const rostersMessage = await client.guilds.cache.get("718964030546640968").channels.cache.get('891082288996163594').messages.fetch('1074365767413407794')
        rostersMessage.edit({ embeds: [cocEmbed], components: [linkButton] })
        interaction.reply({
            content: "Le message des roosters a bien été envoyé.",
            ephemeral: true
        })
    }
}