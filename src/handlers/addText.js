'use strict';

const User = require('../database/models/User');
const getUserSession = require('../scripts/getUserSession');
const Markup = require('telegraf/markup');
const getSettingsButtons = require('../scripts/getSettingsButtons');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        User.updateOne({ id: ctx.from.id }, { $set: { add_text: user.add_text ? false : true } }, () => {});
        ctx.session.user.add_text = user.add_text ? false : true;
        
        ctx.editMessageReplyMarkup(Markup.inlineKeyboard(getSettingsButtons(ctx, user)));
        
        if (ctx.session.user.add_text) {
            ctx.answerCbQuery(ctx.i18n.t('service.warning_add_text'), true);
        } else {
            ctx.answerCbQuery();
        }
    } catch (err) {
        console.error(err);
    }
};