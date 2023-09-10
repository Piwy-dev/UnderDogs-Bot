const mongoose = require("mongoose");

module.exports = async() => {
    mongoose.connect(process.env.MONGOPATH, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    return mongoose
}