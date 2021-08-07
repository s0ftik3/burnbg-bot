const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    first_name: String,
    last_name: String,
    username: String,
    language: String,
    to_sticker: {
        type: Boolean,
        required: false,
        default: false
    },
    usage: {
        type: Number,
        required: false,
        default: 0
    },
    timestamp: {
        type: Date,
        required: false,
        default: new Date()
    }
});

module.exports = mongoose.model('User', userSchema);