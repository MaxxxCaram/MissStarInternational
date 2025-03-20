const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const terser = require('terser');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
    await imagemin(['assets/images/*.{jpg,png}'], {
        destination: 'public/assets/images',
        plugins: [
            mozjpeg({ quality: 75 }),
            pngquant({ quality: [0.6, 0.8] })
        ]
    });
}

async function minifyJS() {
    const jsFiles = [
        'assets/js/conference.js',
        'assets/js/history.js'
    ];

    for (const file of jsFiles) {
        const code = fs.readFileSync(file, 'utf8');
        const minified = await terser.minify(code);
        fs.writeFileSync(`public/${file}`, minified.code);
    }
}

optimizeImages();
minifyJS(); 