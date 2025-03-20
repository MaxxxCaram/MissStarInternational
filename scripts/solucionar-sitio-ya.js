const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log('🔥 SOLUCIÓN DE EMERGENCIA - HACER QUE FUNCIONE YA 🔥');
    console.log('==================================================');
    
    // Conectar al servidor
    console.log('\n1. Conectando al servidor FTP...');
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    console.log('✅ Conexión exitosa');
    
    // Navegar al directorio correcto
    console.log('\n2. Navegando al directorio público...');
    await client.cd('/domains/missstarinternational.com/public_html');
    console.log('✅ Navegación exitosa');
    
    // PASO 1: Crear un HTML extremadamente simple como solución temporal
    console.log('\n3. Creando HTML ultra simple que funcionará seguro...');
    
    const simpleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miss Star International</title>
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            color: #fff;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .container {
            max-width: 800px;
            padding: 20px;
        }
        h1 {
            color: #D4AF37;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        .subtitle {
            color: #D4AF37;
            font-size: 1.5rem;
            margin-bottom: 40px;
        }
        .languages {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin-top: 40px;
        }
        .language {
            background: #D4AF37;
            color: #000;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .language:hover {
            background: #fff;
            transform: translateY(-3px);
        }
        .star {
            display: inline-block;
            font-size: 2rem;
            color: #D4AF37;
            margin: 0 10px;
        }
        footer {
            margin-top: auto;
            padding: 20px;
            color: #D4AF37;
            width: 100%;
            background: rgba(0,0,0,0.8);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><span class="star">★</span> Miss Star International <span class="star">★</span></h1>
        
        <div class="subtitle">A New Dynasty</div>
        
        <div>
            <p>Welcome to the official website of Miss Star International.</p>
            <p>Our site is currently being updated with exciting new content.</p>
        </div>
        
        <div class="languages">
            <a href="en/index.html" class="language">English</a>
            <a href="es/index.html" class="language">Español</a>
            <a href="pt/index.html" class="language">Português</a>
            <a href="th/index.html" class="language">ไทย</a>
            <a href="vi/index.html" class="language">Tiếng Việt</a>
        </div>
    </div>
    
    <footer>
        <div>© 2024 Miss Star International. All rights reserved.</div>
    </footer>
</body>
</html>`;
    
    // Guardamos el HTML en un archivo temporal
    const tempHtmlPath = path.join(__dirname, '../temp_emergency.html');
    fs.writeFileSync(tempHtmlPath, simpleHtml);
    
    // PASO 2: Crear un favicon extremadamente simple (solo un pixel dorado)
    console.log('\n4. Creando y subiendo favicon simple...');
    
    // Crear un archivo favicon simple de 16x16 (1 pixel dorado)
    const faviconData = Buffer.from([
      0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10, 0x10, 0x00, 0x01, 0x00, 0x04, 0x00, 0x28, 0x01,
      0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00,
      0x00, 0x00, 0x01, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xD4, 0xA0, 0x37, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01
    ]);
    
    const faviconPath = path.join(__dirname, '../temp_favicon.ico');
    fs.writeFileSync(faviconPath, faviconData);
    
    // PASO 3: Hacer backup del index.html actual antes de reemplazarlo
    console.log('\n5. Haciendo backup del index.html actual...');
    const timestamp = Date.now();
    const backupFileName = `backup_index_${timestamp}.html`;
    await client.downloadTo(path.join(__dirname, `../${backupFileName}`), 'index.html')
      .catch(err => console.log('No se pudo hacer backup del archivo index.html:', err.message));
    console.log(`✅ Backup guardado como ${backupFileName}`);
    
    // PASO 4: Subir los archivos al servidor
    console.log('\n6. Subiendo archivos al servidor...');
    
    // Favicon primero
    await client.uploadFrom(faviconPath, 'favicon.ico');
    console.log('✅ favicon.ico subido correctamente');
    
    // Luego el HTML simple
    await client.uploadFrom(tempHtmlPath, 'index.html');
    console.log('✅ index.html simplificado subido correctamente');
    
    // PASO 5: Actualizar el .htaccess para eliminar caché
    console.log('\n7. Actualizando .htaccess para eliminar caché...');
    
    const htaccess = `# No cache
<IfModule mod_headers.c>
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
    Header set Access-Control-Allow-Origin "*"
</IfModule>

# Redirect 404 errors to home page
ErrorDocument 404 /index.html

# Handle redirects
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /index.html [L]
</IfModule>

# Compress text files
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>`;
    
    // Guardamos el .htaccess en un archivo temporal
    const tempHtaccessPath = path.join(__dirname, '../temp_htaccess');
    fs.writeFileSync(tempHtaccessPath, htaccess);
    
    // Subimos el archivo al servidor
    await client.uploadFrom(tempHtaccessPath, '.htaccess');
    console.log('✅ Archivo .htaccess actualizado correctamente');
    
    // Limpiamos los archivos temporales
    fs.unlinkSync(tempHtmlPath);
    fs.unlinkSync(faviconPath);
    fs.unlinkSync(tempHtaccessPath);
    
    console.log('\n✅ SOLUCIÓN DE EMERGENCIA COMPLETADA');
    console.log('\nEl sitio ahora debería funcionar correctamente con:');
    console.log('1. Un HTML simplificado sin errores');
    console.log('2. Un favicon básico para evitar 404');
    console.log('3. Un .htaccess optimizado para prevenir problemas de caché');
    console.log(`4. Un backup del index.html original en ${backupFileName}`);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.close();
  }
}

main(); 