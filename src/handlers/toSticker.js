'use strict';

const User = require('../database/models/User');
const getUserSession = require('../utils/general/getUserSession');
const Markup = require('telegraf/markup');
const getSettingsButtons = require('../utils/general/getSettingsButtons');
const sendLog = require('../utils/general/sendLog');

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