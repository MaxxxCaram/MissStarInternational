const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚨 ARREGLANDO SOLO LA PÁGINA PRINCIPAL 🚨');
    console.log('=======================================');
    
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
    
    // Create a better home page with direct links
    console.log('\n2. Creando página principal simplificada con enlaces directos...');
    
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
            font-size: 3.5rem;
            color: #D4AF37;
            margin-bottom: 20px;
            text-align: center;
        }
        .subtitle {
            font-size: 2rem;
            color: #D4AF37;
            margin-bottom: 50px;
        }
        .button-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin: 30px 0;
            max-width: 300px;
            width: 100%;
        }
        .button {
            padding: 15px 25px;
            background-color: rgba(30, 30, 30, 0.7);
            border: 2px solid #D4AF37;
            border-radius: 10px;
            color: #D4AF37;
            text-decoration: none;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .button:hover {
            background-color: rgba(50, 50, 50, 0.7);
            transform: scale(1.03);
        }
        .flag-icon {
            font-size: 24px;
            margin-right: 10px;
        }
        footer {
            margin-top: 50px;
            color: #888;
            font-size: 0.9rem;
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
    
    <div class="button-container">
        <a href="https://missstarinternational.com/main.php?lang=en" class="button">
            <span class="flag-icon">🇺🇸</span> English
        </a>
        
        <a href="https://missstarinternational.com/main.php?lang=es" class="button">
            <span class="flag-icon">🇪🇸</span> Español
        </a>
        
        <a href="https://missstarinternational.com/main.php?lang=pt" class="button">
            <span class="flag-icon">🇵🇹</span> Português
        </a>
        
        <a href="https://missstarinternational.com/main.php?lang=th" class="button">
            <span class="flag-icon">🇹🇭</span> ไทย
        </a>
        
        <a href="https://missstarinternational.com/main.php?lang=vi" class="button">
            <span class="flag-icon">🇻🇳</span> Tiếng Việt
        </a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
</body>
</html>`;
    
    const tempIndexPath = path.join(__dirname, '../temp_main_only.html');
    fs.writeFileSync(tempIndexPath, indexHtml);
    
    // Upload the improved index.html
    await client.uploadFrom(tempIndexPath, 'index.html');
    console.log('✅ Página principal actualizada');
    
    // Create a PHP file that will handle language redirects
    console.log('\n3. Creando archivo PHP para manejar idiomas...');
    
    const mainPhp = `<?php
// Disable cache
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: 0");

// Get language parameter, default to English
$lang = isset($_GET['lang']) ? $_GET['lang'] : 'en';

// Validate language
$validLangs = ['en', 'es', 'pt', 'th', 'vi'];
if (!in_array($lang, $validLangs)) {
    $lang = 'en';
}

// Language titles and messages
$langData = [
    'en' => ['title' => 'Welcome', 'message' => 'Welcome to Miss Star International', 'back' => 'Back to Language Selection'],
    'es' => ['title' => 'Bienvenidos', 'message' => 'Bienvenidos a Miss Star International', 'back' => 'Volver a Selección de Idioma'],
    'pt' => ['title' => 'Bem-vindos', 'message' => 'Bem-vindos ao Miss Star International', 'back' => 'Voltar para Seleção de Idioma'],
    'th' => ['title' => 'ยินดีต้อนรับ', 'message' => 'ยินดีต้อนรับสู่ Miss Star International', 'back' => 'กลับไปที่การเลือกภาษา'],
    'vi' => ['title' => 'Chào mừng', 'message' => 'Chào mừng đến với Miss Star International', 'back' => 'Quay lại Lựa chọn Ngôn ngữ']
];

// Flag icons
$flagIcons = [
    'en' => '🇺🇸',
    'es' => '🇪🇸',
    'pt' => '🇵🇹',
    'th' => '🇹🇭',
    'vi' => '🇻🇳'
];

// Get current language data
$title = $langData[$lang]['title'];
$message = $langData[$lang]['message'];
$back = $langData[$lang]['back'];
$flagIcon = $flagIcons[$lang];
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miss Star International - <?php echo $title; ?></title>
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
            display: flex;
            align-items: center;
            justify-content: center;
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
        .flag-icon {
            font-size: 28px;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <h1 class="title">
        <span class="star">★</span> 
        Miss Star International 
        <span class="star">★</span>
    </h1>
    <h2 class="subtitle">
        <span class="flag-icon"><?php echo $flagIcon; ?></span>
        <?php echo $title; ?>
    </h2>
    
    <div class="content">
        <p><?php echo $message; ?></p>
        
        <div class="coming-soon">
            <p>We are currently redesigning our website.</p>
            <p>The new and improved site will be available soon!</p>
        </div>
        
        <p>Thank you for your patience and continued support.</p>
        
        <a href="/" class="back-link">← <?php echo $back; ?></a>
    </div>
</body>
</html>`;
    
    const tempPhpPath = path.join(__dirname, '../temp_main.php');
    fs.writeFileSync(tempPhpPath, mainPhp);
    
    // Upload the PHP file
    await client.uploadFrom(tempPhpPath, 'main.php');
    console.log('✅ Archivo PHP para gestión de idiomas creado');
    
    // Clean up temp files
    fs.unlinkSync(tempIndexPath);
    fs.unlinkSync(tempPhpPath);
    
    console.log('\n✅ PÁGINA PRINCIPAL ACTUALIZADA');
    console.log('La página principal ahora enlaza a un archivo PHP que maneja todos los idiomas.');
    console.log('Visita: https://missstarinternational.com/');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    client.close();
  }
}

main(); 