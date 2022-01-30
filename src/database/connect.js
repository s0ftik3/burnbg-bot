'use strict';

const mongoose = require('mongoose');
const config = require('../config');

module.exports = async () => {
    try {
        mongoose
            .connect(config.database, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            })
            .then(() => console.log('[Database] Successfully connected.'))
            .catch((err) => console.error('[Database] Failed to connect.\n\n' + err));
    } catch (err) {
        console.error(err);
    }
};
