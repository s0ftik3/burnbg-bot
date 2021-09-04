'use strict';

const User = require('../database/models/User');
const getUserSession = require('../scripts/getUserSession');
const Markup = require('telegraf/markup');
const getSettingsButtons = require('../scripts/getSettingsButtons');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        // if (ctx.session.user.service === 0) return ctx.answerCbQuery(ctx.i18n.t('service.service_no_change'), true);

        User.updateOne({ id: ctx.from.id }, { $set: { service: user.service === 0 ? 1 : 0 } }, () => {});
        ctx.session.user.service = user.service === 0 ? 1 : 0;
        
        ctx.editMessageReplyMarkup(Markup.inlineKeyboard(getSettingsButtons(ctx, user)));

        if (ctx.session.user.service === 1) {
            ctx.answerCbQuery(ctx.i18n.t('service.warning'), true);
        } else {
            ctx.answerCbQuery();
        }
    } catch (err) {
        console.error(err);
    }
};