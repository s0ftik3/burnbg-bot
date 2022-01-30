'use strict';

const Bot = require('./models/Bot');
const config = require('../config');

module.exports = async () => {
    try {
        Bot.updateOne(
            { id: 1 },
            {
                $set: {
                    active_token: config.host_token,
                    inactive_tokens: [],
                    number: 1,
                    type: '5',
                },
            },
            () => {}
        )
            .then(() => console.log('[Database] Successfully reseted tokens'))
            .catch((err) => console.error('[Database] Failed to reset tokens\n\n' + err));
    } catch (err) {
        console.error(err);
    }
};
