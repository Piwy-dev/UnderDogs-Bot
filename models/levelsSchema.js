const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const muteSchema = new mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    lastMessage: { type: Date, default: Date.now},
})

module.exports = mongoose.model('levels', muteSchema)