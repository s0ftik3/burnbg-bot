'use strict';

module.exports = (text) => {
    try {
        const re = new RegExp('([\\w\\s]{' + (20 - 2) + ',}?\\w)\\s?\\b', 'g');
        return text.replace(re, '$1\n');
    } catch (err) {
        console.error(err);
    }
};