'use strict';

const Markup = require('telegraf/markup');
const assignBetaTester = require('../database/assignBetaTester');
const replyWithError = require('../scripts/replyWithError');

module.exports = () => (ctx) => {
    try {
        if (ctx.startPayload.length > 0) return assignBetaTester(ctx);

        return ctx
            .replyWithHTML(
                ctx.i18n.t('service.greeting', { name: ctx.from.first_name.replace(/[<>]/g, '') }),
                Markup.keyboard([[ctx.i18n.t('button.settings')]])
                    .resize()
                    .extra()
            )
            .catch((err) => {
                console.error(err);
                return replyWithError(ctx, 'METHOD_FAILED');
            });
    } catch (err) {
        console.error(err);
    }
};
