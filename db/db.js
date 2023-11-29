const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
const URI = process.env.MONGO_SRC;

mongoose
    .connect(URI, /*{ useNewUrlParser: true }*/)
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db

