'use strict';

const User = require('./models/User');

module.exports = async (data) => {
    try {
        const user = await User.findOne({ id: data.id });

        if (!user) {
            return await new User({ ...data }).save();
        } else {
            return user;
        }
    } catch (err) {
        console.error(err);
    }
};
