'use strict';

const getUserSession = require('../scripts/getUserSession');
const Markup = require('telegraf/markup');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        if (ctx.match) {
            ctx.editMessageText(ctx.i18n.t('service.settings'), {
                parse_mode: 'HTML',
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton(ctx.i18n.t('button.language'), `language`)],
                    [Markup.callbackButton(ctx.i18n.t('button.to_sticker', { state: user.to_sticker ? '✅' : '' }), `to_sticker`)]
                ])
            });

            ctx.answerCbQuery();
        } else {
            ctx.replyWithHTML(ctx.i18n.t('service.settings'), {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton(ctx.i18n.t('button.language'), `language`)],
                    [Markup.callbackButton(ctx.i18n.t('button.to_sticker', { state: user.to_sticker ? '✅' : '' }), `to_sticker`)]
                ])
            });
        }


    } catch (err) {
        console.error(err);
    }
};