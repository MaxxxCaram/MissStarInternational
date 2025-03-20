const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚨 RESTAURANDO TODAS LAS PÁGINAS DE IDIOMAS 🚨');
    console.log('===========================================');
    
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
    
    // Create a better home page
    console.log('\n2. Creando una página principal mejorada...');
    
    const indexHtml = `<!DOCTYPE html>
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
        <a href="/en/index.html" class="lang-button">
            <span class="flag-icon">🇺🇸</span> English
        </a>
        
        <a href="/es/index.html" class="lang-button">
            <span class="flag-icon">🇪🇸</span> Español
        </a>
        
        <a href="/pt/index.html" class="lang-button">
            <span class="flag-icon">🇵🇹</span> Português
        </a>
        
        <a href="/th/index.html" class="lang-button">
            <span class="flag-icon">🇹🇭</span> ไทย
        </a>
        
        <a href="/vi/index.html" class="lang-button">
            <span class="flag-icon">🇻🇳</span> Tiếng Việt
        </a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
</body>
</html>`;
    
    const tempIndexPath = path.join(__dirname, '../temp_index.html');
    fs.writeFileSync(tempIndexPath, indexHtml);
    
    // Upload the improved index.html
    await client.uploadFrom(tempIndexPath, 'index.html');
    console.log('✅ Página principal mejorada');
    
    // Create a template for all language pages
    console.log('\n3. Creando páginas para todos los idiomas...');
    
    const languages = [
      { code: 'en', name: 'English', title: 'Welcome', message: 'Welcome to Miss Star International', back: 'Back to Language Selection' },
      { code: 'es', name: 'Español', title: 'Bienvenidos', message: 'Bienvenidos a Miss Star International', back: 'Volver a Selección de Idioma' },
      { code: 'pt', name: 'Português', title: 'Bem-vindos', message: 'Bem-vindos ao Miss Star International', back: 'Voltar para Seleção de Idioma' },
      { code: 'th', name: 'ไทย', title: 'ยินดีต้อนรับ', message: 'ยินดีต้อนรับสู่ Miss Star International', back: 'กลับไปที่การเลือกภาษา' },
      { code: 'vi', name: 'Tiếng Việt', title: 'Chào mừng', message: 'Chào mừng đến với Miss Star International', back: 'Quay lại Lựa chọn Ngôn ngữ' }
    ];
    
    for (const lang of languages) {
      const langTemplate = `<!DOCTYPE html>
<html lang="${lang.code}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miss Star International - ${lang.name}</title>
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
    <h2 class="subtitle">${lang.title}</h2>
    
    <div class="content">
        <p>${lang.message}</p>
        
        <div class="coming-soon">
            <p>We are currently redesigning our website.</p>
            <p>The new and improved site will be available soon!</p>
        </div>
        
        <p>Thank you for your patience and continued support.</p>
        
        <a href="/" class="back-link">← ${lang.back}</a>
    </div>
</body>
</html>`;
      
      // Check if the language directory exists, if not create it
      try {
        await client.cd(`/${lang.code}`);
        console.log(`✅ Directorio ${lang.code} ya existe`);
        // Go back to the root
        await client.cd('/domains/missstarinternational.com/public_html');
      } catch (err) {
        // Go back to the root first
        try {
          await client.cd('/domains/missstarinternational.com/public_html');
        } catch (cdErr) {
          // Ignore, we're probably already there
        }
        
        console.log(`⚠️ Creando directorio ${lang.code}...`);
        try {
          await client.mkdir(lang.code);
          console.log(`✅ Directorio ${lang.code} creado`);
        } catch (mkdirErr) {
          console.error(`❌ No se pudo crear directorio ${lang.code}:`, mkdirErr.message);
          continue;
        }
      }
      
      // Save the template and upload it
      const tempLangPath = path.join(__dirname, `../temp_${lang.code}.html`);
      fs.writeFileSync(tempLangPath, langTemplate);
      
      // Upload index.html for each language
      try {
        console.log(`Subiendo página para ${lang.name}...`);
        await client.uploadFrom(tempLangPath, `${lang.code}/index.html`);
        console.log(`✅ Página ${lang.code} subida`);
      } catch (uploadErr) {
        console.error(`❌ Error al subir ${lang.code}/index.html:`, uploadErr.message);
        
        // Try direct upload
        console.log(`⚠️ Intentando upload directo a ${lang.code}/index.html...`);
        try {
          // Reconnect if necessary
          if (!client.closed) {
            await client.access({
              host: 'web0151.zxcs.nl',
              user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
              password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
              secure: false
            });
            await client.cd('/domains/missstarinternational.com/public_html');
          }
          
          // Try one more time
          await client.uploadFrom(tempLangPath, `${lang.code}/index.html`);
          console.log(`✅ Página ${lang.code} subida (segundo intento)`);
        } catch (retryErr) {
          console.error(`❌ Error persistente al subir ${lang.code}/index.html`);
        }
      }
      
      // Clean up temp file
      fs.unlinkSync(tempLangPath);
    }
    
    // Clean up main index temp file
    fs.unlinkSync(tempIndexPath);
    
    console.log('\n✅ RESTAURACIÓN COMPLETADA');
    console.log('Se han creado o actualizado todas las páginas de idiomas.');
    console.log('Visita: https://missstarinternational.com/');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    client.close();
  }
}

main(); 