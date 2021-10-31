const User = require('../../database/models/User');
const config = require('../../config');
const sendLog = require('../general/sendLog');

module.exports = async (ctx) => {
    const testers = await User.find({ beta: true });

    if (ctx.startPayload !== 'beta') return ctx.replyWithHTML(ctx.getString(ctx, 'service.wrong_payload'));
    if (testers.find(e => e.id === ctx.from.id)) return ctx.replyWithHTML(ctx.getString(ctx, 'service.already_joined_beta'));

    if (testers.length >= 50) {
        await ctx.replyWithHTML(ctx.getString(ctx, 'service.beta_full'));
        await ctx.telegram.sendMessage(config.admin, 'The list of beta testers is full.')
    } else {
        await ctx.replyWithHTML(ctx.getString(ctx, 'service.joined_beta'));
        await User.updateOne({ id: ctx.from.id }, { 
            $set: { beta: true }
        }, () => {});

        sendLog({
            type: 'beta', 
            id: ctx.from.id,
            name: ctx.from.first_name
        });
        
        if (ctx.session.user) {
            ctx.session.user.beta = true;
        }
    }
};