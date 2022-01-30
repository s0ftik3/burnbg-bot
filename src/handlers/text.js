'use strict';

const replyWithError = require('../scripts/replyWithError');

module.exports = () => (ctx) => {
    try {
        ctx.session.sent_text = ctx.session.sent_text === undefined ? 1 : ctx.session.sent_text + 1;

        if (ctx.session.sent_text === 20) {
            ctx.session.sent_text = 0;
            return ctx.replyWithHTML(ctx.i18n.t('error.no_text_messages_egg')).catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
        } else {
            return ctx.replyWithHTML(ctx.i18n.t('error.no_text_messages')).catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
        }
    } catch (err) {
        console.error(err);
    }
};
