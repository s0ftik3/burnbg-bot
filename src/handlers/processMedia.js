'use strict';

const User = require('../database/models/User');
const axios = require('axios');
const getUserSession = require('../scripts/getUserSession');
const removeBackground = require('../scripts/removeBackground');
const convertToSticker = require('../scripts/convertToSticker');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const message_type = (ctx.message.document) ? 'document' : 'photo';

        if (!user.to_sticker) {
            ctx.replyWithChatAction('upload_document');
        } else {
            ctx.replyWithHTML(ctx.i18n.t('service.standby'))
        }
        
        switch(message_type) {
            case 'document':
                const mime_type = ctx.message.document.mime_type;
                if (mime_type === 'image/jpeg' || mime_type === 'image/png') {
                    const url = await removeBackground(ctx);
                    const image = await axios.get(url, {
                        responseType: 'arraybuffer'
                    }).then(response => Buffer.from(response.data, 'binary'));
                    
                    if (user.to_sticker) {
                        const sticker = await convertToSticker(image);

                        await ctx.deleteMessage();

                        ctx.replyWithSticker({ source: sticker }, {
                            reply_to_message_id: ctx.message.message_id
                        });
                    } else {
                        ctx.replyWithDocument({ 
                            source: image, 
                            filename: '@burnbgbot.png' 
                        }, {
                            reply_to_message_id: ctx.message.message_id
                        });
                    }
                } else {
                    return ctx.reply(ctx.i18n.t('error.wrong_file_extension'));
                }
                break;
            case 'photo':
                const url = await removeBackground(ctx);
                const image = await axios.get(url, {
                    responseType: 'arraybuffer'
                }).then(response => Buffer.from(response.data, 'binary'));
        
                if (user.to_sticker) {
                    const sticker = await convertToSticker(image);

                    await ctx.deleteMessage();

                    ctx.replyWithSticker({ source: sticker }, {
                        reply_to_message_id: ctx.message.message_id
                    });
                } else {
                    ctx.replyWithDocument({ 
                        source: image, 
                        filename: '@burnbgbot.png' 
                    }, {
                        reply_to_message_id: ctx.message.message_id
                    });
                }
                
                break;
            default:
                break;
        }

        User.updateOne({ id: ctx.from.id }, { $set: { usage: user.usage + 1 } }, () => {});
        ctx.session.user.usage = user.usage + 1;
    } catch (err) {
        console.error(err);
    }
};