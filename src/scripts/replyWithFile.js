'use strict';

const replyWithError = require('./replyWithError');

module.exports = async (ctx, result) => {
    try {
        await ctx.replyWithChatAction('upload_document');

        await ctx.deleteMessage(result.standby_message_id).catch((err) => {
            console.error(err);
        });

        await ctx
            .replyWithDocument(
                {
                    source: result.buffer,
                    filename: result.message?.file_name ? `${result.message.file_name}.png` : '@burnbgbot.png',
                },
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
