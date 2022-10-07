const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const recrutementSchema = mongoose.Schema({
    _id: reqString,
    memberId: reqString
})

module.exports = mongoose.model('recrutements', recrutementSchema)