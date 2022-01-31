'use strict';

const User = require('../../database/models/User');
const config = require('../../config');

module.exports = () => async (ctx) => {
    try {
        if (ctx.from.id != config.admin) return;

        const usersLength = await User.find().countDocuments();
        const pages = Math.ceil(usersLength / 1000);

        if (usersLength <= 0) return ctx.replyWithHTML('No users.');

        await ctx.replyWithHTML('Started checking users...');

        let counter = 0;
        let alive = 0;
        let dead = 0;
        let skipNumber = 0;

        for (let i = 0; i < pages; i++) {
            let users = await User.find({}, null, {
                skip: skipNumber,
                limit: 1000,
            }).then((response) => response);

            for (const user of users) {
                console.log(`[${counter} / ${usersLength}] Checking ${user.id}...`);

                await ctx.telegram
                    .sendChatAction(user.id, 'typing')
                    .then(() => {
                        ++alive;
                    })
                    .catch(() => {
                        ++dead;
                    });

                ++counter;
            }

            skipNumber += 1000;
            users = [];
        }

        await ctx.deleteMessage(ctx.message.message_id + 1);

        return ctx.replyWithHTML(
            `Done! All the users were checked.\n\nAlive: <b>${alive}</b>\nDead: <b>${dead}</b>\nTotal: <b>${usersLength}</b>`
        );
    } catch (err) {
        console.error(err);
    }
};
