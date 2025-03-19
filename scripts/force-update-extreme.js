const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚨 ACTUALIZACIÓN EXTREMA DEL SITIO 🚨');
    console.log('===================================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });

    // 1. ESTRATEGIA: Usar nombres de archivo DIFERENTES para forzar carga
    console.log('\n1. Creando copias del logo con nombres únicos...');
    
    // Crear versiones del logo con nombres diferentes
    const logoPath = path.join(__dirname, '../assets/images/logo/logo-main1.png');
    const uniqueTimestamp = Date.now();
    
    // Logo con nombre único (forzará al navegador a cargar nuevo recurso)
    const newLogoName = `logo-main-${uniqueTimestamp}.png`;
    await client.uploadFrom(logoPath, `/assets/images/logo/${newLogoName}`);
    console.log(`✅ Logo subido como: ${newLogoName}`);
    
    // 2. ESTRATEGIA: Modificar index.html para usar el nuevo logo
    console.log('\n2. Modificando index.html con referencias al nuevo logo...');
    const tempFile = path.join(__dirname, '../temp_index_extreme.html');
    
    // HTML con fuertes medidas anti-caché y referencia al nuevo logo
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Anti-caché extremo -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <!-- Para navegadores modernos -->
    <meta http-equiv="Surrogate-Control" content="no-store">
    <meta http-equiv="Cache-directive" content="no-cache">
    <meta http-equiv="Cache" content="no-cache">
    
    <title>Miss Star International - Welcome (${uniqueTimestamp})</title>
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
    <!-- Script para forzar recarga -->
    <script>
        // Evitar caché de navegador
        window.onload = function() {
            // Forzar carga de imágenes
            const images = document.getElementsByTagName('img');
            for (let i = 0; i < images.length; i++) {
                const originalSrc = images[i].src;
                images[i].src = '';
                images[i].src = originalSrc + '?nocache=' + Date.now();
            }
        }
    </script>
</head>
<body>
    <!-- Usando el nuevo nombre de logo para evitar caché -->
    <img src="assets/images/logo/${newLogoName}" alt="Miss Star International" class="logo">
    
    <h1 class="title">Welcome to Miss Star International<br>A New Dynasty</h1>
    
    <div class="language-grid">
        <a href="en/" class="language-option">
            <img src="assets/images/flags/usa.png?v=${uniqueTimestamp}" alt="English" class="flag">
            <span class="language-name">English</span>
        </a>
        
        <a href="es/" class="language-option">
            <img src="assets/images/flags/spain.png?v=${uniqueTimestamp}" alt="Español" class="flag">
            <span class="language-name">Español</span>
        </a>
        
        <a href="pt/" class="language-option">
            <img src="assets/images/flags/portugal.png?v=${uniqueTimestamp}" alt="Português" class="flag">
            <span class="language-name">Português</span>
        </a>
        
        <a href="th/" class="language-option">
            <img src="assets/images/flags/thailand.png?v=${uniqueTimestamp}" alt="ไทย" class="flag">
            <span class="language-name">ไทย</span>
        </a>
        
        <a href="vi/" class="language-option">
            <img src="assets/images/flags/vietnam.png?v=${uniqueTimestamp}" alt="Tiếng Việt" class="flag">
            <span class="language-name">Tiếng Việt</span>
        </a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved. (${new Date().toISOString()})
    </footer>
</body>
</html>`;

    fs.writeFileSync(tempFile, htmlContent, 'utf8');
    
    // 3. ESTRATEGIA: Eliminar archivos existentes antes de subir nuevos
    console.log('\n3. Eliminando index.html actual para forzar actualización completa...');
    try {
      await client.remove('/index.html');
      console.log('✅ Index.html antiguo eliminado');
    } catch (err) {
      console.log('⚠️ No se pudo eliminar index.html (probablemente no existe)');
    }
    
    // Subir nuevo index.html
    console.log('\n4. Subiendo nuevo index.html con referencia al logo actualizado...');
    await client.uploadFrom(tempFile, '/index.html');
    console.log('✅ Nuevo index.html subido');
    
    // 5. ESTRATEGIA: Crear un archivo PHP especial para mostrar el estado actual
    console.log('\n5. Creando verificador de estado...');
    const statusContent = `<?php
// Evitar cualquier caché
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: Thu, 01 Jan 1970 00:00:00 GMT");

// Función para verificar si un archivo existe
function file_exists_on_server($file) {
    $headers = @get_headers($file);
    return is_array($headers) ? 
        (strpos($headers[0], '200') !== false ? true : false) : false;
}

// Convertir caracteres especiales
function h($text) {
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

// URL base
$baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";

// Verificar archivos críticos
$files = [
    "index.html" => "$baseUrl/index.html",
    "logo original" => "$baseUrl/assets/images/logo/logo-main1.png",
    "logo nuevo" => "$baseUrl/assets/images/logo/logo-main-${uniqueTimestamp}.png",
    ".htaccess" => "$baseUrl/.htaccess" // No es accesible directamente pero lo incluimos
];

echo '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estado del Sitio Miss Star International</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: #f5f5f5;
        }
        h1 { color: #333; }
        table { 
            border-collapse: collapse; 
            width: 100%; 
            margin-top: 20px;
        }
        th, td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #ddd; 
        }
        th { background-color: #f2f2f2; }
        .success { color: green; }
        .error { color: red; }
        img { max-width: 300px; border: 1px solid #ddd; margin: 10px 0; }
        .timestamp { 
            color: #666; 
            font-size: 0.8em; 
            margin-top: 30px; 
        }
        .btn {
            display: inline-block;
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
        }
        .logo-preview {
            margin-top: 30px;
            padding: 20px;
            background: white;
            border: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <h1>Estado del Sitio Miss Star International</h1>
    <p>Esta página verifica el estado actual de los archivos críticos.</p>
    
    <table>
        <tr>
            <th>Archivo</th>
            <th>URL</th>
            <th>Estado</th>
        </tr>';

foreach ($files as $name => $url) {
    $exists = file_exists_on_server($url);
    $status_class = $exists ? 'success' : 'error';
    $status_text = $exists ? 'Disponible' : 'No encontrado';
    
    echo "<tr>
            <td>" . h($name) . "</td>
            <td><a href='" . h($url) . "' target='_blank'>" . h($url) . "</a></td>
            <td class='$status_class'>$status_text</td>
          </tr>";
}

echo '</table>

    <div class="logo-preview">
        <h2>Vista previa del logo actual:</h2>
        <img src="assets/images/logo/logo-main-' . $uniqueTimestamp . '.png?' . time() . '" alt="Logo actual">
    </div>
    
    <a href="index.html?force=' . time() . '" class="btn">Ver página principal (forzar recarga)</a>
    
    <p class="timestamp">Generado el: ' . date('Y-m-d H:i:s') . '</p>
</body>
</html>';
?>`;

    const statusPath = path.join(__dirname, '../temp_status.php');
    fs.writeFileSync(statusPath, statusContent, 'utf8');
    await client.uploadFrom(statusPath, '/status.php');
    console.log('✅ Verificador de estado creado');
    
    // 6. Actualizar links canónicos para evitar problemas con CDN
    console.log('\n6. Creando manifest.json para control de recursos...');
    const manifestContent = `{
  "name": "Miss Star International",
  "short_name": "MissStar",
  "version": "${uniqueTimestamp}",
  "resources": {
    "logo": "/assets/images/logo/${newLogoName}",
    "original_logo": "/assets/images/logo/logo-main1.png"
  },
  "cache_timestamp": "${new Date().toISOString()}"
}`;
    
    const manifestPath = path.join(__dirname, '../temp_manifest.json');
    fs.writeFileSync(manifestPath, manifestContent, 'utf8');
    await client.uploadFrom(manifestPath, '/manifest.json');
    console.log('✅ Manifest creado para control de recursos');
    
    // 7. Limpiar archivos temporales
    fs.unlinkSync(tempFile);
    fs.unlinkSync(statusPath);
    fs.unlinkSync(manifestPath);
    
    console.log('\n✅ ACTUALIZACIÓN EXTREMA COMPLETADA');
    console.log('Para ver los cambios:');
    console.log(`1. Visita https://missstarinternational.com/status.php (verifica el estado del sitio)`);
    console.log(`2. Visita https://missstarinternational.com/?nocache=${uniqueTimestamp} (fuerza recarga)`);
    console.log(`3. El nuevo logo está en: /assets/images/logo/${newLogoName}`);
  } catch (err) {
    console.error('Error durante la actualización extrema:', err);
  } finally {
    client.close();
  }
}

main(); 