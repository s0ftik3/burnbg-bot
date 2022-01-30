'use strict';

const User = require('./models/User');

module.exports = async (id) => {
    try {
        return User.deleteOne({ id })
            .then(() => {
                return { ok: true };
            })
            .catch((err) => {
                return { ok: false, message: err.message };
            });
    } catch (err) {
        console.error(err);
    }
};
