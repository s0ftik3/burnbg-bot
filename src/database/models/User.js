const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
    },
    first_name: String,
    last_name: String,
    username: String,
    language: String,
    role: {
        type: String,
        required: false,
        default: 'user',
    },
    to_sticker: {
        type: Boolean,
        required: false,
        default: false,
    },
    add_text: {
        type: Boolean,
        required: false,
        default: false,
    },
    service: {
        type: Number,
        required: false,
        default: 0,
    },
    usage: {
        type: Number,
        required: false,
        default: 0,
    },
    converted_to_file: {
        type: Number,
        required: false,
        default: 0,
    },
    converted_to_sticker: {
        type: Number,
        required: false,
        default: 0,
    },
    last_time_used: {
        type: Date,
        required: false,
        default: 0,
    },
    channel_member: {
        type: Boolean,
        required: false,
        default: null,
    },
    beta: {
        type: Boolean,
        required: false,
        default: false,
    },
    files: [
        {
            type: Object,
            required: false,
        },
    ],
    timestamp: {
        type: Date,
        required: false,
        default: new Date(),
    },
});

module.exports = mongoose.model('User', userSchema);
