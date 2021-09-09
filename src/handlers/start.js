'use strict';

const Markup = require('telegraf/markup');
const getUserSession = require('../scripts/getUserSession');
const recordUser = require('../database/recordUser');
const setLanguage = require('../scripts/setLanguage');
const replyWithError = require('../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);

        if (user === null) {
            const data = {
                id: ctx.from.id,
                first_name: ctx.from.first_name.replace(/[<>]/g, ''),
                last_name: ctx.from.last_name === undefined ? null : ctx.from.last_name,
                username: ctx.from.username === undefined ? null : ctx.from.username,
                language: setLanguage(ctx.from.language_code)
            };

            recordUser(data).then(async () => {
                ctx.session.user = { 
                    ...data, 
                    to_sticker: false, 
                    service: 0,
                    usage: 0,
                    converted_to_sticker: 0,
                    converted_to_file: 0
                };
                ctx.i18n.locale(data.language);

                await ctx.replyWithHTML(
                    ctx.i18n.t('service.greeting', { name: data.first_name }), 
                    Markup.keyboard([[ctx.i18n.t('button.settings')]])
                        .resize()
                        .extra()
                ).catch(() => replyWithError(ctx, 15));
            });
        } else {
            ctx.i18n.locale(user.language);
            ctx.session.user = user;
            
            await ctx.replyWithHTML(
                ctx.i18n.t('service.greeting', { name: ctx.from.first_name.replace(/[<>]/g, '') }), 
                Markup.keyboard([[ctx.i18n.t('button.settings')]])
                    .resize()
                    .extra()
            ).catch(() => replyWithError(ctx, 15));
        }
    } catch (err) {
        console.error(err);
    }
};