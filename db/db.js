const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
const uri = process.env.MONGO_SRC || "mongodb+srv://ziocro:9bMY0VBNDWe2z8vj@cluster0.hyj19vr.mongodb.net/?retryWrites=true&w=majority";

mongoose
    .connect(uri, /*{ useNewUrlParser: true }*/)
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db

