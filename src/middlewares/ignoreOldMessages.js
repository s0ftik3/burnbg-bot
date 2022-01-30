'use strict';

module.exports = () => {
    return async (ctx, next) => {
        try {
            if (new Date().getTime() / 1000 - (ctx?.message?.date || ctx?.update?.callback_query?.message?.date) < (1400 * 60)) {
                return next();
            } else {
                console.info(
                    `[${ctx.chat?.id}] Ignoring update (${ctx.updateType})`
                );
            }
        } catch (err) {
            console.error(err)
        }
    }
}