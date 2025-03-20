const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚨 REPARACIÓN DE EMERGENCIA - LOGO Y PÁGINA PRINCIPAL 🚨');
    console.log('===================================================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    
    // Navigate to the correct directory
    console.log('\n1. Navegando al directorio public_html...');
    await client.cd('/domains/missstarinternational.com/public_html');
    console.log('✅ Navegación exitosa a public_html');
    
    // Create a completely new index.html (no logo dependency)
    console.log('\n2. Creando una página principal completamente nueva...');
    
    const emergencyHtml = `<!DOCTYPE html>
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
        .title {
            font-size: 3.2rem;
            color: #D4AF37;
            margin-bottom: 20px;
            text-align: center;
        }
        .subtitle {
            font-size: 1.6rem;
            color: #D4AF37;
            margin-bottom: 50px;
        }
        .languages {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            max-width: 800px;
            gap: 30px;
            margin: 30px 0;
        }
        .lang-button {
            display: inline-block;
            padding: 15px 25px;
            background-color: rgba(30, 30, 30, 0.7);
            border: 2px solid #D4AF37;
            border-radius: 10px;
            color: #D4AF37;
            text-decoration: none;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            min-width: 120px;
        }
        .lang-button:hover {
            background-color: rgba(50, 50, 50, 0.7);
            transform: scale(1.05);
        }
        .flag-icon {
            font-size: 24px;
            margin-right: 10px;
        }
        footer {
            margin-top: 50px;
            color: #888;
            font-size: 0.9rem;
            position: absolute;
            bottom: 20px;
        }
        .star {
            color: #D4AF37;
            font-size: 32px;
            display: inline-block;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <h1 class="title">
        <span class="star">★</span> 
        Miss Star International 
        <span class="star">★</span>
    </h1>
    <h2 class="subtitle">A New Dynasty</h2>
    
    <p>Select your language / Seleccione su idioma:</p>
    
    <div class="languages">
        <a href="en/" class="lang-button">
            <span class="flag-icon">🇺🇸</span> English
        </a>
        
        <a href="es/" class="lang-button">
            <span class="flag-icon">🇪🇸</span> Español
        </a>
        
        <a href="pt/" class="lang-button">
            <span class="flag-icon">🇵🇹</span> Português
        </a>
        
        <a href="th/" class="lang-button">
            <span class="flag-icon">🇹🇭</span> ไทย
        </a>
        
        <a href="vi/" class="lang-button">
            <span class="flag-icon">🇻🇳</span> Tiếng Việt
        </a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
</body>
</html>`;
    
    const tempIndexPath = path.join(__dirname, '../temp_emergency_index.html');
    fs.writeFileSync(tempIndexPath, emergencyHtml);
    
    // Upload the new index.html
    await client.uploadFrom(tempIndexPath, 'index.html');
    console.log('✅ Nueva página principal subida (sin dependencia de logo)');
    
    // Also fix the English page to have proper content
    console.log('\n3. Creando página en inglés temporal...');
    
    const enHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miss Star International - English</title>
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
        .title {
            font-size: 3rem;
            color: #D4AF37;
            margin-bottom: 30px;
        }
        .subtitle {
            font-size: 1.8rem;
            color: #D4AF37;
            margin-bottom: 40px;
        }
        .content {
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
        }
        .coming-soon {
            font-size: 1.5rem;
            margin: 40px 0;
            padding: 20px;
            border: 2px solid #D4AF37;
            border-radius: 10px;
            background-color: rgba(30, 30, 30, 0.7);
            display: inline-block;
        }
        .back-link {
            display: inline-block;
            margin-top: 40px;
            color: #D4AF37;
            text-decoration: none;
            border: 1px solid #D4AF37;
            padding: 10px 20px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        .back-link:hover {
            background-color: rgba(212, 175, 55, 0.2);
            transform: scale(1.05);
        }
        .star {
            color: #D4AF37;
            font-size: 28px;
            display: inline-block;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <h1 class="title">
        <span class="star">★</span> 
        Miss Star International 
        <span class="star">★</span>
    </h1>
    <h2 class="subtitle">A New Dynasty</h2>
    
    <div class="content">
        <p>Welcome to the official website of Miss Star International.</p>
        
        <div class="coming-soon">
            <p>We are currently redesigning our website.</p>
            <p>The new and improved site will be available soon!</p>
        </div>
        
        <p>Thank you for your patience and continued support.</p>
        
        <a href="/" class="back-link">← Back to Language Selection</a>
    </div>
</body>
</html>`;
    
    const tempEnPath = path.join(__dirname, '../temp_en_page.html');
    fs.writeFileSync(tempEnPath, enHtml);
    
    // Make sure the en directory exists
    try {
      await client.ensureDir('en');
    } catch (err) {
      // Ignore errors
    }
    
    // Upload the English page
    await client.uploadFrom(tempEnPath, 'en/index.html');
    console.log('✅ Página en inglés mejorada');
    
    // Clean up temporary files
    fs.unlinkSync(tempIndexPath);
    fs.unlinkSync(tempEnPath);
    
    console.log('\n✅ REPARACIÓN DE EMERGENCIA COMPLETADA');
    console.log('La página principal ahora funciona sin depender de ninguna imagen.');
    console.log('La página en inglés ha sido mejorada con un diseño adecuado.');
    console.log('Visita: https://missstarinternational.com/');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.close();
  }
}

main(); 