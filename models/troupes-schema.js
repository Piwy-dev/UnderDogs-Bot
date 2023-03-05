const mongoose = require('mongoose')

const troupesSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    super_barbare: { type: Array, default: [] },
    super_archere: { type: Array, default: [] },
    goblin_furtif: { type: Array, default: [] },
    super_sapeur: { type: Array, default: [] },
    super_geant: { type: Array, default: [] },
    ballon_propulsion: { type: Array, default: [] },
    super_sorcier: { type: Array, default: [] },
    super_dragon: { type: Array, default: [] },
    dragon_enfer: { type: Array, default: [] },
    super_gargouille: { type: Array, default: [] },
    super_valkyrie: { type: Array, default: [] },
    super_sorciere: { type: Array, default: [] },
    moloce_glace: { type: Array, default: [] },
    super_bouliste: { type: Array, default: [] },
    super_mineur: { type: Array, default: [] },
    gemmes: { type: Array, default: [] }
})

module.exports = mongoose.model('troupes', troupesSchema)