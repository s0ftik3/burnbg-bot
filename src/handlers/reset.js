const User = require('../database/models/User');
const Markup = require('telegraf/markup');
const getUser = require('../database/getUser');
const replyWithError = require('../scripts/replyWithError');
const config = require('../../config');

module.exports = () => async (ctx) => {
    try {
        if (ctx.from.id != config.admin) return;
    
        const is_user_exist = ((await getUser(ctx.from.id)) === null) ? false : true;
        
        if (!is_user_exist) return replyWithError(ctx, 16);

        switch (ctx.updateType) {
            case 'message':
                ctx.replyWithHTML(ctx.getString(ctx, 'service.pre_reset'), {
                    reply_markup: Markup.inlineKeyboard([
                        [
                            Markup.callbackButton(ctx.i18n.t('action.a_yes'), 'yes'),
                            Markup.callbackButton(ctx.i18n.t('action.a_no'), 'no')
                        ]
                    ]),
                    disable_web_page_preview: true
                });

                break;
            case 'callback_query':
                const action = ctx.match;

                if (action === 'yes') {
                    // await User.deleteOne({ id: ctx.from.id });
                    // ctx.session.user = undefined;

                    ctx.editMessageText(ctx.getString(ctx, 'service.reset'), {
                        parse_mode: 'HTML',
                        disable_web_page_preview: true
                    });
                } else {
                    ctx.deleteMessage();
                }

                ctx.answerCbQuery();

                break;
            default:
                break;
        }
    } catch (err) {
        console.error(err);
    }
};