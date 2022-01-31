'use strict';

const User = require('../../database/models/User');
const config = require('../../config');

module.exports = () => async (ctx) => {
    try {
        if (ctx.from.id != config.admin) return;

        const usersLength = await User.find().countDocuments();
        const lastTimeUsersLength = ctx.session?.usersLength;
        const difference = lastTimeUsersLength ? usersLength - lastTimeUsersLength : 0;

        ctx.session.usersLength = usersLength;

        return ctx.replyWithHTML(
            `Number of users: <b>${usersLength}</b> <code>(${(difference <= 0 ? '' : '+') + difference})</code>`
        );
    } catch (err) {
        console.error(err);
    }
};
