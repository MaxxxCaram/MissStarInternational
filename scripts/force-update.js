const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🔄 FORZANDO ACTUALIZACIÓN DEL SITIO (MODO EMERGENCIA)');
    console.log('===================================================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });

    // 1. Modificar temporalmente el index.html para forzar la actualización
    console.log('\n1. Modificando index.html para forzar actualización...');
    const tempFile = path.join(__dirname, '../temp_force_update.html');
    
    // Crear contenido con timestamp para forzar cambio
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
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
        /* Forzar actualización de caché: ${new Date().toISOString()} */
    </style>
</head>
<body>
    <img src="assets/images/logo/logo-main1.png?v=${new Date().getTime()}" alt="Miss Star International" class="logo">
    
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

    // Guardar el archivo
    fs.writeFileSync(tempFile, htmlContent, 'utf8');
    
    // Subir el archivo modificado
    await client.uploadFrom(tempFile, '/index.html');
    console.log('✅ Página principal actualizada con anti-caché');
    
    // 2. Asegurarse de que el logo está accesible
    console.log('\n2. Verificando el archivo de logo principal...');
    const logoPath = path.join(__dirname, '../assets/images/logo/logo-main1.png');
    
    // Generar un nombre de archivo con timestamp para forzar la actualización
    const logoDestination = `/assets/images/logo/logo-main1.png?v=${new Date().getTime()}`;
    await client.uploadFrom(logoPath, logoDestination.split('?')[0]); // Eliminar el parámetro al subir
    console.log(`✅ Logo principal subido nuevamente`);
    
    // 3. Revisar/actualizar el .htaccess para evitar caché
    console.log('\n3. Creando/actualizando .htaccess para control de caché...');
    const htaccessContent = `# Evitar problemas de dominio
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Configuración de caché
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Imágenes
  ExpiresByType image/jpeg "access plus 1 hour"
  ExpiresByType image/gif "access plus 1 hour"
  ExpiresByType image/png "access plus 1 hour"
  ExpiresByType image/svg+xml "access plus 1 hour"
  
  # HTML
  ExpiresByType text/html "access plus 0 seconds"
  
  # CSS y JavaScript
  ExpiresByType text/css "access plus 1 hour"
  ExpiresByType application/javascript "access plus 1 hour"
</IfModule>

# Headers de caché
<IfModule mod_headers.c>
  # Para HTML, no cachear
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
  </FilesMatch>
  
  # Para imágenes, permitir caché pero verificar frecuentemente
  <FilesMatch "\\.(jpg|jpeg|png|gif|ico)$">
    Header set Cache-Control "max-age=3600, public, must-revalidate"
  </FilesMatch>
</IfModule>

# Activar compresión
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>
`;
    
    const htaccessPath = path.join(__dirname, '../temp_htaccess');
    fs.writeFileSync(htaccessPath, htaccessContent, 'utf8');
    await client.uploadFrom(htaccessPath, '/.htaccess');
    console.log('✅ Archivo .htaccess actualizado para controlar caché');
    
    // 4. Crear un archivo de purga de caché
    console.log('\n4. Creando archivo de purga de caché...');
    const purgeContent = `<?php
// Establecer headers para evitar caché
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Timestamp para forzar recarga
$timestamp = time();

// Redirigir a la página principal con parámetro de caché
header("Location: /index.html?nocache=" . $timestamp);
exit();
?>`;
    
    const purgePath = path.join(__dirname, '../temp_purge.php');
    fs.writeFileSync(purgePath, purgeContent, 'utf8');
    await client.uploadFrom(purgePath, '/purge.php');
    console.log('✅ Archivo purge.php creado para forzar recarga');
    
    // 5. Limpiar archivos temporales
    fs.unlinkSync(tempFile);
    fs.unlinkSync(htaccessPath);
    fs.unlinkSync(purgePath);
    
    console.log('\n✅ SITIO ACTUALIZADO EN MODO EMERGENCIA');
    console.log('Para ver los cambios inmediatamente:');
    console.log('1. Visita https://missstarinternational.com/purge.php');
    console.log('2. O presiona Ctrl+F5 en tu navegador mientras estás en la página principal');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    client.close();
  }
}

main(); 