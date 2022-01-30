'use strict';

const User = require('../../database/models/User');
const config = require('../../config');

module.exports = () => async (ctx) => {
    try {
        if (ctx.from.id != config.admin) return;

        const usersLength = await User.find().countDocuments();

        return ctx.replyWithHTML(`Number of users: <b>${usersLength}</b>`);
    } catch (err) {
        console.error(err);
    }
};
