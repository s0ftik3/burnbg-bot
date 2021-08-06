'use strict';

module.exports = (ctx, code) => {
    try {
        switch (code) {
            case 0:
                ctx.replyWithHTML(ctx.i18n.t('error.common'));
                console.error({
                    code: 0,
                    type: 'error',
                    message: `User ${ctx.from.id} isn't recorded in the database or there are some incorrect lines.`
                });
                break;
            case 1:
                ctx.i18n.locale(ctx.session.user.language || 'en');
                const a = () => ctx.answerCbQuery(ctx.i18n.t('error.limit_exceeded'), true);
                const b = () => ctx.replyWithHTML(ctx.i18n.t('error.limit_exceeded'));
                (ctx.updateType === 'callback_query') ? a() : b();
                break;
            default:
                ctx.replyWithHTML(ctx.i18n.t('error.common'));
                console.error({
                    code: 'default',
                    type: 'error',
                    message: `Something happed with ${ctx.from.id} user.`
                });
                break;
        }
    } catch (err) {
        console.error(err);
    }
};