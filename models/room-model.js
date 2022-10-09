const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomName: { type: String, required: true },
    roomAvatar: { type: String, required: true },
    roomCode: { type: String, required: true },
    members: {
        type: [String],
        required: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema, 'rooms');