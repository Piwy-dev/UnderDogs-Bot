const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const warnSchema = new mongoose.Schema({
    _id: reqString,
    userId: reqString,
    warnAuthors: Array,
    warnDates: Array,
    reasons: Array,
})

module.exports = mongoose.model('warns', warnSchema)