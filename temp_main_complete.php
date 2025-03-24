<?php
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
    <img src="logo.png" alt="Miss Star International Logo" class="logo">
    
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
</html>