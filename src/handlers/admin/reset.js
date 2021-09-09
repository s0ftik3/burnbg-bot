const User = require('../../database/models/User');
const config = require('../../../config');

module.exports = () => async (ctx) => {
    try {
        if (ctx.from.id != config.admin) return;

        await User.deleteOne({ id: ctx.from.id });
        ctx.session.user = undefined;

        ctx.reply('/start');
    } catch (err) {
        console.error(err);
    }
};