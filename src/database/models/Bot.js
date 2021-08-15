const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
    id: Number,
    active_token: String
});

module.exports = mongoose.model('Bot', botSchema);