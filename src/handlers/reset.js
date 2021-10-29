const User = require('../database/models/User');
const Markup = require('telegraf/markup');
const getUser = require('../utils/database/getUser');
const replyWithError = require('../utils/general/replyWithError');
const sendLog = require('../utils/general/sendLog');
const getUserSession = require('../utils/general/getUserSession');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);
        
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
                    await User.deleteOne({ id: ctx.from.id });
                    ctx.session.user = undefined;

                    await ctx.deleteMessage();

                    ctx.replyWithHTML(ctx.getString(ctx, 'service.reset'), {
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_markup: { remove_keyboard: true }
                    });

                    sendLog({
                        type: 'reseted', 
                        id: ctx.from.id,
                        name: ctx.from.first_name
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