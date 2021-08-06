/**
 * This part of the bot will be changed
 * eventually. The code is mess here and I know it, 
 * just I'm too lazy to change it right now.
 */

'use strict';

const User = require('../database/models/User');
const Markup = require('telegraf/markup');
const getUserSession = require('../scripts/getUserSession');
const addBackButton = require('../scripts/addBackButton');
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
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const buttons = [];
        const localesFolder = fs.readdirSync('./src/locales/');
        localesFolder.forEach((file) => {
            const localization = file.split('.')[0];
            buttons.push(Markup.callbackButton(i18n.t(localization, 'language'), `set_lang:${localization}`));
        });

        const keyboard = buttons.filter((e) => e.callback_data != `set_lang:${ctx.session.user.language}`);
        const finalKeyboard = addBackButton(Markup.inlineKeyboard(keyboard, { columns: 2 }), user.language);

        if (ctx.match[0].match(/set_lang:(.*)/g) !== null) {
            const language = ctx.match[0].split(':')[1];
            ctx.i18n.locale(language);

            await User.updateOne({ id: ctx.from.id }, { $set: { language: language } }, () => {});
            ctx.session.user.language = language;

            ctx.editMessageText(
                ctx.i18n.t('service.language_changed'),
                Markup.keyboard([[ctx.i18n.t('button.settings')]])
                    .resize()
                    .extra()
            );
        } else {
            ctx.editMessageText(ctx.i18n.t('service.change_language'), {
                reply_markup: finalKeyboard,
            });

            ctx.answerCbQuery();
        }
    } catch (err) {
        console.error(err);
    }
};