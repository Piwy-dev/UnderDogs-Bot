const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const muteSchema = new mongoose.Schema({
    _id: reqString,
    Users: Array,
})

module.exports = mongoose.model('mute', muteSchema)