const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
    id: Number,
    active_token: String,
    number: Number,
    inactive_tokens: {
        type: Array,
        required: false,
        default: [],
    },
    type: String,
});

module.exports = mongoose.model('Bot', botSchema);
