const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const warnSchema = new mongoose.Schema({
  guildId: reqString,
  userId: reqString,
  warnings: Array,
})

module.exports = mongoose.model('warns', warnSchema)