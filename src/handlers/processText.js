'use strict';

const getUserSession = require('../scripts/getUserSession');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const i = Math.floor(Math.random() * 101);
        return ctx.replyWithHTML(ctx.i18n.t((i === 100) ? 'error.no_text_messages_egg' : 'error.no_text_messages'));
    } catch (err) {
        console.error(err);
    }
};