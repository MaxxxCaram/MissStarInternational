const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🔄 SUBIENDO LOGO DIRECTAMENTE A LA RAÍZ');
    console.log('======================================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });

    // Subir el logo directamente a la raíz
    console.log('\n1. Subiendo logo a múltiples ubicaciones...');
    const logoPath = path.join(__dirname, '../assets/images/logo/logo-main1.png');
    
    // Lista de destinos donde colocar el logo
    const destinations = [
      '/logo.png',                      // Raíz como logo.png
      '/logo-main1.png',                // Raíz como logo-main1.png
      '/assets/logo.png',               // Carpeta assets
      '/assets/images/logo.png',        // Carpeta assets/images
      '/assets/images/logo/logo.png',   // Carpeta original pero con nombre simplificado
      '/assets/images/logo/logo-main1.png'  // Ubicación original
    ];

    for (const destination of destinations) {
      try {
        await client.uploadFrom(logoPath, destination);
        console.log(`✅ Logo subido a: ${destination}`);
      } catch (err) {
        console.error(`❌ Error al subir a ${destination}: ${err.message}`);
        
        // Intentar crear directorios si no existen
        if (err.message.includes('No such file')) {
          const parts = destination.split('/').filter(Boolean);
          let currentPath = '';
          
          // Crear directorios recursivamente
          for (let i = 0; i < parts.length - 1; i++) {
            currentPath += '/' + parts[i];
            try {
              await client.ensureDir(currentPath);
              console.log(`✅ Directorio creado: ${currentPath}`);
            } catch (dirErr) {
              console.log(`⚠️ No se pudo crear directorio ${currentPath}: ${dirErr.message}`);
            }
          }
          
          // Intentar subir nuevamente después de crear directorios
          try {
            await client.uploadFrom(logoPath, destination);
            console.log(`✅ Logo subido a: ${destination} (después de crear directorios)`);
          } catch (retryErr) {
            console.error(`❌ Error al reintentar subida a ${destination}: ${retryErr.message}`);
          }
        }
      }
    }
    
    // 2. Crear un HTML simple que muestre el logo
    console.log('\n2. Creando HTML simple con el logo...');
    const simpleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miss Star International - Logo</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #000;
            color: #fff;
            font-family: Arial, sans-serif;
        }
        img {
            max-width: 90%;
            max-height: 70vh;
        }
        h1 {
            margin-top: 20px;
            color: #D4AF37;
        }
        .links {
            margin-top: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        a {
            color: #D4AF37;
            margin: 5px 0;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <img src="/logo.png" alt="Miss Star International Logo">
    <h1>Miss Star International</h1>
    <div class="links">
        <a href="/">Página Principal</a>
        <a href="/en/">English Version</a>
        <a href="/es/">Versión Española</a>
        <a href="/pt/">Versão Portuguesa</a>
        <a href="/th/">เวอร์ชันภาษาไทย</a>
        <a href="/vi/">Phiên bản tiếng Việt</a>
    </div>
</body>
</html>`;

    const tempHtmlPath = path.join(__dirname, '../temp_logo_page.html');
    fs.writeFileSync(tempHtmlPath, simpleHtml, 'utf8');
    
    // Subir el HTML simple
    await client.uploadFrom(tempHtmlPath, '/logo-page.html');
    console.log('✅ Página simple con logo creada: logo-page.html');
    
    // 3. Actualizar el index.html simple que solo muestra el logo
    console.log('\n3. Actualizando index.html simplificado...');
    const simpleIndex = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Miss Star International</title>
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
            max-width: 450px;
            margin-bottom: 40px;
        }
        .title {
            font-size: 2.5rem;
            color: #D4AF37;
            margin-bottom: 50px;
        }
        .language-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin: 30px auto;
            max-width: 1200px;
        }
        .language-option {
            width: 180px;
            padding: 20px;
            background-color: rgba(30, 30, 30, 0.7);
            border: 2px solid #D4AF37;
            border-radius: 10px;
            text-align: center;
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
            width: 80px;
            height: 80px;
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
            position: absolute;
            bottom: 20px;
        }
    </style>
</head>
<body>
    <!-- Usando el logo en la raíz para máxima compatibilidad -->
    <img src="/logo.png" alt="Miss Star International" class="logo">
    
    <h1 class="title">Welcome to Miss Star International<br>A New Dynasty</h1>
    
    <div class="language-grid">
        <a href="en/" class="language-option">
            <img src="assets/images/flags/usa.png" alt="English" class="flag">
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

    const tempIndexPath = path.join(__dirname, '../temp_simple_index.html');
    fs.writeFileSync(tempIndexPath, simpleIndex, 'utf8');
    
    // Eliminar index.html actual si existe
    try {
      await client.remove('/index.html');
      console.log('✅ Index.html antiguo eliminado');
    } catch (err) {
      console.log('⚠️ No se pudo eliminar index.html (probablemente no existe)');
    }
    
    // Subir el index.html simplificado
    await client.uploadFrom(tempIndexPath, '/index.html');
    console.log('✅ Index.html simple subido');
    
    // 4. Limpiar archivos temporales
    fs.unlinkSync(tempHtmlPath);
    fs.unlinkSync(tempIndexPath);
    
    console.log('\n✅ LOGO SUBIDO A MÚLTIPLES UBICACIONES');
    console.log('Para ver el logo:');
    console.log('1. Visita https://missstarinternational.com/ (página principal)');
    console.log('2. Visita https://missstarinternational.com/logo-page.html (página de solo logo)');
    console.log('3. Acceso directo al logo: https://missstarinternational.com/logo.png');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    client.close();
  }
}

main(); 