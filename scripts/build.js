const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const terser = require('terser');

// Crear directorios
fs.mkdirSync('public/assets/images', { recursive: true });
fs.mkdirSync('public/assets/js', { recursive: true });
fs.mkdirSync('public/assets/css', { recursive: true });
fs.mkdirSync('public/en', { recursive: true });

// Copiar y optimizar archivos
async function buildSite() {
    // Copiar HTML
    fs.copyFileSync('index.html', 'public/index.html');
    fs.copyFileSync('history.html', 'public/history.html');
    fs.copyFileSync('en/conference.html', 'public/en/conference.html');
    fs.copyFileSync('en/history.html', 'public/en/history.html');

    // Optimizar JS
    const jsFiles = await terser.minify({
        'conference.js': fs.readFileSync('assets/js/conference.js', 'utf8')
    });
    fs.writeFileSync('public/assets/js/conference.js', jsFiles.code);

    // Optimizar CSS
    const css = fs.readFileSync('assets/css/style.css', 'utf8');
    fs.writeFileSync('public/assets/css/style.css', css);

    // Optimizar imágenes
    await imagemin(['assets/images/*.{jpg,png}'], {
        destination: 'public/assets/images'
    });
}

buildSite(); 