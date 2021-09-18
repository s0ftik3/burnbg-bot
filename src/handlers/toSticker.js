'use strict';

const User = require('../database/models/User');
const getUserSession = require('../scripts/getUserSession');
const Markup = require('telegraf/markup');
const getSettingsButtons = require('../scripts/getSettingsButtons');
const sendLog = require('../scripts/sendLog');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        User.updateOne({ id: ctx.from.id }, { $set: { to_sticker: user.to_sticker ? false : true } }, () => {});
        ctx.session.user.to_sticker = user.to_sticker ? false : true;
        
        ctx.editMessageReplyMarkup(Markup.inlineKeyboard(getSettingsButtons(ctx, user)));

        sendLog({
            type: 'to_sticker', 
            id: ctx.from.id, 
            name: ctx.from.first_name, 
            action: user.to_sticker
        });

        ctx.answerCbQuery();
    } catch (err) {
        console.error(err);
    }
};