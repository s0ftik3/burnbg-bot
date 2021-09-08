const sendLog = require('../scripts/sendLog');
const User = require('./models/User');

module.exports = async (data) => {
    const user = new User(data);
    await user.save()
        .then(() => sendLog({ type: 'new_user', id: data.id, name: data.first_name }))
        .catch(err => console.error(`[${data.id}] Failed to record\n\n` + err));
};