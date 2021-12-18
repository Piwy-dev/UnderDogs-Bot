const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const ticketSchema = mongoose.Schema({
    _id: reqString,
    memberId: reqString
})

module.exports = mongoose.model('tickets', ticketSchema)