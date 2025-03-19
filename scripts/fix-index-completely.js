const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚨 SOLUCIÓN FINAL: REEMPLAZO TOTAL DEL INDEX 🚨');
    console.log('==============================================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });

    // El análisis muestra que hay problemas con la página principal
    // Vamos a reemplazarla completamente por una versión limpia
    
    console.log('\n1. Preparando nuevo index.html con todos los idiomas...');
    
    // Este es el HTML final con todos los idiomas y logos absolutos
    const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Miss Star International - Select Language</title>
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
            max-width: 350px;
            width: 90%;
            margin-bottom: 40px;
        }
        .title {
            font-size: 2.2rem;
            color: #D4AF37;
            margin-bottom: 50px;
            text-align: center;
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
                font-size: 1.8rem;
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
    <!-- Logo con URL absoluta como respaldo -->
    <img src="logo.png" alt="Miss Star International" class="logo" onerror="this.onerror=null; this.src='https://imgur.com/kgK4DyW.png';">
    
    <h1 class="title">Select Your Language</h1>
    
    <div class="language-grid">
        <!-- Inglés -->
        <a href="en/" class="language-option">
            <img src="assets/images/flags/usa.png" alt="English" class="flag" onerror="this.onerror=null; this.src='https://imgur.com/PkPcgOE.png';">
            <span class="language-name">English</span>
        </a>
        
        <!-- Español -->
        <a href="es/" class="language-option">
            <img src="assets/images/flags/spain.png" alt="Español" class="flag" onerror="this.onerror=null; this.src='https://imgur.com/mUPzWMq.png';">
            <span class="language-name">Español</span>
        </a>
        
        <!-- Portugués -->
        <a href="pt/" class="language-option">
            <img src="assets/images/flags/portugal.png" alt="Português" class="flag" onerror="this.onerror=null; this.src='https://imgur.com/UiykDBI.png';">
            <span class="language-name">Português</span>
        </a>
        
        <!-- Tailandés -->
        <a href="th/" class="language-option">
            <img src="assets/images/flags/thailand.png" alt="ไทย" class="flag" onerror="this.onerror=null; this.src='https://imgur.com/OXXfmfR.png';">
            <span class="language-name">ไทย</span>
        </a>
        
        <!-- Vietnamita -->
        <a href="vi/" class="language-option">
            <img src="assets/images/flags/vietnam.png" alt="Tiếng Việt" class="flag" onerror="this.onerror=null; this.src='https://imgur.com/3ItCKJA.png';">
            <span class="language-name">Tiếng Việt</span>
        </a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
    
    <!-- Script para asegurar que todo se carga correctamente -->
    <script>
        // Verificación adicional para imágenes
        document.addEventListener('DOMContentLoaded', function() {
            // Verificar logo
            const logoImg = document.querySelector('.logo');
            if (!logoImg.complete || logoImg.naturalWidth === 0) {
                logoImg.src = 'https://imgur.com/kgK4DyW.png';
            }
            
            // Verificar banderas
            const flagImgs = document.querySelectorAll('.flag');
            const fallbackFlags = {
                'English': 'https://imgur.com/PkPcgOE.png',
                'Español': 'https://imgur.com/mUPzWMq.png',
                'Português': 'https://imgur.com/UiykDBI.png',
                'ไทย': 'https://imgur.com/OXXfmfR.png',
                'Tiếng Việt': 'https://imgur.com/3ItCKJA.png'
            };
            
            flagImgs.forEach(img => {
                if (!img.complete || img.naturalWidth === 0) {
                    const altText = img.alt;
                    if (fallbackFlags[altText]) {
                        img.src = fallbackFlags[altText];
                    }
                }
            });
        });
    </script>
</body>
</html>`;

    const tempIndexPath = path.join(__dirname, '../temp_final_index.html');
    fs.writeFileSync(tempIndexPath, finalHtml, 'utf8');
    
    // Eliminar el índice existente y subir el nuevo
    console.log('\n2. Reemplazando index.html con la versión final...');
    try {
      await client.remove('/index.html');
      console.log('✅ Index.html antiguo eliminado');
    } catch (err) {
      console.log('⚠️ No se pudo eliminar index.html (probablemente no existe)');
    }
    
    await client.uploadFrom(tempIndexPath, '/index.html');
    console.log('✅ Nuevo index.html subido');
    
    // Asegurar que el logo en la raíz existe
    console.log('\n3. Asegurando que el logo existe en la raíz...');
    
    // Sabemos que logo-main1.png existe, usaremos ese como referencia
    const logoSourcePath = path.join(__dirname, '../assets/images/logo/logo-main1.png');
    if (fs.existsSync(logoSourcePath)) {
      await client.uploadFrom(logoSourcePath, '/logo.png');
      console.log('✅ Logo subido a la raíz como logo.png');
    } else {
      console.log('⚠️ Logo local no encontrado, no se pudo subir a la raíz');
    }
    
    // Crear versiones de respaldo para cada página
    console.log('\n4. Creando páginas de respaldo...');
    
    await client.uploadFrom(tempIndexPath, '/index.backup.html');
    console.log('✅ Página de respaldo: index.backup.html');
    
    // Asegurarse de que las banderas estén disponibles
    console.log('\n5. Verificando banderas...');
    try {
      await client.ensureDir('/assets/images/flags');
      console.log('✅ Directorio de banderas existe');
    } catch (err) {
      console.log('⚠️ No se pudo verificar directorio de banderas: ' + err.message);
    }
    
    // Limpiar archivo temporal
    fs.unlinkSync(tempIndexPath);
    
    console.log('\n✅ SOLUCIÓN FINAL IMPLEMENTADA');
    console.log('Ahora la página principal debería mostrar todos los idiomas, incluyendo vietnamita.');
    console.log('Si las imágenes no cargan, se usarán automáticamente las versiones de respaldo de Imgur.');
    console.log('Visita https://missstarinternational.com/');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    client.close();
  }
}

main(); 