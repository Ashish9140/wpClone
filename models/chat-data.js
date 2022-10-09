const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    room: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    text: { type: String, required: true },
    time: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema, 'chats'); 