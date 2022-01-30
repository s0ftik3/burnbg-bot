'use strict';

const Markup = require('telegraf/markup');
const replyWithError = require('../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        const user = ctx.user;
        const action = ctx.match;

        // For backwards compatibility
        if (user.service > 1) {
            user.service = 0;
            await user.save();
        }

        if (action === 'service') {
            await ctx.answerCbQuery();

            await ctx
                .editMessageText(
                    ctx.i18n.t('service.change_service', {
                        service_1: user.service === 0 ? '✅ <b>cutout.pro</b>' : 'cutout.pro',
                        service_2: user.service === 1 ? '✅ <b>benzin.io</b>' : 'benzin.io',
                    }),
                    {
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_markup: Markup.inlineKeyboard([
                            [
                                Markup.callbackButton(user.service === 0 ? '· Cutout ·' : 'Cutout', 'change_service:0'),
                                Markup.callbackButton(user.service === 1 ? '· Benzin ·' : 'Benzin', 'change_service:1'),
                            ],
                            [Markup.callbackButton(ctx.i18n.t('button.back'), 'back:settings')],
                        ]),
                    }
                )
                .catch((err) => {
                    console.error(err);
                    return replyWithError(ctx, 'METHOD_FAILED');
                });
        } else {
            const old_service = user.service;
            const new_service = Number(ctx.match[1]);

            if (new_service === old_service) {
                return ctx.answerCbQuery(ctx.i18n.t('error.the_same_service'), true);
            } else {
                await ctx.answerCbQuery();
            }

            ctx.user.service = new_service;

            ctx.editMessageText(
                ctx.i18n.t('service.change_service', {
                    service_1: user.service === 0 ? '✅ <b>cutout.pro</b>' : 'cutout.pro',
                    service_2: user.service === 1 ? '✅ <b>benzin.io</b>' : 'benzin.io',
                }),
                {
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                    reply_markup: Markup.inlineKeyboard([
                        [
                            Markup.callbackButton(user.service === 0 ? '· Cutout ·' : 'Cutout', 'change_service:0'),
                            Markup.callbackButton(user.service === 1 ? '· Benzin ·' : 'Benzin', 'change_service:1'),
                        ],
                        [Markup.callbackButton(ctx.i18n.t('button.back'), 'back:settings')],
                    ]),
                }
            ).catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });

            await ctx.user.save();
        }
    } catch (err) {
        console.error(err);
    }
};
