'use strict';

const getUserSession = require('../utils/general/getUserSession');
const Markup = require('telegraf/markup');
const createStatsObject = require('../utils/general/createStatsObject');
const replyWithError = require('../utils/general/replyWithError');
const getSettingsButtons = require('../utils/general/getSettingsButtons');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        ctx.replyWithHTML(ctx.getString(ctx, (user.usage <= 0) ? 'service.settings_new' : 'service.settings', { beta_sign: user.beta ? '(beta)' : '', ...createStatsObject(ctx, user) }), {
            reply_markup: Markup.inlineKeyboard(getSettingsButtons(ctx, user)),
            disable_web_page_preview: true
        }).catch(() => replyWithError(ctx, 15));
    } catch (err) {
        console.error(err);
    }
};