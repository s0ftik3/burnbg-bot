'use strict';

const deleteUser = require('../database/deleteUser');

module.exports = {
    onUserBlock: async (ctx, next, userId) => {
        try {
            const isDeleted = await deleteUser(userId);

            if (!isDeleted.ok) {
                console.error(isDeleted.message);
            } else {
                console.log(`[${userId}] Deleted user due to block`);
            }

            return next();
        } catch (err) {
            console.error(err);
        }
    },
};
