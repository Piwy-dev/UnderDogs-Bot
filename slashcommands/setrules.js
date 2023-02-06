const d = require('discord.js')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("setrules")
        .setDescription("Configure le règlement.")
        .setDefaultMemberPermissions(d.PermissionsBitField.Flags.ManageMessages),

    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction

        await interaction.deferReply({ ephemeral: true, })

        const rulesEmbed = new d.EmbedBuilder()
            .setColor('#5bc98e')
            .setTitle('Règlement du serveur')
            .setDescription(" **#GOADH** \n\n\
                Bienvenue sur le discord officiel **Ad Honores | COC** ! \n\n \
                Ce serveur sert à faire passer les informations, donner des conseils, faire les stratégies pour les guerres... \
                tout ça dans la bonne humeur ! Mais pour une bonne ambiance il faut respecter les quelques règles ennoncées \
                ci-dessous. Le non-respect de celles-ci sera évidemment suivi d'une sanction allant du simple avertissement \
                au bannissement définitif du serveur.\n\n \
                **Les régles de ce serveur fonctionnent évidemment de la même manière dans le clan.** \n\n \
                N'hésitez pas à questionner un membre du staff si vous avez des questions ou besoin d'aide ! \n\n \
                Pour le recrutement c'est par là : <#882650240132456489> ! \n\n"
            )
            .addFields(
                { name: 'Règle 1', value: 'On respecte les membres du serveur. Toute forme de harcèlement est évidemment interdite.' },
                { name: 'Règle 2', value: 'On n\'envoie pas de contenu choquant ni de message déplacé.' },
                { name: 'Règle 3', value: 'Les bans sont définitifs. Réfléchissez bien avant d\'enfreindre les règles.' },
                { name: 'Règle 4', value: '@everyone et @here sont réservés uniquement aux membres du Staff et Modérateurs.' },
                { name: 'Règle 5', value: 'Toute publicité est interdite.' },
                { name: 'Règle 6', value: 'Le spam est intedit.' },
                { name: 'Règle 7', value: 'On évite de mentionner avec insistance les membres du serveurs.' },
                { name: 'Règle 8', value: 'On respecte les sujets des salons, on évite de trop s\'en éloigner' },
            )
            .setFooter({text: "Afin d'accéder au serveur, merci de confirmer que tu acceptes le présent règlement."})

        const acceptButton = new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder()
                    .setCustomId('rules')
                    .setLabel("J'accepte le règlement")
                    .setStyle(d.ButtonStyle.Primary)
            )

        channel.send({
            embeds: [rulesEmbed],
            components: [acceptButton]
        });

        interaction.editReply({ content: "Message des règles envoyé !" })
    }
}