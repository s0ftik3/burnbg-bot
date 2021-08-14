'use strict';

const getUserSession = require('../scripts/getUserSession');
const Markup = require('telegraf/markup');
const createStatsObject = require('../scripts/createStatsObject');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        ctx.replyWithHTML(ctx.i18n.t('service.settings', createStatsObject(ctx, user)), {
            reply_markup: Markup.inlineKeyboard([
                [Markup.callbackButton(ctx.i18n.t('button.language'), `language`)],
                [Markup.callbackButton(ctx.i18n.t('button.to_sticker', { state: user.to_sticker ? '✅' : '' }), `to_sticker`)],
                [
                    Markup.urlButton(ctx.i18n.t('button.channel'), 'https://t.me/softik'),
                    Markup.urlButton(ctx.i18n.t('button.support'), 'https://t.me/vychs')
                ]
            ])
        });
    } catch (err) {
        console.error(err);
    }
};