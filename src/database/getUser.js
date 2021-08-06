const User = require('./models/User');

module.exports = async (id) => {
    return await User.find({ id })
        .then((response) => response.length <= 0 ? null : response[0])
        .catch(err => console.error(`[Database] An error occured while finding a user (${id}).\n\n` + err));
};