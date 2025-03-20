const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚨 ACTUALIZANDO INDEX.HTML CON ÍCONOS DE IDIOMA 🚨');
    console.log('===============================================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    
    // Navigate to the correct directory
    console.log('\n1. Navegando al directorio public_html...');
    try {
      await client.cd('/domains/missstarinternational.com/public_html');
      console.log('✅ Navegación exitosa a public_html');
    } catch (err) {
      console.error('❌ No se pudo navegar a public_html:', err.message);
      return;
    }
    
    // Download the current index.html
    console.log('\n2. Descargando index.html actual...');
    const tempIndexPath = path.join(__dirname, '../temp_index_icons.html');
    
    try {
      await client.downloadTo(tempIndexPath, 'index.html');
      console.log('✅ Index.html descargado correctamente');
    } catch (err) {
      console.error('❌ No se pudo descargar index.html:', err.message);
      return;
    }
    
    // Create an index.html with Unicode flag icons instead of images
    console.log('\n3. Creando versión con íconos Unicode...');
    
    const iconHtml = `<!DOCTYPE html>
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
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .logo {
            max-width: 90%;
            width: 400px;
            margin-bottom: 40px;
        }
        .title {
            font-size: 2.2rem;
            color: #D4AF37;
            margin-bottom: 30px;
        }
        .languages {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            max-width: 800px;
            gap: 30px;
            margin: 40px 0;
        }
        .lang-option {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #D4AF37;
            text-decoration: none;
            transition: all 0.3s ease;
            width: 120px;
        }
        .lang-option:hover {
            transform: scale(1.05);
        }
        .flag-icon {
            font-size: 40px;
            margin-bottom: 10px;
        }
        .lang-name {
            font-size: 1.2rem;
            margin-top: 5px;
        }
        footer {
            margin-top: 50px;
            color: #888;
            font-size: 0.9rem;
        }
        .gold-button {
            display: inline-block;
            padding: 15px 25px;
            margin: 10px;
            background-color: rgba(30, 30, 30, 0.7);
            border: 2px solid #D4AF37;
            border-radius: 10px;
            color: #D4AF37;
            text-decoration: none;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        .gold-button:hover {
            background-color: rgba(50, 50, 50, 0.7);
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <img src="logo.png" alt="Miss Star International" class="logo">
    
    <h1 class="title">Welcome to Miss Star International</h1>
    
    <p>Select your language / Seleccione su idioma:</p>
    
    <div class="languages">
        <a href="en/" class="lang-option">
            <span class="flag-icon">🇺🇸</span>
            <span class="lang-name">English</span>
        </a>
        
        <a href="es/" class="lang-option">
            <span class="flag-icon">🇪🇸</span>
            <span class="lang-name">Español</span>
        </a>
        
        <a href="pt/" class="lang-option">
            <span class="flag-icon">🇵🇹</span>
            <span class="lang-name">Português</span>
        </a>
        
        <a href="th/" class="lang-option">
            <span class="flag-icon">🇹🇭</span>
            <span class="lang-name">ไทย</span>
        </a>
        
        <a href="vi/" class="lang-option">
            <span class="flag-icon">🇻🇳</span>
            <span class="lang-name">Tiếng Việt</span>
        </a>
    </div>
    
    <div>
        <a href="en/" class="gold-button">Enter / Entrar →</a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
</body>
</html>`;
    
    // Write the new content to the temp file
    fs.writeFileSync(tempIndexPath, iconHtml);
    
    // Upload the modified file
    console.log('\n4. Subiendo el archivo modificado...');
    
    try {
      await client.uploadFrom(tempIndexPath, 'index.html');
      console.log('✅ Index.html subido correctamente');
    } catch (err) {
      console.error('❌ No se pudo subir index.html:', err.message);
      return;
    }
    
    // Clean up
    fs.unlinkSync(tempIndexPath);
    
    console.log('\n✅ INDEX.HTML ACTUALIZADO CON ÍCONOS DE BANDERA');
    console.log('El sitio web ahora usa emojis de banderas Unicode en lugar de imágenes.');
    console.log('Visita: https://missstarinternational.com/');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    client.close();
  }
}

main(); 