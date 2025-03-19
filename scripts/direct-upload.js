const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MODO YOLO - Forzar sincronización inmediata
async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🔥 MODO YOLO - SINCRONIZACIÓN DE EMERGENCIA 🔥');
    console.log('Conectando al servidor FTP...');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });

    // 1. Subir los logos INMEDIATAMENTE
    console.log('\n1. ¡SUBIENDO TODOS LOS LOGOS AHORA!');
    
    // Subir logo a múltiples ubicaciones para asegurarnos
    const logoSource = path.join(__dirname, '../assets/images/logo/logo-main1.png');
    const logoDestinations = [
      '/assets/images/logo/logo.png',
      '/assets/images/logo/logo-main.png',
      '/assets/images/logo/logo-main1.png',
      '/assets/images/logo-main1.png',
      '/assets/images/logo.png',
      '/en/assets/images/logo.png',
      '/es/assets/images/logo.png',
      '/pt/assets/images/logo.png',
      '/th/assets/images/logo.png',
      '/vi/assets/images/logo.png'
    ];
    
    for (const dest of logoDestinations) {
      try {
        await client.uploadFrom(logoSource, dest);
        console.log(`✅ Logo subido a: ${dest}`);
      } catch (err) {
        console.error(`❌ Error al subir logo a ${dest}:`, err.message);
        // Intentar crear directorios padre si es necesario
        try {
          const parentDir = path.dirname(dest);
          await client.ensureDir(parentDir);
          console.log(`Directorio creado: ${parentDir}, reintentando...`);
          await client.uploadFrom(logoSource, dest);
          console.log(`✅ Logo subido a: ${dest} (segundo intento)`);
        } catch (dirErr) {
          console.error(`❌ No se pudo crear el directorio o subir el logo a ${dest}`);
        }
      }
    }

    // 2. Sincronizar todas las páginas index.html
    console.log('\n2. SINCRONIZANDO TODAS LAS PÁGINAS PRINCIPALES');
    
    const languages = ['es', 'pt', 'th', 'vi'];
    const enIndexPath = path.join(__dirname, '../en/index.html');
    
    if (!fs.existsSync(enIndexPath)) {
      console.error('❌ No se encontró el archivo en inglés localmente.');
      // Intentar descargar del servidor
      const tempEnPath = path.join(__dirname, '../temp_en_index.html');
      await client.downloadTo(tempEnPath, '/en/index.html');
      console.log('✅ Se descargó la versión del servidor.');
      fs.copyFileSync(tempEnPath, enIndexPath);
      fs.unlinkSync(tempEnPath);
    }
    
    const enIndexContent = fs.readFileSync(enIndexPath, 'utf8');
    
    // Subir la versión en inglés primero para confirmar
    await client.uploadFrom(enIndexPath, '/en/index.html');
    console.log('✅ Versión EN actualizada.');
    
    // Para cada idioma, adaptar y subir
    for (const lang of languages) {
      console.log(`\nProcesando idioma: ${lang}`);
      
      // Adaptar el contenido al idioma
      let adaptedContent = enIndexContent;
      adaptedContent = adaptedContent.replace('<html lang="en">', `<html lang="${lang}">`);
      
      // Adaptar título según el idioma
      if (lang === 'es') {
        adaptedContent = adaptedContent.replace('<title>Miss Star International - A New Dynasty</title>', 
                                              '<title>Miss Star International - Una Nueva Dinastía</title>');
      } else if (lang === 'pt') {
        adaptedContent = adaptedContent.replace('<title>Miss Star International - A New Dynasty</title>', 
                                              '<title>Miss Star International - Uma Nova Dinastia</title>');
      }
      
      // Traducir menú de navegación según el idioma
      if (lang === 'es') {
        adaptedContent = adaptedContent.replace('>About</a>', '>Sobre Nosotros</a>');
        adaptedContent = adaptedContent.replace('>Franchises</a>', '>Franquicias</a>');
        adaptedContent = adaptedContent.replace('>History</a>', '>Historia</a>');
        adaptedContent = adaptedContent.replace('>Contact</a>', '>Contacto</a>');
      } else if (lang === 'pt') {
        adaptedContent = adaptedContent.replace('>About</a>', '>Sobre Nós</a>');
        adaptedContent = adaptedContent.replace('>Franchises</a>', '>Franquias</a>');
        adaptedContent = adaptedContent.replace('>History</a>', '>História</a>');
        adaptedContent = adaptedContent.replace('>Contact</a>', '>Contato</a>');
      }
      
      const tempPath = path.join(__dirname, `../temp_${lang}_index.html`);
      fs.writeFileSync(tempPath, adaptedContent, 'utf8');
      
      // Subir la versión adaptada
      await client.uploadFrom(tempPath, `/${lang}/index.html`);
      console.log(`✅ Versión ${lang.toUpperCase()} actualizada.`);
      
      // Limpiar
      fs.unlinkSync(tempPath);
    }

    // 3. Verificar assets críticos
    console.log('\n3. VERIFICANDO ASSETS CRÍTICOS');
    const criticalAssets = [
      { local: '../assets/css/styles.css', remote: '/assets/css/styles.css' },
      { local: '../assets/js/main.js', remote: '/assets/js/main.js' },
      { local: '../assets/videos/hero-video.mp4', remote: '/assets/videos/hero-video.mp4' },
      { local: '../favicon.ico', remote: '/favicon.ico' }
    ];
    
    for (const asset of criticalAssets) {
      if (fs.existsSync(path.join(__dirname, asset.local))) {
        try {
          await client.uploadFrom(path.join(__dirname, asset.local), asset.remote);
          console.log(`✅ Asset subido: ${asset.remote}`);
        } catch (err) {
          console.error(`❌ Error al subir ${asset.remote}:`, err.message);
          // Intentar crear el directorio padre
          try {
            const parentDir = path.dirname(asset.remote);
            await client.ensureDir(parentDir);
            await client.uploadFrom(path.join(__dirname, asset.local), asset.remote);
            console.log(`✅ Asset subido (segundo intento): ${asset.remote}`);
          } catch (dirErr) {
            console.error(`❌ No se pudo crear el directorio para ${asset.remote}`);
          }
        }
      } else {
        console.error(`❌ No se encontró el archivo local: ${asset.local}`);
      }
    }

    console.log('\n✅ SINCRONIZACIÓN YOLO COMPLETADA.');
  } catch (err) {
    console.error('ERROR GENERAL:', err);
  } finally {
    client.close();
  }
}

main(); 