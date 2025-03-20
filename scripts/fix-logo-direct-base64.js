const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log('🚀 SOLUCIÓN DEFINITIVA - LOGO INCRUSTADO BASE64 🚀');
    console.log('=================================================');
    
    // 1. Leer el archivo del logo y convertirlo a base64
    const logoPath = path.join(__dirname, '../assets/images/logo/logo-main1.png');
    const logoData = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;
    
    console.log('✅ Logo convertido a base64');
    
    // 2. Conectar al servidor FTP
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    
    console.log('✅ Conexión FTP establecida');
    
    // 3. Navegar al directorio correcto
    await client.cd('/domains/missstarinternational.com/public_html');
    console.log('✅ Navegación exitosa a public_html');
    
    // 4. Crear HTML con el logo incrustado como base64
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Miss Star International - Welcome | Bienvenidos | Bem-vindos | ยินดีต้อนรับ | Chào mừng</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👑</text></svg>">
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

            .welcome-text {
                font-size: 1.5em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="${logoBase64}" alt="Miss Star International Logo" class="logo">
        
        <div class="welcome-text">
            Welcome to Miss Star International<br>
            A New Dynasty
        </div>
        
        <div class="language-select">
            <a href="main.php?lang=en" class="language-option">
                <span style="font-size: 50px;">🇺🇸</span>
                <div class="language-name">English</div>
            </a>
            
            <a href="main.php?lang=es" class="language-option">
                <span style="font-size: 50px;">🇪🇸</span>
                <div class="language-name">Español</div>
            </a>

            <a href="main.php?lang=pt" class="language-option">
                <span style="font-size: 50px;">🇵🇹</span>
                <div class="language-name">Português</div>
            </a>

            <a href="main.php?lang=th" class="language-option">
                <span style="font-size: 50px;">🇹🇭</span>
                <div class="language-name">ไทย</div>
            </a>

            <a href="main.php?lang=vi" class="language-option">
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
    
    // 5. Escribir el archivo temporal y subirlo
    const tempFilePath = path.join(__dirname, '../temp_index_base64.html');
    fs.writeFileSync(tempFilePath, htmlContent);
    
    await client.uploadFrom(tempFilePath, 'index.html');
    console.log('✅ Archivo index.html con logo base64 subido correctamente');
    
    // 6. Crear archivo PHP también con el logo en base64 para las páginas de idiomas
    const phpContent = `<?php
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
    'en' => [
        'title' => 'Welcome', 
        'message' => 'Welcome to Miss Star International', 
        'tagline' => 'A New Dynasty',
        'back' => 'Back to Language Selection',
        'coming_soon' => 'We are currently redesigning our website',
        'coming_soon2' => 'The new and improved site will be available soon!',
        'thanks' => 'Thank you for your patience and continued support.'
    ],
    'es' => [
        'title' => 'Bienvenidos', 
        'message' => 'Bienvenidos a Miss Star International', 
        'tagline' => 'Una Nueva Dinastía',
        'back' => 'Volver a Selección de Idioma',
        'coming_soon' => 'Actualmente estamos rediseñando nuestro sitio web',
        'coming_soon2' => '¡El nuevo y mejorado sitio estará disponible pronto!',
        'thanks' => 'Gracias por su paciencia y apoyo continuo.'
    ],
    'pt' => [
        'title' => 'Bem-vindos', 
        'message' => 'Bem-vindos ao Miss Star International', 
        'tagline' => 'Uma Nova Dinastia',
        'back' => 'Voltar para Seleção de Idioma',
        'coming_soon' => 'Atualmente estamos redesenhando nosso site',
        'coming_soon2' => 'O novo e aprimorado site estará disponível em breve!',
        'thanks' => 'Obrigado pela sua paciência e apoio contínuo.'
    ],
    'th' => [
        'title' => 'ยินดีต้อนรับ', 
        'message' => 'ยินดีต้อนรับสู่ Miss Star International', 
        'tagline' => 'ราชวงศ์ใหม่',
        'back' => 'กลับไปที่การเลือกภาษา',
        'coming_soon' => 'ขณะนี้เรากำลังปรับปรุงเว็บไซต์ของเรา',
        'coming_soon2' => 'เว็บไซต์ใหม่และปรับปรุงแล้วจะพร้อมใช้งานเร็วๆ นี้!',
        'thanks' => 'ขอบคุณสำหรับความอดทนและการสนับสนุนอย่างต่อเนื่องของคุณ'
    ],
    'vi' => [
        'title' => 'Chào mừng', 
        'message' => 'Chào mừng đến với Miss Star International', 
        'tagline' => 'Một Triều đại Mới',
        'back' => 'Quay lại Lựa chọn Ngôn ngữ',
        'coming_soon' => 'Chúng tôi hiện đang thiết kế lại trang web của mình',
        'coming_soon2' => 'Trang web mới và cải tiến sẽ sớm được ra mắt!',
        'thanks' => 'Cảm ơn sự kiên nhẫn và hỗ trợ liên tục của bạn.'
    ]
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
$tagline = $langData[$lang]['tagline'];
$back = $langData[$lang]['back'];
$coming_soon = $langData[$lang]['coming_soon'];
$coming_soon2 = $langData[$lang]['coming_soon2'];
$thanks = $langData[$lang]['thanks'];
$flagIcon = $flagIcons[$lang];

// Logo in base64 - this is embedded in the HTML
$logoBase64 = '${logoBase64}';
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Cinzel:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
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
            background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), #000000;
        }
        .title {
            font-family: 'Cinzel', serif;
            font-size: 3rem;
            color: #D4AF37;
            margin-bottom: 30px;
        }
        .subtitle {
            font-family: 'Cinzel', serif;
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
            font-size: 48px;
            margin-right: 10px;
        }
        .logo {
            max-width: 250px;
            margin-bottom: 30px;
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
    </style>
</head>
<body>
    <img src="<?php echo $logoBase64; ?>" alt="Miss Star International Logo" class="logo">
    
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
        <p><?php echo $tagline; ?></p>

        <div class="coming-soon">
            <p><?php echo $coming_soon; ?></p>
            <p><?php echo $coming_soon2; ?></p>
        </div>

        <p><?php echo $thanks; ?></p>

        <a href="/" class="back-link">← <?php echo $back; ?></a>
    </div>
</body>
</html>`;
    
    const tempPhpPath = path.join(__dirname, '../temp_main_base64.php');
    fs.writeFileSync(tempPhpPath, phpContent);
    
    await client.uploadFrom(tempPhpPath, 'main.php');
    console.log('✅ Archivo main.php con logo base64 subido correctamente');
    
    // 7. Limpiar archivos temporales
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(tempPhpPath);
    console.log('✅ Archivos temporales eliminados');
    
    console.log('\n🎉 ¡SOLUCIÓN COMPLETA! 🎉');
    console.log('La imagen del logo ahora está incrustada directamente en el HTML como base64');
    console.log('No hay dependencias de archivos externos ni rutas relativas');
    console.log('Puedes visitar https://missstarinternational.com/ para verificar.');
    
  } catch (err) {
    console.error('❌ Error durante el proceso:', err);
  } finally {
    client.close();
  }
}

main().catch(console.error); 