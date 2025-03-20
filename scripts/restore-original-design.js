const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log('🔄 RESTAURANDO DISEÑO ORIGINAL CON CORRECCIONES TÉCNICAS 🔄');
    console.log('======================================================');
    
    // Conectar al servidor
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    
    console.log('\n1. Navegando al directorio público...');
    await client.cd('/domains/missstarinternational.com/public_html');
    console.log('✅ Navegación exitosa');
    
    // PASO 1: Subir favicon.ico para evitar errores 404
    console.log('\n2. Subiendo favicon.ico...');
    
    // Crear un favicon simple (1x1 pixel transparente)
    const faviconData = Buffer.from([
      0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x18, 0x00, 0x0A, 0x00,
      0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 
      0x00, 0x00, 0x01, 0x00, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
      0x00, 0x00
    ]);
    
    const faviconPath = path.join(__dirname, '../temp_favicon.ico');
    fs.writeFileSync(faviconPath, faviconData);
    
    await client.uploadFrom(faviconPath, 'favicon.ico');
    console.log('✅ favicon.ico subido correctamente');
    
    // Limpiar archivo temporal
    fs.unlinkSync(faviconPath);
    
    // PASO 2: Subir el logo original
    console.log('\n3. Subiendo logo original...');
    
    const logoPath = path.join(__dirname, '../assets/images/logo/logo-main1.png');
    await client.uploadFrom(logoPath, 'logo.png');
    console.log('✅ Logo original subido correctamente');
    
    // PASO 3: Restaurar el index.html original con mínimas correcciones
    console.log('\n4. Restaurando index.html original con correcciones técnicas...');
    
    const originalIndexHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miss Star International - Welcome | Bienvenidos | Bem-vindos | ยินดีต้อนรับ | Chào mừng</title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Cinzel:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            color: #fff;
            background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
                        #000000;
        }

        .container {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            text-align: center;
        }

        .logo {
            max-width: 300px;
            margin-bottom: 40px;
            animation: glow 2s infinite alternate;
        }

        @keyframes glow {
            from {
                filter: drop-shadow(0 0 2px #D4AF37);
            }
            to {
                filter: drop-shadow(0 0 10px #D4AF37);
            }
        }

        .welcome-text {
            font-family: 'Cinzel', serif;
            font-size: 2em;
            margin-bottom: 40px;
            color: #D4AF37;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .language-select {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            max-width: 1200px;
            margin: 0 auto;
        }

        .language-option {
            text-decoration: none;
            color: #fff;
            transition: all 0.3s ease;
            text-align: center;
            background: rgba(0,0,0,0.6);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #D4AF37;
            width: 150px;
        }

        .language-option:hover {
            transform: translateY(-5px);
            background: rgba(212, 175, 55, 0.1);
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
        }

        .flag {
            width: 100px;
            height: 70px;
            border-radius: 5px;
            margin-bottom: 10px;
            box-shadow: 0 0 10px rgba(255,255,255,0.2);
        }

        .language-name {
            font-size: 1.2em;
            margin-top: 10px;
        }

        footer {
            text-align: center;
            padding: 20px;
            background: rgba(0,0,0,0.8);
            color: #D4AF37;
        }

        @media (max-width: 768px) {
            .language-select {
                gap: 15px;
            }

            .language-option {
                width: 130px;
            }

            .flag {
                width: 80px;
                height: 56px;
            }

            .welcome-text {
                font-size: 1.5em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="logo.png" alt="Miss Star International Logo" class="logo">
        
        <div class="welcome-text">
            Welcome to Miss Star International<br>
            A New Dynasty
        </div>
        
        <div class="language-select">
            <a href="en/index.html" class="language-option">
                <span style="font-size: 50px;">🇺🇸</span>
                <div class="language-name">English</div>
            </a>
            
            <a href="es/index.html" class="language-option">
                <span style="font-size: 50px;">🇪🇸</span>
                <div class="language-name">Español</div>
            </a>

            <a href="pt/index.html" class="language-option">
                <span style="font-size: 50px;">🇵🇹</span>
                <div class="language-name">Português</div>
            </a>

            <a href="th/index.html" class="language-option">
                <span style="font-size: 50px;">🇹🇭</span>
                <div class="language-name">ไทย</div>
            </a>

            <a href="vi/index.html" class="language-option">
                <span style="font-size: 50px;">🇻🇳</span>
                <div class="language-name">Tiếng Việt</div>
            </a>
        </div>
    </div>

    <footer>
        <div>© 2024 Miss Star International. All rights reserved.</div>
    </footer>
</body>
</html>`;
    
    const tempIndexPath = path.join(__dirname, '../temp_original_index.html');
    fs.writeFileSync(tempIndexPath, originalIndexHtml);
    
    await client.uploadFrom(tempIndexPath, 'index.html');
    console.log('✅ index.html original restaurado');
    
    fs.unlinkSync(tempIndexPath);
    
    // PASO 4: Crear archivos de redirección para carpetas de idioma
    console.log('\n5. Configurando carpetas de idioma...');
    
    const languageDirs = ['en', 'es', 'pt', 'th', 'vi'];
    
    for (const lang of languageDirs) {
      console.log(`Configurando carpeta ${lang}...`);
      
      try {
        // Asegurar que existe la carpeta
        await client.ensureDir(lang);
        
        // Crear una página de idioma con el diseño original
        const langPage = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <title>Miss Star International</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            font-family: 'Arial', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            color: #fff;
            background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
                        #000000;
            text-align: center;
        }

        .container {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
        }

        .logo {
            max-width: 250px;
            margin-bottom: 40px;
        }

        h1 {
            color: #D4AF37;
            font-size: 2.5em;
            margin-bottom: 20px;
        }

        .coming-soon {
            border: 1px solid #D4AF37;
            padding: 20px;
            border-radius: 10px;
            background: rgba(0,0,0,0.6);
            margin: 30px 0;
            max-width: 600px;
        }

        .back-button {
            margin-top: 30px;
            display: inline-block;
            color: #D4AF37;
            text-decoration: none;
            border: 1px solid #D4AF37;
            padding: 10px 20px;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        .back-button:hover {
            background-color: rgba(212, 175, 55, 0.2);
        }

        footer {
            padding: 20px;
            background: rgba(0,0,0,0.8);
            color: #D4AF37;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="/logo.png" alt="Miss Star International Logo" class="logo">
        
        <h1>Miss Star International</h1>
        
        <div class="coming-soon">
            <p>This page is currently under construction.</p>
            <p>Thank you for your patience.</p>
        </div>
        
        <a href="/" class="back-button">← Back to Home</a>
    </div>

    <footer>
        <div>© 2024 Miss Star International. All rights reserved.</div>
    </footer>
</body>
</html>`;
        
        const tempLangPath = path.join(__dirname, `../temp_${lang}_page.html`);
        fs.writeFileSync(tempLangPath, langPage);
        
        await client.uploadFrom(tempLangPath, `${lang}/index.html`);
        console.log(`✅ Página para ${lang} restaurada`);
        
        fs.unlinkSync(tempLangPath);
      } catch (err) {
        console.error(`❌ Error al configurar carpeta ${lang}:`, err);
      }
    }
    
    // PASO 5: Configurar .htaccess para manejar problemas de caché y 404
    console.log('\n6. Configurando .htaccess para mejorar rendimiento...');
    
    const htaccess = `# Disable caching for HTML files only
<FilesMatch "\.(html|htm|php)$">
    <IfModule mod_headers.c>
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires 0
    </IfModule>
</FilesMatch>

# Cache static assets for a year
<FilesMatch "\.(ico|jpg|jpeg|png|gif|svg|css|js)$">
    <IfModule mod_headers.c>
        Header set Cache-Control "max-age=31536000, public"
    </IfModule>
</FilesMatch>

# Enable CORS
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>

# Favicon handler
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # If favicon.ico is not found in a directory, use the one in the root
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^favicon\.ico$ /favicon.ico [L]
</IfModule>

# Prevent directory listing
Options -Indexes

# Set default charset
AddDefaultCharset UTF-8

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>`;
    
    const tempHtaccessPath = path.join(__dirname, '../temp_htaccess');
    fs.writeFileSync(tempHtaccessPath, htaccess);
    
    await client.uploadFrom(tempHtaccessPath, '.htaccess');
    console.log('✅ .htaccess configurado para mejor rendimiento');
    
    fs.unlinkSync(tempHtaccessPath);
    
    console.log('\n🎉 ¡RESTAURACIÓN COMPLETA! 🎉');
    console.log('El sitio ha sido restaurado a su diseño original.');
    console.log('Se han realizado las siguientes mejoras técnicas:');
    console.log('1. Favicon añadido para evitar errores 404');
    console.log('2. Configuración de caché optimizada');
    console.log('3. Páginas de idioma restauradas');
    console.log('\nVisita https://missstarinternational.com/ para verificar.');
    
  } catch (err) {
    console.error('❌ Error durante la restauración:', err);
  } finally {
    client.close();
  }
}

main().catch(console.error); 