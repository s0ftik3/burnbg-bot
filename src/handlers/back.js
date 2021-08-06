'use strict';

const getUserSession = require('../scripts/getUserSession');
const Markup = require('telegraf/markup');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const direction = ctx.match[0].split(':')[1];

        switch(direction) {
            case 'settings':
                ctx.editMessageText(ctx.i18n.t('service.settings'), {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([
                        [Markup.callbackButton(ctx.i18n.t('button.language'), `language`)],
                        [Markup.callbackButton(ctx.i18n.t('button.to_sticker', { state: user.to_sticker ? '✅' : '' }), `to_sticker`)],
                        [
                            Markup.urlButton(ctx.i18n.t('button.channel'), 'https://t.me/softik'),
                            Markup.urlButton(ctx.i18n.t('button.support'), 'https://t.me/vychs')
                        ]
                    ])
                });
                break;
            default:
                break;
        }

        ctx.answerCbQuery();
    } catch (err) {
        console.error(err);
    }
};