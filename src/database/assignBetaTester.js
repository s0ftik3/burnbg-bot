'use strict';

const User = require('./models/User');
const replyWithError = require('../scripts/replyWithError');

module.exports = async (ctx) => {
    const testers = await User.find({ beta: true });
    const isAlreadyInList = testers.find((e) => e.id === ctx.from.id);

    if (ctx.startPayload !== 'beta')
        return ctx.replyWithHTML(ctx.i18n.t('service.wrong_payload')).catch((err) => {
            console.error(err);
            return replyWithError(ctx, 'METHOD_FAILED');
        });

    if (isAlreadyInList)
        return ctx.replyWithHTML(ctx.i18n.t('service.already_joined_beta')).catch((err) => {
            console.error(err);
            return replyWithError(ctx, 'METHOD_FAILED');
        });

    if (testers.length >= 50) {
        await ctx.replyWithHTML(ctx.i18n.t('service.beta_full')).catch((err) => {
            console.error(err);
            return replyWithError(ctx, 'METHOD_FAILED');
        });
    } else {
        await User.updateOne({ id: ctx.from.id }, { $set: { beta: true } }, () => {});
        await ctx.replyWithHTML(ctx.i18n.t('service.joined_beta')).catch((err) => {
            console.error(err);
            return replyWithError(ctx, 'METHOD_FAILED');
        });
    }
};
