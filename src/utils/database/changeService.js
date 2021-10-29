const User = require('../../database/models/User');

module.exports = async (ctx) => {
    const user = await User.find({ id: ctx.from.id }).then(response => response[0]);
    const new_service = (user.service === 0) ? 1 : 0;

    await User.updateOne({ id: ctx.from.id }, {
        $set: { service: new_service }
    }, () => {});
    
    ctx.session.user.service = new_service;

    return new_service;
};