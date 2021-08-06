'use strict';

const Markup = require('telegraf/markup');
const getUserSession = require('../scripts/getUserSession');
const recordUser = require('../database/recordUser');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);

        if (user === null) {
            const data = {
                id: ctx.from.id,
                first_name: ctx.from.first_name == undefined ? null : ctx.from.first_name,
                last_name: ctx.from.last_name == undefined ? null : ctx.from.last_name,
                username: ctx.from.username == undefined ? null : ctx.from.username,
                language: 'en', 
                to_sticker: false,
                usage: 0
            };

            recordUser(data).then(async () => {
                ctx.session.user = data;
                
                await ctx.replyWithHTML(
                    ctx.i18n.t('service.greeting', { name: ctx.from.first_name }), 
                    Markup.keyboard([[ctx.i18n.t('button.settings')]])
                        .resize()
                        .extra()
                );
                ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                    [
                        Markup.urlButton(ctx.i18n.t('button.channel'), 'https://t.me/softik'),
                        Markup.urlButton(ctx.i18n.t('button.support'), 'https://t.me/vychs')
                    ]
                ]));
            });
        } else {
            ctx.i18n.locale(user.language);
            ctx.session.user = user;
            
            await ctx.replyWithHTML(
                ctx.i18n.t('service.greeting', { name: ctx.from.first_name }), 
                Markup.keyboard([[ctx.i18n.t('button.settings')]])
                    .resize()
                    .extra()
            );
            ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                [
                    Markup.urlButton(ctx.i18n.t('button.channel'), 'https://t.me/softik'),
                    Markup.urlButton(ctx.i18n.t('button.support'), 'https://t.me/vychs')
                ]
            ]));
        }
    } catch (err) {
        console.error(err);
    }
};