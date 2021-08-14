'use strict';

const User = require('../database/models/User');
const axios = require('axios');
const getUserSession = require('../scripts/getUserSession');
const removeBackground = require('../scripts/removeBackground');
const convertToSticker = require('../scripts/convertToSticker');
const replyWithError = require('../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const message_type = (ctx.message.document) ? 'document' : 'photo';

        if (message_type === 'document') {
            const mime_type = ctx.message.document.mime_type;
            if (mime_type !== 'image/jpeg' && mime_type !== 'image/png') return replyWithError(ctx, 2);
        }

        if (!user.to_sticker) {
            ctx.replyWithChatAction('upload_document');
        } else {
            ctx.replyWithHTML(ctx.i18n.t('service.standby'))
        }

        const result = await removeBackground(ctx);

        if (result === undefined) return replyWithError(ctx, 3);
        if (result === null) return replyWithError(ctx, 4);

        let image;

        if (user.service === 1) {
            image = Buffer.from(result, 'base64');
        } else {
            image = await axios.get(result, {
                responseType: 'arraybuffer'
            }).then(response => Buffer.from(response.data, 'binary'));   
        }

        if (user.to_sticker) {
            const sticker = await convertToSticker(image);

            await ctx.deleteMessage(ctx.message.message_id + 1);

            ctx.replyWithSticker({ source: sticker }, {
                reply_to_message_id: ctx.message.message_id
            });

            console.log(`[${ctx.from.id}] Converted to a sticker.`);
        } else {
            ctx.replyWithDocument({ 
                source: image, 
                filename: '@burnbgbot.png' 
            }, {
                reply_to_message_id: ctx.message.message_id
            });

            console.log(`[${ctx.from.id}] Converted to a no-background image.`);
        }

        User.updateOne({ id: ctx.from.id }, { 
            $inc: { 
                usage: 1,
                converted_to_sticker: (user.to_sticker) ? 1 : 0,
                converted_to_file: (user.to_sticker) ? 0 : 1
            },
            $set: { last_time_used: new Date() }
        }, () => {});
        
        ctx.session.user.usage = user.usage + 1;
        ctx.session.user.converted_to_sticker = user.converted_to_sticker + 1;
        ctx.session.user.converted_to_file = user.converted_to_file + 1;
    } catch (err) {
        console.error(err);
    }
};