const mongoose = require("mongoose");
const {mongoPath} = require('./keys.json')

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    return mongoose
}