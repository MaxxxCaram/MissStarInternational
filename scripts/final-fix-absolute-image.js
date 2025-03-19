const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚨 SOLUCIÓN DEFINITIVA - URL ABSOLUTA 🚨');
    console.log('========================================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });

    // Usar URL absoluta a una imagen confiable y siempre disponible
    // Esta es la URL de una imagen de ejemplo subida a ImgBB
    const logoUrl = 'https://imgur.com/kgK4DyW.png';  // Logo Miss Star International
    
    // Crear un HTML que use la URL absoluta
    console.log('\n1. Creando index.html con URL absoluta de imagen...');
    const absoluteUrlHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- No caché -->
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
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .logo {
            max-width: 450px;
            width: 90%;
            margin-bottom: 40px;
        }
        .title {
            font-size: 2.5rem;
            color: #D4AF37;
            margin-bottom: 50px;
            padding: 0 20px;
        }
        .language-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin: 30px auto;
            max-width: 1200px;
            padding: 0 20px;
        }
        .language-option {
            width: 160px;
            padding: 15px;
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
            object-fit: cover;
        }
        .language-name {
            font-size: 1.2rem;
        }
        footer {
            margin-top: 50px;
            color: #888;
            font-size: 0.9rem;
            padding: 20px;
            text-align: center;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .title {
                font-size: 2rem;
            }
            .language-option {
                width: 140px;
            }
        }
        
        @media (max-width: 480px) {
            .language-grid {
                gap: 10px;
            }
            .language-option {
                width: 120px;
                padding: 10px;
            }
            .flag {
                width: 60px;
                height: 60px;
            }
            .language-name {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <!-- Usando URL absoluta para el logo -->
    <img src="${logoUrl}" alt="Miss Star International" class="logo">
    
    <h1 class="title">Welcome to Miss Star International<br>A New Dynasty</h1>
    
    <div class="language-grid">
        <a href="en/" class="language-option">
            <img src="https://imgur.com/PkPcgOE.png" alt="English" class="flag">
            <span class="language-name">English</span>
        </a>
        
        <a href="es/" class="language-option">
            <img src="https://imgur.com/mUPzWMq.png" alt="Español" class="flag">
            <span class="language-name">Español</span>
        </a>
        
        <a href="pt/" class="language-option">
            <img src="https://imgur.com/UiykDBI.png" alt="Português" class="flag">
            <span class="language-name">Português</span>
        </a>
        
        <a href="th/" class="language-option">
            <img src="https://imgur.com/OXXfmfR.png" alt="ไทย" class="flag">
            <span class="language-name">ไทย</span>
        </a>
        
        <a href="vi/" class="language-option">
            <img src="https://imgur.com/3ItCKJA.png" alt="Tiếng Việt" class="flag">
            <span class="language-name">Tiếng Việt</span>
        </a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.<br>
        <small>Timestamp: ${new Date().toISOString()}</small>
    </footer>
</body>
</html>`;

    const tempFilePath = path.join(__dirname, '../temp_absolute_index.html');
    fs.writeFileSync(tempFilePath, absoluteUrlHtml, 'utf8');
    
    // Eliminar y subir el nuevo index.html
    console.log('\n2. Eliminando y subiendo nuevo index.html...');
    try {
      await client.remove('/index.html');
      console.log('✅ Index.html antiguo eliminado');
    } catch (err) {
      console.log('⚠️ No se pudo eliminar index.html (probablemente no existe)');
    }
    
    await client.uploadFrom(tempFilePath, '/index.html');
    console.log('✅ Nuevo index.html con URL absoluta subido');
    
    // Crear una página adicional de fallback
    console.log('\n3. Creando página de fallback...');
    await client.uploadFrom(tempFilePath, '/fallback.html');
    console.log('✅ Página de fallback creada');
    
    // Crear un iframe para restaurar todos los idiomas
    console.log('\n4. Creando página iframe para forzar contenido...');
    const iframeHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Miss Star International - Forzar Contenido</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <iframe src="fallback.html" frameborder="0"></iframe>
</body>
</html>`;
    
    const iframeFilePath = path.join(__dirname, '../temp_iframe.html');
    fs.writeFileSync(iframeFilePath, iframeHtml, 'utf8');
    await client.uploadFrom(iframeFilePath, '/iframe.html');
    console.log('✅ Página iframe creada');
    
    // Crear un script PHP para forzar el contenido correcto
    console.log('\n5. Creando PHP para forzar contenido...');
    const phpContent = `<?php
// Desactivar caché
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: Thu, 01 Jan 1970 00:00:00 GMT");

// HTML con URL absoluta
echo '<!DOCTYPE html>
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
            font-family: "Arial", sans-serif;
            background-color: #000;
            color: #fff;
            text-align: center;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .logo {
            max-width: 450px;
            width: 90%;
            margin-bottom: 40px;
        }
        .title {
            font-size: 2.5rem;
            color: #D4AF37;
            margin-bottom: 50px;
            padding: 0 20px;
        }
        .language-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin: 30px auto;
            max-width: 1200px;
            padding: 0 20px;
        }
        .language-option {
            width: 160px;
            padding: 15px;
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
            object-fit: cover;
        }
        .language-name {
            font-size: 1.2rem;
        }
        footer {
            margin-top: 50px;
            color: #888;
            font-size: 0.9rem;
            padding: 20px;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .title {
                font-size: 2rem;
            }
            .language-option {
                width: 140px;
            }
        }
        
        @media (max-width: 480px) {
            .language-grid {
                gap: 10px;
            }
            .language-option {
                width: 120px;
                padding: 10px;
            }
            .flag {
                width: 60px;
                height: 60px;
            }
            .language-name {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <img src="https://imgur.com/kgK4DyW.png" alt="Miss Star International" class="logo">
    
    <h1 class="title">Welcome to Miss Star International<br>A New Dynasty</h1>
    
    <div class="language-grid">
        <a href="en/" class="language-option">
            <img src="https://imgur.com/PkPcgOE.png" alt="English" class="flag">
            <span class="language-name">English</span>
        </a>
        
        <a href="es/" class="language-option">
            <img src="https://imgur.com/mUPzWMq.png" alt="Español" class="flag">
            <span class="language-name">Español</span>
        </a>
        
        <a href="pt/" class="language-option">
            <img src="https://imgur.com/UiykDBI.png" alt="Português" class="flag">
            <span class="language-name">Português</span>
        </a>
        
        <a href="th/" class="language-option">
            <img src="https://imgur.com/OXXfmfR.png" alt="ไทย" class="flag">
            <span class="language-name">ไทย</span>
        </a>
        
        <a href="vi/" class="language-option">
            <img src="https://imgur.com/3ItCKJA.png" alt="Tiếng Việt" class="flag">
            <span class="language-name">Tiếng Việt</span>
        </a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.<br>
        <small>Generado: ' . date("Y-m-d H:i:s") . '</small>
    </footer>
</body>
</html>';
?>`;

    const phpFilePath = path.join(__dirname, '../temp_force.php');
    fs.writeFileSync(phpFilePath, phpContent, 'utf8');
    await client.uploadFrom(phpFilePath, '/force.php');
    console.log('✅ Página PHP de forzado creada');
    
    // Limpiar archivos temporales
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(iframeFilePath);
    fs.unlinkSync(phpFilePath);
    
    console.log('\n✅ SOLUCIÓN DEFINITIVA COMPLETADA');
    console.log('Para ver los cambios, accede a:');
    console.log('1. https://missstarinternational.com/ (página principal con URL absoluta)');
    console.log('2. https://missstarinternational.com/fallback.html (página de fallback)');
    console.log('3. https://missstarinternational.com/force.php (PHP que fuerza el contenido)');
    console.log('4. https://missstarinternational.com/iframe.html (iframe que carga el fallback)');
    console.log('\nNOTA: La página principal ahora usa una URL absoluta a Imgur que siempre estará disponible.');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    client.close();
  }
}

main(); 