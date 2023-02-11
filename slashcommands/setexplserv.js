const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setexplserv")
        .setDescription("Ajoute le message des explications des salons.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {
        const { guild, channel } = interaction

        const explEmbed = new EmbedBuilder()
            .setColor('#69c770')
            .setTitle('Rôles des niveaux')
            .setDescription('Voici les rôles des niveaux du serveur. Pour obtenir un rôle, il faut atteindre le niveau indiqué. Plus vous êtes actif, plus vous gagnez de niveaux !')
            .addFields({
                name: "Niveau 1", value: "<@&1072923276361338960> <:villageoise:1072634510946086982>", inline: true
            }, {
                name: "Niveau 2", value: "<@&1072923415280877568> <:barbare:1072633730998472814>", inline: true
            }, {
                name: "Niveau 3", value: "<@&1072923938713243698> <:archere:1072633842793463828>", inline: true
            }, {
                name: "Niveau 4", value: "<@&1072924327609127002> <:bombardier:1072641302170193981>", inline: true
            }, {
                name: "Niveau 5", value: "<@&1072924236395577354> <:chevaucheur:1072634082552447037>", inline: true
            }, {
                name: "Niveau 6", value: "<@&1072924007470485664> <:bbdragon:1072633935399485522>", inline: true
            }, {
                name: "Niveau 7", value: "<@&1072924486443225150> <:bouliste:1072635114217025649>", inline: true
            }, {
                name: "Niveau 8", value: "<@&1072924558975303780> <:sorciere:1072640344086282271>", inline: true
            }, {
                name: "Niveau 9", value: "<@&1072924635202584637> <:pekka:1072634116987691038>", inline: true
            }, {
                name: "Niveau 10", value: "<@&1072924767386075197> <:electrodragon:1072634011966513153>", inline: true
            }, {
                name: "Niveau 11", value: "<@&1072924960814813284> <:yeti:1072634205269405707>", inline: true
            }, {
                name: "Niveau 12", value: "<@&1072926107550093425> <:golem:1072633789282521169>", inline: true
            }, {
                name: "Niveau 13", value: "<@&1072925159763226807> <:roi:1072637333943353454>", inline: true
            }, {
                name: "Niveau 14", value: "<@&1072925303858532512> <:reine:1072636385477001347>", inline: true
            }, {
                name: "Niveau 15", value: "<@&1072925563481764001> <:championne:1072638471753191424>", inline: true
            })

        channel.send({ embeds: [explEmbed] })
        interaction.reply({
            content: "Le message des explications a bien été envoyé.",
            ephemeral: true
        })
    }
}