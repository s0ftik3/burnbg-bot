'use strict';

const Markup = require('telegraf/markup');
const replyWithError = require('../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        await ctx.answerCbQuery();

        ctx.user.to_sticker = ctx.user.to_sticker ? false : true;

        await ctx
            .editMessageReplyMarkup(
                Markup.inlineKeyboard([
                    [
                        Markup.callbackButton(ctx.i18n.t('button.language'), 'language'),
                        Markup.callbackButton(ctx.i18n.t('button.service'), 'service'),
                    ],
                    [
                        Markup.callbackButton(
                            ctx.i18n.t('button.to_sticker', {
                                state: ctx.user.to_sticker ? ctx.i18n.t('action.a_on') : ctx.i18n.t('action.a_off'),
                            }),
                            'to_sticker'
                        ),
                    ],
                ])
            )
            .catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });

        await ctx.user.save();
    } catch (err) {
        console.error(err);
    }
};
