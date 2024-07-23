const mongoose = require("mongoose")

require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("DB CONNECTED SUCCESSFULLY")
    }).catch((e) => {
        console.log(`ERROR ${e}`)
        console.error(e)
        process.exit(1)
    })
}