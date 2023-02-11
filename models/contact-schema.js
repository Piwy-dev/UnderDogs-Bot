const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const recrutementSchema = mongoose.Schema({
    creatorId: reqString,
    channelId: reqString,
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('contact', recrutementSchema)