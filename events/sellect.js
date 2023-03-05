const d = require('discord.js');

const mongo = require('../mongo');
const troupesSchema = require('../models/troupes-schema');

module.exports = (client) => {
    client.on(d.Events.InteractionCreate, async interaction => {

        if (!interaction.isStringSelectMenu()) return;

        await interaction.deferReply({ ephemeral: true });

        const { values, member, guild, component, message } = interaction

        const removed = component.options.filter((option) => {
            return !values.includes(option.values)
        })

        for(const troupe of removed){
            await mongo().then(async (mongoose) => {
                try {
                    await troupesSchema.findOneAndUpdate({
                        guildId: guild.id,
                    }, {
                        guildId: guild.id,
                        $pull: {
                            [troupe.value]: `<@${member.id}>`
                        }
                    }, {
                        upsert: true
                    })
                } finally {
                    mongoose.connection.close()
                }
            })
        }

        for(const troupe of values){
            await mongo().then(async (mongoose) => {
                try {
                    await troupesSchema.findOneAndUpdate({
                        guildId: guild.id,
                    }, {
                        guildId: guild.id,
                        $push: {
                            [troupe]: `<@${member.id}>`
                        }
                    }, {
                        upsert: true
                    })
                } finally {
                    mongoose.connection.close()
                }
            })
        }

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

        const superTroupesEmbed = new d.EmbedBuilder()
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

        await message.edit({ embeds: [superTroupesEmbed] })

        interaction.editReply({ content: "Merci d'avoir sélectionné tes super troupes !" })
    })
}