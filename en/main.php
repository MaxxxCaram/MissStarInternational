<?php
// Disable cache
header("Cache-Control: no-cache, no-store, must-revalidate, max-age=0");
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
        'coming_soon' => 'Website under construction',
        'thanks' => 'Thank you for your patience'
    ],
    'es' => [
        'title' => 'Bienvenidos', 
        'message' => 'Bienvenidos a Miss Star International', 
        'tagline' => 'Una Nueva Dinastía',
        'back' => 'Volver a Selección de Idioma',
        'coming_soon' => 'Sitio web en construcción',
        'thanks' => 'Gracias por su paciencia'
    ],
    'pt' => [
        'title' => 'Bem-vindos', 
        'message' => 'Bem-vindos ao Miss Star International', 
        'tagline' => 'Uma Nova Dinastia',
        'back' => 'Voltar para Seleção de Idioma',
        'coming_soon' => 'Site em construção',
        'thanks' => 'Obrigado pela sua paciência'
    ],
    'th' => [
        'title' => 'ยินดีต้อนรับ', 
        'message' => 'ยินดีต้อนรับสู่ Miss Star International', 
        'tagline' => 'ราชวงศ์ใหม่',
        'back' => 'กลับไปที่การเลือกภาษา',
        'coming_soon' => 'เว็บไซต์อยู่ระหว่างการก่อสร้าง',
        'thanks' => 'ขอบคุณสำหรับความอดทนของคุณ'
    ],
    'vi' => [
        'title' => 'Chào mừng', 
        'message' => 'Chào mừng đến với Miss Star International', 
        'tagline' => 'Một Triều đại Mới',
        'back' => 'Quay lại Lựa chọn Ngôn ngữ',
        'coming_soon' => 'Trang web đang được xây dựng',
        'thanks' => 'Cảm ơn bạn đã kiên nhẫn'
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
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
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
        
        h1 {
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
            gap: 10px;
        }
        
        .content {
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
        }
        
        .message {
            font-size: 1.5rem;
            margin-bottom: 30px;
        }
        
        .construction-box {
            font-size: 1.2rem;
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
            font-size: 40px;
            margin-right: 10px;
        }
        
        footer {
            margin-top: auto;
            padding: 20px;
            font-size: 14px;
            color: #888;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2.5rem;
            }
            
            .subtitle {
                font-size: 1.5rem;
            }
            
            .message {
                font-size: 1.2rem;
            }
        }
    </style>
</head>
<body>
    <h1>
        <span class="star">★</span>
        Miss Star International
        <span class="star">★</span>
    </h1>
    
    <div class="subtitle">
        <span class="flag-icon"><?php echo $flagIcon; ?></span>
        <span><?php echo $title; ?></span>
    </div>

    <div class="content">
        <div class="message"><?php echo $message; ?></div>
        <div><?php echo $tagline; ?></div>

        <div class="construction-box">
            <p><?php echo $coming_soon; ?></p>
            <p><?php echo $thanks; ?></p>
        </div>

        <a href="/" class="back-link">← <?php echo $back; ?></a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
</body>
</html>