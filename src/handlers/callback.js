'use strict';

module.exports = () => (ctx) => {
    try {
        return ctx.answerCbQuery();
    } catch (err) {
        console.error(err);
    }
};