'use strict';

const convertToSticker = require('./convertToSticker');
const replyWithError = require('./replyWithError');

module.exports = async (ctx, result) => {
    try {
        const sticker = await convertToSticker(result.buffer, result.text);

        await ctx.deleteMessage(result.standby_message_id).catch((err) => {
            console.error(err);
        });

        await ctx
            .replyWithSticker(
                { source: sticker },
                {
                    reply_to_message_id: ctx.message.message_id,
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
