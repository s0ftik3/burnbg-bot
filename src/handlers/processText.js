'use strict';

const getUserSession = require('../scripts/getUserSession');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        return ctx.replyWithHTML(ctx.i18n.t('error.no_text_messages'));
    } catch (err) {
        console.error(err);
    }
};