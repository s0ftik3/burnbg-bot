'use strict';

const Bot = require('./models/Bot');

module.exports = async (bot) => {
    try {
        Bot.updateOne(
            { id: 1 },
            {
                $set: {
                    active_token: bot.active_token,
                    inactive_tokens: bot.inactive_tokens,
                    number: bot.number,
                    type: bot.type,
                },
            },
            () => {}
        ).catch((err) => console.error('[Database] Failed to update tokens\n\n' + err));
    } catch (err) {
        console.error(err);
    }
};
