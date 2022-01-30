'use strict';

const Markup = require('telegraf/markup');

module.exports = (ctx, code) => {
    try {
        switch (code) {
            case 'COMMON_ERROR':
                ctx.replyWithHTML(ctx.i18n.t('error.common'));
                console.error({
                    code: 0,
                    type: 'error',
                    message: `User ${ctx.from.id} isn't recorded in the database or there are some incorrect lines.`,
                });
                break;
            case 'LIMIT_EXCEEDED':
                const a = () => ctx.answerCbQuery(ctx.i18n.t('error.limit_exceeded'), true);
                const b = () => ctx.replyWithHTML(ctx.i18n.t('error.limit_exceeded'));
                ctx.updateType === 'callback_query' ? a() : b();
                break;
            case 'METHOD_FAILED':
                ctx.replyWithHTML(ctx.i18n.t('error.common'));
                break;
            case 'NOT_SUBSCRIBED':
                ctx.replyWithHTML(ctx.i18n.t('error.not_a_member'), {
                    reply_markup: Markup.inlineKeyboard([
                        [Markup.urlButton(ctx.i18n.t('button.subscribe'), 'https://t.me/softik')],
                    ]),
                });
                break;
            case 'NO_USER_TO_DELETE':
                ctx.replyWithHTML(ctx.i18n.t('error.common'));
                break;
            case 'PROCESSING_ERROR':
                ctx.replyWithHTML(ctx.i18n.t('error.api_error'));
                break;
            case 'UNKNOWN_SERVICE':
                ctx.replyWithHTML(ctx.i18n.t('error.common'));
                break;
            case 'TOO_BIG_FILE':
                ctx.replyWithHTML(ctx.i18n.t('error.file_too_big'));
                break;
            case 'WRONG_FILE_EXTENSION':
                ctx.replyWithHTML(ctx.i18n.t('error.wrong_file_extension'));
                break;
            case 'FAILED_TO_DOWNLOAD':
                ctx.replyWithHTML(ctx.i18n.t('error.failed_download_file'));
                break;
            case 'CHANGED_SERVICE':
                ctx.replyWithHTML(ctx.i18n.t('error.changed_service'));
                break;
            case 'NO_ACTIVE_TOKENS':
                ctx.replyWithHTML(ctx.i18n.t('error.common_important'));
                break;
            case 'CHANGED_TOKEN':
                ctx.replyWithHTML(ctx.i18n.t('error.switched_tokens'));
                break;
            case 'API_ERROR':
                ctx.replyWithHTML(ctx.i18n.t('error.api_error'));
                break;
            default:
                ctx.replyWithHTML(ctx.i18n.t('error.common'));
                console.error({
                    code: 'default',
                    type: 'error',
                    message: `Something happed with ${ctx.from.id} user.`,
                });
                break;
        }
    } catch (err) {
        console.error(err);
    }
};
