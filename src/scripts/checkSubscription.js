'use strict';

const config = require('../config');
const replyWithError = require('./replyWithError');

module.exports = (ctx) => {
    try {
        return ctx.telegram
            .getChatMember(config.channel, ctx.from.id)
            .then(async (response) => {
                const roles = ['member', 'creator', 'administrator'];
                const is_member = roles.includes(response.status) ? true : false;

                ctx.user.channel_member = is_member;
                await ctx.user.save();

                return is_member;
            })
            .catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
    } catch (err) {
        console.error(err);
    }
};
