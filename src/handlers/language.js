'use strict';

const Markup = require('telegraf/markup');
const replyWithError = require('../scripts/replyWithError');
const fs = require('fs');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true,
});

module.exports = () => async (ctx) => {
    try {
        await ctx.answerCbQuery();

        const action = ctx.match;

        if (action === 'language') {
            const buttons = [];

            const locales_folder = fs.readdirSync('./src/locales/');

            locales_folder.forEach((file) => {
                const localization = file.split('.')[0];
                buttons.push(Markup.callbackButton(i18n.t(localization, 'language'), `set_language:${localization}`));
            });

            buttons.push(Markup.callbackButton(ctx.i18n.t('button.back'), 'back:settings'));

            const keyboard = buttons.filter((e) => e.callback_data != `set_language:${ctx.user.language}`);

            await ctx
                .editMessageText(ctx.i18n.t('service.change_language'), {
                    reply_markup: Markup.inlineKeyboard(keyboard, { columns: 2 }),
                })
                .catch((err) => {
                    console.error(err);
                    return replyWithError(ctx, 'METHOD_FAILED');
                });
        } else {
            const language = ctx.match[0].split(':')[1];

            ctx.i18n.locale(language);

            ctx.user.language = language;

            await ctx.deleteMessage().catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });

            await ctx
                .replyWithHTML(
                    ctx.i18n.t('service.language_changed'),
                    Markup.keyboard([[ctx.i18n.t('button.settings')]])
                        .resize()
                        .extra()
                )
                .catch((err) => {
                    console.error(err);
                    return replyWithError(ctx, 'METHOD_FAILED');
                });

            await ctx.user.save();
        }
    } catch (err) {
        console.error(err);
    }
};
