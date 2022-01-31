'use strict';

const User = require('../../database/models/User');
const config = require('../../config');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = () => async (ctx) => {
    try {
        if (ctx.from.id != config.admin) return;

        const betaTesters = await User.find({ beta: true });
        const message = ctx.message.text.replace(/\/beta\s+/g, '');

        if (betaTesters.length <= 0) return ctx.replyWithHTML('No beta testers.');

        await ctx.replyWithHTML('Started sending messages...');

        let i = 0;
        let received = 0;
        let lost = 0;

        for (const tester of betaTesters) {
            if (i === 29) {
                await sleep(1000);
                i = 0;
            }

            await ctx.telegram
                .sendMessage(tester.id, message)
                .then(() => {
                    ++received;
                })
                .catch(() => {
                    ++lost;
                });

            ++i;
        }

        await ctx.deleteMessage(ctx.message.message_id + 1);

        return ctx.replyWithHTML(
            `Done! Messages were sent. Well, at least I've tried.\n\nReceived: <b>${received}</b>\nLost: <b>${lost}</b>\nTotal: <b>${betaTesters.length}</b>`
        );
    } catch (err) {
        console.error(err);
    }
};
