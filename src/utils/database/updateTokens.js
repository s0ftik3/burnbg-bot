const Bot = require('../../database/models/Bot');

module.exports = async (bot) => {
    await Bot.updateOne({ id: 1 }, { 
        $set: {
            active_token: bot.active_token,
            inactive_tokens: bot.inactive_tokens,
            number: bot.number,
            type: bot.type
        }
    }, () => {})
        .catch(err => console.error('[Database] Failed to updated tokens\n\n' + err));
};