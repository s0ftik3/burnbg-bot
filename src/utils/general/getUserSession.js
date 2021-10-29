'use strict';

const getUser = require('../database/getUser');

module.exports = async (ctx) => {
    try {
        if (ctx.session.user === undefined) {
            const user = await getUser(ctx.from.id);
            ctx.session.user = user;

            return user;
        } else {
            return ctx.session.user;
        }
    } catch (err) {
        console.error(err);
    }
};