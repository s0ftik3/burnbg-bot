'use strict';

const User = require('../database/models/User');
const getUserSession = require('../scripts/getUserSession');
const Markup = require('telegraf/markup');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        User.updateOne({ id: ctx.from.id }, { $set: { service: user.service === 0 ? 1 : 0 } }, () => {});
        ctx.session.user.service = user.service === 0 ? 1 : 0;
        
        ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
            [
                Markup.callbackButton(ctx.i18n.t('button.language'), `language`),
                Markup.callbackButton(ctx.i18n.t('button.service', { state: user.service === 0 ? '1️⃣' : '2️⃣' }), `service`)
            ],
            [Markup.callbackButton(ctx.i18n.t('button.to_sticker', { state: user.to_sticker ? '✅' : '' }), `to_sticker`)],
            [
                Markup.urlButton(ctx.i18n.t('button.channel'), 'https://t.me/softik'),
                Markup.urlButton(ctx.i18n.t('button.support'), 'https://t.me/vychs')
            ]
        ]));

        if (ctx.session.user.service === 1) {
            ctx.answerCbQuery(ctx.i18n.t('service.warning'), true);
        } else {
            ctx.answerCbQuery();
        }
    } catch (err) {
        console.error(err);
    }
};