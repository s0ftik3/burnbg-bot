'use strict';

const config = require('../config');
const replyWithError = require('./replyWithError');

module.exports = (ctx) => {
    try {
        return ctx.telegram
            .getChatMember(config.channel, ctx.from.id)
            .then(async (response) => {
                const roles = ['member', 'creator', 'administrator'];
                const isSubscriber = roles.includes(response.status) ? true : false;

                ctx.user.channel_member = isSubscriber;
                await ctx.user.save();

                return isSubscriber;
            })
            .catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
    } catch (err) {
        console.error(err);
    }
};
