'use strict';

const getUserSession = require('../scripts/getUserSession');
const Markup = require('telegraf/markup');
const createStatsObject = require('../scripts/createStatsObject');
const replyWithError = require('../scripts/replyWithError');
const getSettingsButtons = require('../scripts/getSettingsButtons');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);
        
        ctx.replyWithHTML(ctx.i18n.t('service.settings', createStatsObject(ctx, user)), {
            reply_markup: Markup.inlineKeyboard(getSettingsButtons(ctx, user))
        }).catch(() => replyWithError(ctx, 15));
    } catch (err) {
        console.error(err);
    }
};