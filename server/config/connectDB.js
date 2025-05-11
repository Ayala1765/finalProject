const mongoose = require('mongoose')
const DBconnect = async () => {
    try {
        await mongoose.connect(process.env.ROUT)
    } catch (err) {
        console.error("error in connection to DB\n" + err)
    }
}
module.exports = DBconnect