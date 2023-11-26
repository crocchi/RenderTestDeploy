const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ChatMsg = new Schema(
    {
        nick: { type: String, required: true },
        text: { type: String, required: true },
        data: { type: String, required: false }
    }
)

module.exports = mongoose.model('chatmsg', ChatMsg)