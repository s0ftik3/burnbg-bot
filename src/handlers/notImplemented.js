'use strict';

module.exports = () => (ctx) => {
    try {
        return ctx.answerCbQuery(ctx.i18n.t('error.not_implemented'), true);
    } catch (err) {
        console.error(err);
    }
};
