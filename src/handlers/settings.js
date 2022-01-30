'use strict';

const Markup = require('telegraf/markup');
const createStatsObject = require('../scripts/createStatsObject');
const replyWithError = require('../scripts/replyWithError');

module.exports = () => (ctx) => {
    try {
        return ctx
            .replyWithHTML(
                ctx.i18n.t(ctx.user.usage <= 0 ? 'service.settings_new' : 'service.settings', {
                    beta_sign: ctx.user.beta ? '(beta)' : '',
                    ...createStatsObject(ctx),
                }),
                {
                    reply_markup: Markup.inlineKeyboard([
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
                    ]),
                    disable_web_page_preview: true,
                }
            )
            .catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
    } catch (err) {
        console.error(err);
    }
};
