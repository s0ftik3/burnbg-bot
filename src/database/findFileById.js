'use strict';

const User = require('./models/User');

module.exports = async (id, fileId) => {
    try {
        const user = await User.findOne({ id, 'files.file_id': fileId });
        const file = user.files.filter((e) => e.file_id == fileId);

        return file ? file[0] : false;
    } catch (err) {
        console.error(err);
    }
};
