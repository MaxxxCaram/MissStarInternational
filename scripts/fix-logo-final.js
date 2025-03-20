const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log('🚨 SOLUCIÓN DEFINITIVA PARA EL LOGO 🚨');
    console.log('=====================================');
    
    // Conectar al servidor
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    
    // Navegar al directorio correcto
    console.log('\n1. Navegando al directorio public_html...');
    await client.cd('/domains/missstarinternational.com/public_html');
    console.log('✅ Navegación exitosa');
    
    // PASO 1: Subir el logo directamente desde el repositorio local
    console.log('\n2. Subiendo el logo desde el repositorio local...');
    const logoPath = path.join(__dirname, '../assets/images/logo/logo-main1.png');
    
    // Verificar que el archivo existe localmente
    if (!fs.existsSync(logoPath)) {
      throw new Error(`El archivo del logo no existe en la ruta: ${logoPath}`);
    }
    
    // Subir el logo como logo.png en la raíz
    await client.uploadFrom(logoPath, 'logo.png');
    console.log('✅ Logo subido correctamente');
    
    // PASO 2: Crear un HTML simplificado que use el logo
    console.log('\n3. Creando una versión simplificada de index.html...');
    
    const simpleHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Miss Star International</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            font-family: Arial, sans-serif;
            color: #fff;
            text-align: center;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .logo-container {
            margin-bottom: 40px;
        }
        
        .logo {
            max-width: 300px;
            height: auto;
            border: none;
        }
        
        h1 {
            font-size: 36px;
            color: #D4AF37;
            margin-bottom: 20px;
        }
        
        .subtitle {
            font-size: 24px;
            color: #D4AF37;
            margin-bottom: 40px;
        }
        
        .language-section {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 50px;
        }
        
        .language-link {
            padding: 15px 30px;
            background-color: #2c2c2c;
            color: #D4AF37;
            text-decoration: none;
            border-radius: 5px;
            border: 1px solid #D4AF37;
            font-size: 18px;
            transition: all 0.3s ease;
        }
        
        .language-link:hover {
            background-color: #D4AF37;
            color: #000;
        }

        .flag {
            font-size: 24px;
            margin-right: 10px;
        }
        
        footer {
            margin-top: auto;
            padding: 20px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="logo-container">
        <img src="logo.png" alt="Miss Star International Logo" class="logo">
    </div>
    
    <h1>Miss Star International</h1>
    
    <div class="subtitle">A New Dynasty</div>
    
    <div class="language-section">
        <a href="/main.php?lang=en" class="language-link"><span class="flag">🇺🇸</span> English</a>
        <a href="/main.php?lang=es" class="language-link"><span class="flag">🇪🇸</span> Español</a>
        <a href="/main.php?lang=pt" class="language-link"><span class="flag">🇵🇹</span> Português</a>
        <a href="/main.php?lang=th" class="language-link"><span class="flag">🇹🇭</span> ไทย</a>
        <a href="/main.php?lang=vi" class="language-link"><span class="flag">🇻🇳</span> Tiếng Việt</a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
</body>
</html>`;
    
    // Guardamos el HTML en un archivo temporal
    const tempHtmlPath = path.join(__dirname, '../temp_index_simple.html');
    fs.writeFileSync(tempHtmlPath, simpleHtml);
    
    // Subimos el archivo al servidor
    await client.uploadFrom(tempHtmlPath, 'index.html');
    console.log('✅ Página principal simplificada subida');
    
    // Limpiamos el archivo temporal
    fs.unlinkSync(tempHtmlPath);
    
    // PASO 3: Crear un main.php simplificado para las páginas de idiomas
    console.log('\n4. Creando un main.php simplificado...');
    
    const mainPhp = `<?php
// Parámetro de idioma, por defecto inglés
$lang = isset($_GET['lang']) ? $_GET['lang'] : 'en';

// Validar idioma
$validLangs = ['en', 'es', 'pt', 'th', 'vi'];
if (!in_array($lang, $validLangs)) {
    $lang = 'en';
}

// Datos para cada idioma
$langData = [
    'en' => [
        'title' => 'Welcome',
        'subtitle' => 'A New Dynasty',
        'message' => 'Welcome to Miss Star International',
        'back' => 'Back to Language Selection',
        'coming_soon' => 'Website under construction',
        'thanks' => 'Thank you for your patience'
    ],
    'es' => [
        'title' => 'Bienvenidos',
        'subtitle' => 'Una Nueva Dinastía',
        'message' => 'Bienvenidos a Miss Star International',
        'back' => 'Volver a Selección de Idioma',
        'coming_soon' => 'Sitio web en construcción',
        'thanks' => 'Gracias por su paciencia'
    ],
    'pt' => [
        'title' => 'Bem-vindos',
        'subtitle' => 'Uma Nova Dinastia',
        'message' => 'Bem-vindos ao Miss Star International',
        'back' => 'Voltar para Seleção de Idioma',
        'coming_soon' => 'Site em construção',
        'thanks' => 'Obrigado pela sua paciência'
    ],
    'th' => [
        'title' => 'ยินดีต้อนรับ',
        'subtitle' => 'ราชวงศ์ใหม่',
        'message' => 'ยินดีต้อนรับสู่ Miss Star International',
        'back' => 'กลับไปที่การเลือกภาษา',
        'coming_soon' => 'เว็บไซต์อยู่ระหว่างการก่อสร้าง',
        'thanks' => 'ขอบคุณสำหรับความอดทนของคุณ'
    ],
    'vi' => [
        'title' => 'Chào mừng',
        'subtitle' => 'Một Triều đại Mới',
        'message' => 'Chào mừng đến với Miss Star International',
        'back' => 'Quay lại Lựa chọn Ngôn ngữ',
        'coming_soon' => 'Trang web đang được xây dựng',
        'thanks' => 'Cảm ơn bạn đã kiên nhẫn'
    ]
];

// Banderas para cada idioma
$flags = [
    'en' => '🇺🇸',
    'es' => '🇪🇸',
    'pt' => '🇵🇹',
    'th' => '🇹🇭',
    'vi' => '🇻🇳'
];

// Obtener datos del idioma actual
$title = $langData[$lang]['title'];
$subtitle = $langData[$lang]['subtitle'];
$message = $langData[$lang]['message'];
$back = $langData[$lang]['back'];
$coming_soon = $langData[$lang]['coming_soon'];
$thanks = $langData[$lang]['thanks'];
$flag = $flags[$lang];
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Miss Star International - <?php echo $title; ?></title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            font-family: Arial, sans-serif;
            color: #fff;
            text-align: center;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .logo-container {
            margin-bottom: 40px;
        }
        
        .logo {
            max-width: 250px;
            height: auto;
            border: none;
        }
        
        h1 {
            font-size: 36px;
            color: #D4AF37;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 24px;
            color: #D4AF37;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .flag {
            font-size: 30px;
        }
        
        .content {
            max-width: 600px;
            margin: 0 auto 40px;
        }
        
        .message {
            font-size: 20px;
            margin-bottom: 30px;
        }
        
        .construction-box {
            background-color: #2c2c2c;
            border: 1px solid #D4AF37;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        
        .back-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: transparent;
            color: #D4AF37;
            text-decoration: none;
            border: 1px solid #D4AF37;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        
        .back-link:hover {
            background-color: #D4AF37;
            color: #000;
        }
        
        footer {
            margin-top: auto;
            padding: 20px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="logo-container">
        <img src="/logo.png" alt="Miss Star International Logo" class="logo">
    </div>
    
    <h1>Miss Star International</h1>
    
    <div class="subtitle">
        <span class="flag"><?php echo $flag; ?></span>
        <span><?php echo $title; ?></span>
    </div>
    
    <div class="content">
        <div class="message"><?php echo $message; ?></div>
        
        <div class="construction-box">
            <p><?php echo $coming_soon; ?></p>
            <p><?php echo $thanks; ?></p>
        </div>
        
        <a href="/" class="back-link"><?php echo $back; ?></a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
</body>
</html>`;
    
    // Guardamos el PHP en un archivo temporal
    const tempPhpPath = path.join(__dirname, '../temp_main_simple.php');
    fs.writeFileSync(tempPhpPath, mainPhp);
    
    // Subimos el archivo al servidor
    await client.uploadFrom(tempPhpPath, 'main.php');
    console.log('✅ Script main.php simplificado subido');
    
    // Limpiamos el archivo temporal
    fs.unlinkSync(tempPhpPath);
    
    // PASO 4: Crear un archivo .htaccess para controlar el caché
    console.log('\n5. Creando archivo .htaccess optimizado...');
    
    const htaccess = `# Disable caching for all files
<IfModule mod_headers.c>
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
</IfModule>

# Enable CORS
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>

# Handle redirects for language directories
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Redirects for language directories
    RewriteRule ^en/?$ /main.php?lang=en [R=302,L]
    RewriteRule ^es/?$ /main.php?lang=es [R=302,L]
    RewriteRule ^pt/?$ /main.php?lang=pt [R=302,L]
    RewriteRule ^th/?$ /main.php?lang=th [R=302,L]
    RewriteRule ^vi/?$ /main.php?lang=vi [R=302,L]
</IfModule>

# Prevent directory listing
Options -Indexes

# Set default charset
AddDefaultCharset UTF-8

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>`;
    
    // Guardamos el .htaccess en un archivo temporal
    const tempHtaccessPath = path.join(__dirname, '../temp_htaccess');
    fs.writeFileSync(tempHtaccessPath, htaccess);
    
    // Subimos el archivo al servidor
    await client.uploadFrom(tempHtaccessPath, '.htaccess');
    console.log('✅ Archivo .htaccess optimizado subido');
    
    // Limpiamos el archivo temporal
    fs.unlinkSync(tempHtaccessPath);
    
    console.log('\n🎉 ¡REPARACIÓN COMPLETA FINALIZADA! 🎉');
    console.log('El sitio web debería estar funcional con su logo.');
    console.log('Por favor, visita https://missstarinternational.com/');
    
  } catch (err) {
    console.error('❌ Error durante la reparación:', err);
  } finally {
    client.close();
  }
}

main().catch(console.error); 