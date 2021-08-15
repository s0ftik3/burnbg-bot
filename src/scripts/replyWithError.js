'use strict';

module.exports = (ctx, code) => {
    try {
        switch (code) {
            case 0:
                ctx.i18n.locale(ctx.session.user.language || 'en');
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
            case 2:
                ctx.i18n.locale(ctx.session.user.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.wrong_file_extension'));
                break;
            case 3:
                ctx.i18n.locale(ctx.session.user.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.common_important'));
                console.error({
                    code: 2,
                    type: 'error',
                    message: 'The host token has been expired.'
                });
                break;
            case 4:
                ctx.i18n.locale(ctx.session.user.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.file_too_big'));
                break;
            case 5:
                ctx.i18n.locale(ctx.session.user.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.switched_tokens'));
                break;
            default:
                ctx.i18n.locale(ctx.session.user.language || 'en');
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