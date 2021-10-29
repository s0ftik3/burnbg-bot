const mongoose = require('mongoose');
const config = require('../config');

module.exports = async () => {
    await mongoose
        .connect(config.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        .then(() => console.log('[Database] Successfully connected'))
        .catch(err => console.error('[Database] Failed to connect\n\n' + err));
};