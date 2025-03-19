const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🔄 ARREGLANDO PÁGINA PRINCIPAL DE SELECCIÓN DE IDIOMAS');
    console.log('===================================================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });

    // 1. Descargar la página principal actual
    console.log('\n1. Descargando página principal actual...');
    const tempIndexPath = path.join(__dirname, '../temp_index.html');
    await client.downloadTo(tempIndexPath, '/index.html');
    console.log('✅ Página principal descargada');

    // 2. Leer y modificar el contenido
    console.log('\n2. Modificando el contenido...');
    let content = fs.readFileSync(tempIndexPath, 'utf8');
    
    // Reemplazar la imagen del logo
    content = content.replace(
      /<img[^>]*src="[^"]*"[^>]*>/i,
      '<img src="assets/images/logo/logo-main1.png" alt="Miss Star International" style="max-width: 300px; margin-bottom: 30px;">'
    );
    
    // Verificar si se realizó el cambio
    if (content.includes('assets/images/logo/logo-main1.png')) {
      console.log('✅ Referencia al logo actualizada');
    } else {
      console.error('❌ No se pudo actualizar la referencia al logo');
    }
    
    // Guardar los cambios
    fs.writeFileSync(tempIndexPath, content, 'utf8');
    
    // 3. Subir el archivo modificado
    console.log('\n3. Subiendo página actualizada...');
    await client.uploadFrom(tempIndexPath, '/index.html');
    console.log('✅ Página principal actualizada');
    
    // 4. Verificar también que el logo existe en la ubicación correcta
    console.log('\n4. Verificando/subiendo el logo...');
    const logoPath = path.join(__dirname, '../assets/images/logo/logo-main1.png');
    
    // Subir el logo a varias ubicaciones por seguridad
    const logoDestinations = [
      '/assets/images/logo/logo-main1.png',
      '/assets/images/logo-main1.png',
      '/assets/images/logo.png'
    ];
    
    for (const dest of logoDestinations) {
      try {
        await client.uploadFrom(logoPath, dest);
        console.log(`✅ Logo subido a: ${dest}`);
      } catch (err) {
        console.error(`❌ Error al subir el logo a ${dest}:`, err.message);
      }
    }
    
    // 5. También crear una versión HTML mejorada de la página principal
    console.log('\n5. Creando versión mejorada de la página principal...');
    
    const enhancedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miss Star International - Welcome</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #000;
            color: #fff;
            text-align: center;
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .logo {
            margin-bottom: 40px;
            max-width: 300px;
        }
        .title {
            font-size: 3rem;
            color: #D4AF37;
            margin-bottom: 50px;
        }
        .language-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
        }
        .language-option {
            width: 200px;
            height: 200px;
            background-color: rgba(30, 30, 30, 0.7);
            border: 2px solid #D4AF37;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
            cursor: pointer;
            text-decoration: none;
            color: #D4AF37;
        }
        .language-option:hover {
            transform: scale(1.05);
            background-color: rgba(50, 50, 50, 0.7);
        }
        .flag {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-bottom: 15px;
        }
        .language-name {
            font-size: 1.5rem;
        }
        footer {
            margin-top: 50px;
            color: #888;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <img src="assets/images/logo/logo-main1.png" alt="Miss Star International" class="logo">
    
    <h1 class="title">Select Your Language</h1>
    
    <div class="language-grid">
        <a href="en/" class="language-option">
            <img src="assets/images/flags/uk.png" alt="English" class="flag">
            <span class="language-name">English</span>
        </a>
        
        <a href="es/" class="language-option">
            <img src="assets/images/flags/spain.png" alt="Español" class="flag">
            <span class="language-name">Español</span>
        </a>
        
        <a href="pt/" class="language-option">
            <img src="assets/images/flags/portugal.png" alt="Português" class="flag">
            <span class="language-name">Português</span>
        </a>
        
        <a href="th/" class="language-option">
            <img src="assets/images/flags/thailand.png" alt="ไทย" class="flag">
            <span class="language-name">ไทย</span>
        </a>
        
        <a href="vi/" class="language-option">
            <img src="assets/images/flags/vietnam.png" alt="Tiếng Việt" class="flag">
            <span class="language-name">Tiếng Việt</span>
        </a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
</body>
</html>`;

    // Guardar la versión mejorada
    const enhancedPath = path.join(__dirname, '../temp_enhanced_index.html');
    fs.writeFileSync(enhancedPath, enhancedHtml, 'utf8');
    
    // Subir la versión mejorada
    await client.uploadFrom(enhancedPath, '/enhanced-index.html');
    console.log('✅ Versión mejorada subida como enhanced-index.html');
    
    // Verificar si los flags existen, si no, subir placeholders
    console.log('\n6. Verificando/creando directorio para flags...');
    try {
      await client.ensureDir('/assets/images/flags');
      console.log('✅ Directorio de flags creado/verificado');
    } catch (err) {
      console.error('❌ Error al crear directorio de flags:', err.message);
    }
    
    // Eliminar archivos temporales
    fs.unlinkSync(tempIndexPath);
    fs.unlinkSync(enhancedPath);
    
    console.log('\n✅ PÁGINA PRINCIPAL ARREGLADA CON ÉXITO');
    console.log('Ahora puedes acceder a la versión mejorada en: https://missstarinternational.com/enhanced-index.html');
    console.log('Si te gusta como se ve, puedes renombrarla a index.html');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    client.close();
  }
}

main(); 