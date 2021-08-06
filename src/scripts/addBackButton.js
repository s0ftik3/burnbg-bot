'use strict';

const Markup = require('telegraf/markup');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true,
});

module.exports = (keyboard, language) => {
    try {
        const backButton = Markup.callbackButton(i18n.t(language, 'button.back'), `back:settings`);
        keyboard.inline_keyboard.push([backButton]);

        return keyboard;
    } catch (err) {
        console.error(err);
    }
};