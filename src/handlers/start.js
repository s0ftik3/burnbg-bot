'use strict';

const Markup = require('telegraf/markup');
const getUserSession = require('../utils/general/getUserSession');
const recordUser = require('../utils/database/recordUser');
const setLanguage = require('../utils/general/setLanguage');
const replyWithError = require('../utils/general/replyWithError');
const assignBetaTester = require('../utils/database/assignBetaTester');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);

        if (ctx.startPayload.length > 0) return assignBetaTester(ctx);

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
                    role: 'user',
                    to_sticker: false,
                    add_text: false,
                    service: 0,
                    usage: 0,
                    converted_to_sticker: 0,
                    converted_to_file: 0
                };
                ctx.i18n.locale(data.language);

                await ctx.replyWithHTML(
                    ctx.getString(ctx, 'service.greeting', { name: data.first_name }),
                    Markup.keyboard([[ctx.i18n.t('button.settings')]])
                        .resize()
                        .extra()
                ).catch(() => replyWithError(ctx, 15));
            });
        } else {
            ctx.i18n.locale(user.language);
            ctx.session.user = user;
            
            await ctx.replyWithHTML(
                ctx.getString(ctx, 'service.greeting', { name: ctx.from.first_name.replace(/[<>]/g, '') }), 
                Markup.keyboard([[ctx.i18n.t('button.settings')]])
                    .resize()
                    .extra()
            ).catch(() => replyWithError(ctx, 15));
        }
    } catch (err) {
        console.error(err);
    }
};