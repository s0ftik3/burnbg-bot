'use strict';

const getUserSession = require('../scripts/getUserSession');
const Markup = require('telegraf/markup');
const createStatsObject = require('../scripts/createStatsObject');
const getSettingsButtons = require('../scripts/getSettingsButtons');
const config = require('../../config');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const direction = ctx.match[0].split(':')[1];

        switch (direction) {
            case 'settings':
                ctx.editMessageText(ctx.getString(ctx, 'service.settings', { version: config.version, ...createStatsObject(ctx, user) }), {
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