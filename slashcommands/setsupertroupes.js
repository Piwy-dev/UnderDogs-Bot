const d = require('discord.js')

const mongo = require('../mongo')
const troupesSchema = require('../models/troupes-schema')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("setsupertroupes")
        .setDescription("Envoie le message pous les super troupes")
        .setDefaultMemberPermissions(d.PermissionFlagsBits.Administrator),

    async execute(interaction, client) {
        const { guild, channel, message } = interaction

        let result;
        await mongo().then(async (mongoose) => {
            try {
                result = await troupesSchema.findOne({
                    guildId: guild.id,
                })
            } finally {
                mongoose.connection.close()
            }
        })

        /*const superTroupesEmbed = new d.EmbedBuilder()
            .setColor('#ffc800')
            .setTitle('Super troupes')
            .setDescription("Voici la liste des super troupes actuelement disponibles au don.")
            .addFields(
                { name: "Super barbare", value: `${result.super_barbare.join('\n') || "/"}`, inline: true },
                { name: "Super archère", value: `${result.super_archere.join('\n') || "/"}`, inline: true},
                { name: "Goblin furtif", value: `${result.goblin_furtif.join('\n') || "/"}`, inline: true },
                { name: "Super sapeur", value: `${result.super_sapeur.join('\n') || "/"}`, inline: true },
                { name: "Super géant", value: `${result.super_geant.join('\n') || "/"}`, inline: true },
                { name: "Ballon à propulsion", value: `${result.ballon_propulsion.join('\n') || "/"}`, inline: true },
                { name: "Super sorcier", value: `${result.super_sorcier.join('\n') || "/"}`, inline: true },
                { name: "Super dragon", value: `${result.super_dragon.join('\n') || "/"}`, inline: true },
                { name: "Dragon de l'enfer", value: `${result.dragon_enfer.join('\n') || "/"}`, inline: true },
                { name: "Super gargouille", value: `${result.super_gargouille.join('\n') || "/"}`, inline: true },
                { name: "Super valkyrie", value: `${result.super_valkyrie.join('\n') || "/"}`, inline: true },
                { name: "Super sorcière", value: `${result.super_sorciere.join('\n') || "/"}`, inline: true },
                { name: "Moloce de glace", value: `${result.moloce_glace.join('\n') || "/"}`, inline: true },
                { name: "Super bouliste", value: `${result.super_bouliste.join('\n') || "/"}`, inline: true },
                { name: "Super mineur", value: `${result.super_mineur.join('\n') || "/"}`, inline: true }
            )
            .setFooter({ text: `Si tu as des super troupes disponibles, selectionne les via la réaction ci-dessous. Si tu n'en as plus sélectionne : "Je n'ai plus de super troupes"`})

        const troupesSellect = new d.ActionRowBuilder()
            .addComponents(
                new d.StringSelectMenuBuilder()
					.setCustomId('supertroupes')
					.setPlaceholder('Selectionne tes super troupes')
                    .setMinValues(0)
                    .setMaxValues(15)
					.addOptions(
                        { label: "Je n'ai plus de super troupe", value: 'no_super' }, 
                        { label: 'Super barbare', value: 'super_barbare' }, 
                        { label: 'Super archère', value: 'super_archere' },
                        { label: 'Goblin furtif', value: 'goblin_furtif' },
                        { label: 'Super sapeur', value: 'super_sapeur' },
                        { label: 'Super géant', value: 'super_geant' },
                        { label: 'Ballon à propulsion', value: 'ballon_propulsion' },   
                        { label: 'Super sorcier', value: 'super_sorcier' },
                        { label: 'Super dragon', value: 'super_dragon' },
                        { label: 'Dragon de l\'enfer', value: 'dragon_enfer' },
                        { label: 'Super gargouille', value: 'super_gargouille' },
                        { label: 'Super valkyrie', value: 'super_valkyrie' },
                        { label: 'Super sorcière', value: 'super_sorciere' },
                        { label: 'Moloce de glace', value: 'moloce_glace' },
                        { label: 'Super bouliste', value: 'super_bouliste' },
                        { label: 'Super mineur', value: 'super_mineur' }
					))

        */

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


        /*const troupesMessage = await client.guilds.cache.get("882645604658974741").channels.cache.get('882651927559688203').messages.fetch('921687575805182012')
        troupesMessage.edit({ embeds: [cocEmbed], components: [linkButton] })*/

        channel.send({ embeds: [gemmesEmbed], components: [gemmesButtons] })
        interaction.reply({
            content: "Le message des super troupes a bien été envoyé.",
            ephemeral: true
        })
    }
}