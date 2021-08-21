'use strict';

const fs = require('fs');

module.exports = (language) => {
    try {
        const folder = fs.readdirSync('./src/locales/');
        const ISO = folder.map(e => e.replace('.yaml', ''));

        return ISO.includes(language) ? language : 'en';
    } catch (err) {
        console.error(err);
    }
};