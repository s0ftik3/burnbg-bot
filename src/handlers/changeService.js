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

        // if (ctx.session.user.service === 0) return ctx.answerCbQuery(ctx.i18n.t('service.service_no_change'), true);

        User.updateOne({ id: ctx.from.id }, { $set: { service: (user.service === 0) ? 1 : (user.service === 1) ? 2 : (user.service === 2) ? 0 : 0 } }, () => {});
        ctx.session.user.service = (user.service === 0) ? 1 : (user.service === 1) ? 2 : (user.service === 2) ? 0 : 0;
        
        ctx.editMessageReplyMarkup(Markup.inlineKeyboard(getSettingsButtons(ctx, user)));

        if (ctx.session.user.service === 1) {
            sendLog({ 
                type: 'service_change', 
                id: ctx.from.id, 
                name: ctx.from.first_name, 
                service: ctx.session.user.service,
                old_service: user.service - 1
            });
            
        } else if (ctx.session.user.service === 2) {
            sendLog({ 
                type: 'service_change', 
                id: ctx.from.id, 
                name: ctx.from.first_name, 
                service: ctx.session.user.service,
                old_service: user.service - 1
            });
            ctx.answerCbQuery(ctx.i18n.t('service.warning'), true);
        } else {
            sendLog({ 
                type: 'service_change', 
                id: ctx.from.id, 
                name: ctx.from.first_name, 
                service: ctx.session.user.service,
                old_service: user.service + 2
            });
            ctx.answerCbQuery();
        }
    } catch (err) {
        console.error(err);
    }
};