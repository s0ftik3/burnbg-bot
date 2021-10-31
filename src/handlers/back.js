'use strict';

const getUserSession = require('../utils/general/getUserSession');
const Markup = require('telegraf/markup');
const createStatsObject = require('../utils/general/createStatsObject');
const getSettingsButtons = require('../utils/general/getSettingsButtons');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const direction = ctx.match[0].split(':')[1];

        switch (direction) {
            case 'settings':
                ctx.editMessageText(ctx.getString(ctx, (user.usage <= 0) ? 'service.settings_new' : 'service.settings', { beta_sign: user.beta ? '(beta)' : '', ...createStatsObject(ctx, user) }), {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard(getSettingsButtons(ctx, user)),
                    disable_web_page_preview: true
                }).catch(() => {});
                break;
            default:
                console.log('No action determined');
                break;
        }

        ctx.answerCbQuery();
    } catch (err) {
        console.error(err);
    }
};