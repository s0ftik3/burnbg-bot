'use strict';

const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

module.exports = (ctx, string, params = {}) => {
    try {
        const language = ctx.i18n.languageCode;
        const missing = i18n.missingKeys(language);

        if (missing.includes(string)) {
            let text = i18n.t(language, string, params);
            text += '\n\n' + ctx.i18n.t('service.no_translation');
            return text;
        } else {
            return i18n.t(language, string, params);
        }
    } catch (err) {
        console.error(err);
    }
};