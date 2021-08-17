'use strict';

const User = require('../database/models/User');
const getUserSession = require('../scripts/getUserSession');
const Markup = require('telegraf/markup');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        User.updateOne({ id: ctx.from.id }, { $set: { to_sticker: user.to_sticker ? false : true } }, () => {});
        ctx.session.user.to_sticker = user.to_sticker ? false : true;
        
        ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
            [
                Markup.callbackButton(ctx.i18n.t('button.language'), `language`),
                Markup.callbackButton(ctx.i18n.t('button.service', { state: user.service === 0 ? '1️⃣' : '2️⃣' }), `service`)
            ],
            [Markup.callbackButton(ctx.i18n.t('button.to_sticker', { state: user.to_sticker ? '✅' : '' }), `to_sticker`)],
            [
                Markup.urlButton(ctx.i18n.t('button.channel'), 'tg://resolve?domain=softik'),
                Markup.urlButton(ctx.i18n.t('button.support'), 'tg://resolve?domain=vychs')
            ]
        ]));

        ctx.answerCbQuery();
    } catch (err) {
        console.error(err);
    }
};