'use strict';

const User = require('./models/User');

module.exports = async (id, timestamp) => {
    try {
        const user = await User.findOne({ id, 'files.timestamp': timestamp });
        const file = user.files.filter((e) => new Date(e.timestamp).getTime() === new Date(timestamp).getTime());

        return file ? JSON.parse(JSON.stringify(file[0])) : false;
    } catch (err) {
        console.error(err);
    }
};
