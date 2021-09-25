'use strict';

const Markup = require('telegraf/markup');
const sendLog = require('./sendLog');

module.exports = (ctx, code) => {
    try {
        switch (code) {
            case 0:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.common'));
                console.error({
                    code: 0,
                    type: 'error',
                    message: `User ${ctx.from.id} isn't recorded in the database or there are some incorrect lines`
                });
                break;
            case 1:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                const a = () => ctx.answerCbQuery(ctx.i18n.t('error.limit_exceeded'), true);
                const b = () => ctx.replyWithHTML(ctx.i18n.t('error.limit_exceeded'));
                (ctx.updateType === 'callback_query') ? a() : b();
                break;
            case 2:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.wrong_file_extension'));
                break;
            case 3:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.common_important'));
                console.error({
                    code: 2,
                    type: 'error',
                    message: 'No active tokens left'
                });
                break;
            case 4:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.file_too_big'));
                break;
            case 5:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.switched_tokens'));
                break;
            case 6:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.failed_download_file'));
                break;
            case 7:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.common'));
                console.error({
                    code: 7,
                    type: 'error',
                    message: 'Failed to get request data from database'
                });
                break;
            case 8:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.api_error'));
                console.error({
                    code: 8,
                    type: 'error',
                    message: 'Failed to call API'
                });
                break;
            case 9:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.common'));
                console.error({
                    code: 9,
                    type: 'error',
                    message: 'Failed to resolve main function'
                });
                break;
            case 10:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.common'));
                console.error({
                    code: 10,
                    type: 'error',
                    message: 'Failed to download processed photo'
                });
                break;
            case 11:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.not_a_member'), {
                    reply_markup: Markup.inlineKeyboard([
                        [Markup.urlButton(ctx.i18n.t('button.subscribe'), 'https://t.me/softik')]
                    ])
                });
                sendLog({ type: 'error_no_sub', id: ctx.from.id, name: ctx.from.first_name });
                break;
            case 12:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.api_error'));
                console.error({
                    code: 12,
                    type: 'error',
                    message: 'Failed to call 2nd API'
                });
                break;
            case 13:
                console.error({
                    code: 13,
                    type: 'error',
                    message: `[${ctx.from.id}] Couldn't reply to this user with document`
                });
                break;
            case 14:
                console.error({
                    code: 14,
                    type: 'error',
                    message: `[${ctx.from.id}] Couldn't reply to this user with sticker`
                });
                break;
            case 15:
                console.error({
                    code: 15,
                    type: 'error',
                    message: `[${ctx.from.id}] Bot was blocked by the user`
                });
                break;
            case 16:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.getString(ctx, 'error.unable_reset'));
                break;
            default:
                ctx.i18n.locale(ctx.session?.user?.language || 'en');
                ctx.replyWithHTML(ctx.i18n.t('error.common'));
                console.error({
                    code: 'default',
                    type: 'error',
                    message: `Something happed with ${ctx.from.id} user`
                });
                break;
        }
    } catch (err) {
        console.error(err);
    }
};