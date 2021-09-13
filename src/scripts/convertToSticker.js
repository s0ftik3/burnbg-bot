'use strict';

const sharp = require('sharp');
const text2png = require('text2png');
const path = require('path');
const breakLine = require('./breakLine');

module.exports = async (image, text) => {
    try {
        sharp.concurrency(1);

        const config = {
            width: 512,
            height: 512,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        };

        const background = await sharp({ create: config })
            .webp()
            .toBuffer();

        const buffer = await sharp(image)
            .trim()
            .webp()
            .toBuffer();

        const image_over_background = await sharp(buffer)
            .resize({
                width: 512,
                height: 512,
                fit: sharp.fit.inside
            })
            .webp()
            .toBuffer();

        if (text && text.length <= 64) {
            const text_buffer = text2png(breakLine(text), {
                font: '32px Berlin',
                localFontPath: path.resolve(__dirname, '../assets/BERLIN-BOLD.ttf'),
                localFontName: 'Berlin',
                color: 'white',
                backgroundColor: 'black',
                textAlign: 'center',
                lineSpacing: 10,
                padding: 15,
                output: 'buffer'
            });

            return await sharp(background)
                .composite([
                    { input: image_over_background },
                    { input: text_buffer, gravity: 'south' }
                ])
                .webp()
                .toBuffer();
        } else {
            return await sharp(background)
                .composite([
                    { input: image_over_background }
                ])
                .webp()
                .toBuffer();
        }
    } catch (err) {
        console.error(err);
    }
};