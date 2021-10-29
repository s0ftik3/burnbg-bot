'use strict';

const User = require('../database/models/User');
const Markup = require('telegraf/markup');
const getUserSession = require('../utils/general/getUserSession');
const fs = require('fs');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const sendLog = require('../utils/general/sendLog');
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
                
                ctx.editMessageText(ctx.getString(ctx, 'service.change_language'), {
                    reply_markup: Markup.inlineKeyboard(keyboard, { columns: 2 }),
                }).catch(() => {});
    
                ctx.answerCbQuery();
                break;
            case 'set_language':
                const language = ctx.match[0].split(':')[1];
                sendLog({
                    type: 'language_change',
                    id: ctx.from.id,
                    name: ctx.from.first_name,
                    old_language: i18n.t(user.language, 'language'),
                    new_language: i18n.t(language, 'language'),
                    timestamp: new Date()
                });
                ctx.i18n.locale(language);
    
                await User.updateOne({ id: ctx.from.id }, { $set: { language: language } }, () => {});
                ctx.session.user.language = language;
                
                await ctx.deleteMessage().catch(() => {});
    
                ctx.replyWithHTML(
                    ctx.getString(ctx, 'service.language_changed'),
                    Markup.keyboard([[ctx.i18n.t('button.settings')]])
                        .resize()
                        .extra()
                );
                break;
            default:
                console.log('No action determined');
                break;
        }
    } catch (err) {
        console.error(err);
    }
};