'use strict';

const User = require('../database/models/User');
const Markup = require('telegraf/markup');
const getUserSession = require('../scripts/getUserSession');
const fs = require('fs');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);
        
        const action = (ctx.match[0].match(/set_lang:(.*)/g) === null) ? 'language' : 'set_language';

        switch (action) {
            case 'language':
                const buttons = [];

                const locales_folder = fs.readdirSync('./src/locales/');
                locales_folder.forEach((file) => {
                    const localization = file.split('.')[0];
                    buttons.push(Markup.callbackButton(i18n.t(localization, 'language'), `set_lang:${localization}`));
                });
        
                buttons.push(Markup.callbackButton(ctx.i18n.t('button.back'), 'back:settings'));
                const keyboard = buttons.filter((e) => e.callback_data != `set_lang:${ctx.session.user.language}`);

                ctx.editMessageText(ctx.i18n.t('service.change_language'), {
                    reply_markup: Markup.inlineKeyboard(keyboard, { columns: 2 }),
                });
    
                ctx.answerCbQuery();
                break;
            case 'set_language':
                const language = ctx.match[0].split(':')[1];
                ctx.i18n.locale(language);
    
                await User.updateOne({ id: ctx.from.id }, { $set: { language: language } }, () => {});
                ctx.session.user.language = language;
                
                await ctx.deleteMessage();
    
                ctx.replyWithHTML(
                    ctx.i18n.t('service.language_changed'),
                    Markup.keyboard([[ctx.i18n.t('button.settings')]])
                        .resize()
                        .extra()
                );
                break;
            default:
                console.log('No action determined.');
                break;
        }
    } catch (err) {
        console.error(err);
    }
};