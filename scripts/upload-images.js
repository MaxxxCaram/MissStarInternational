const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚨 UPLOADING LOCAL ASSETS TO SERVER 🚨');
    console.log('=====================================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    
    // Navigate to the correct directory
    console.log('\n1. Navigating to public_html directory...');
    try {
      await client.cd('/domains/missstarinternational.com/public_html');
      console.log('✅ Successfully navigated to public_html');
    } catch (err) {
      console.error('❌ Could not navigate to public_html:', err.message);
      return;
    }
    
    // Create assets directory structure if doesn't exist
    console.log('\n2. Creating assets directory structure...');
    
    const directories = [
      'assets',
      'assets/images',
      'assets/images/logo',
      'assets/images/flags'
    ];
    
    for (const dir of directories) {
      try {
        await client.ensureDir(dir);
        console.log(`✅ Directory exists or created: ${dir}`);
      } catch (err) {
        console.error(`❌ Failed to create directory ${dir}:`, err.message);
        return;
      }
    }
    
    // Upload logo files with correct paths
    console.log('\n3. Uploading logo files...');
    
    const logoFiles = [
      { local: '../assets/images/logo/logo-main1.png', remote: 'assets/images/logo/logo-main1.png' },
      { local: '../assets/images/logo-main1.png', remote: 'assets/images/logo/logo-main1.png' }
    ];
    
    for (const file of logoFiles) {
      if (fs.existsSync(file.local)) {
        await client.uploadFrom(file.local, file.remote);
        console.log(`✅ Uploaded: ${file.local} -> ${file.remote}`);
        
        // Also place logo in root for easy access
        await client.uploadFrom(file.local, 'logo.png');
        console.log(`✅ Uploaded logo to root as logo.png`);
        break; // Si uno funciona, no necesitamos probar el siguiente
      } else {
        console.log(`⚠️ Local file not found: ${file.local}`);
      }
    }
    
    // Upload flag files - both SVG and PNG if available
    console.log('\n4. Uploading flag files...');
    
    const flagMappings = [
      { country: 'usa', lang: 'en' },
      { country: 'spain', lang: 'es' },
      { country: 'portugal', lang: 'pt' },
      { country: 'thailand', lang: 'th' },
      { country: 'vietnam', lang: 'vi' }
    ];
    
    for (const flag of flagMappings) {
      // Check for SVG with correct paths
      const svgPaths = [
        `../assets/images/flags/${flag.lang}.svg`,
        `../assets/images/flags/${flag.country}.svg`
      ];
      
      // Check for PNG with correct paths
      const pngPaths = [
        `../assets/images/flags/${flag.lang}.png`,
        `../assets/images/flags/${flag.country}.png`
      ];
      
      // Upload SVG if exists
      let svgUploaded = false;
      for (const svgPath of svgPaths) {
        if (fs.existsSync(svgPath)) {
          await client.uploadFrom(svgPath, `assets/images/flags/${flag.lang}.svg`);
          console.log(`✅ Uploaded: ${svgPath} -> assets/images/flags/${flag.lang}.svg`);
          svgUploaded = true;
          break;
        }
      }
      
      if (!svgUploaded) {
        console.log(`⚠️ No SVG found for ${flag.lang} language flag`);
      }
      
      // Upload PNG if exists
      let pngUploaded = false;
      for (const pngPath of pngPaths) {
        if (fs.existsSync(pngPath)) {
          await client.uploadFrom(pngPath, `assets/images/flags/${flag.lang}.png`);
          console.log(`✅ Uploaded: ${pngPath} -> assets/images/flags/${flag.lang}.png`);
          pngUploaded = true;
          break;
        }
      }
      
      if (!pngUploaded) {
        console.log(`⚠️ No PNG found for ${flag.lang} language flag`);
      }
    }
    
    console.log('\n5. Actualizar index.html para usar archivos locales y con fallbacks...');
    
    // El HTML actualizado usa onerror para cargar alternativas si un archivo falla
    const updatedHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miss Star International - Welcome | Bienvenidos | Bem-vindos | ยินดีต้อนรับ | Chào mừng</title>
    <link rel="icon" href="assets/images/favicon.ico">
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

        .flag {
            width: 100px;
            height: 70px;
            border-radius: 5px;
            margin-bottom: 10px;
            box-shadow: 0 0 10px rgba(255,255,255,0.2);
            object-fit: contain;
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

            .flag {
                width: 80px;
                height: 56px;
            }

            .welcome-text {
                font-size: 1.5em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="assets/images/logo/logo-main1.png" alt="Miss Star International Logo" class="logo" 
             onerror="this.onerror=null; this.src='logo.png';">
        
        <div class="welcome-text">
            Welcome to Miss Star International<br>
            A New Dynasty
        </div>
        
        <div class="language-select">
            <a href="en/index.html" class="language-option">
                <img src="assets/images/flags/en.svg" alt="English" class="flag" 
                     onerror="this.onerror=null; this.src='assets/images/flags/en.png';">
                <div class="language-name">English</div>
            </a>
            
            <a href="es/index.html" class="language-option">
                <img src="assets/images/flags/es.svg" alt="Español" class="flag" 
                     onerror="this.onerror=null; this.src='assets/images/flags/es.png';">
                <div class="language-name">Español</div>
            </a>

            <a href="pt/index.html" class="language-option">
                <img src="assets/images/flags/pt.svg" alt="Português" class="flag" 
                     onerror="this.onerror=null; this.src='assets/images/flags/pt.png';">
                <div class="language-name">Português</div>
            </a>

            <a href="th/index.html" class="language-option">
                <img src="assets/images/flags/th.svg" alt="ไทย" class="flag" 
                     onerror="this.onerror=null; this.src='assets/images/flags/th.png';">
                <div class="language-name">ไทย</div>
            </a>

            <a href="vi/index.html" class="language-option">
                <img src="assets/images/flags/vi.svg" alt="Tiếng Việt" class="flag" 
                     onerror="this.onerror=null; this.src='assets/images/flags/vi.png';">
                <div class="language-name">Tiếng Việt</div>
            </a>
        </div>
    </div>

    <footer>
        <div>© 2024 Miss Star International. All rights reserved.</div>
    </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(__dirname, '../temp_index.html'), updatedHtml);
    
    try {
      await client.uploadFrom(path.join(__dirname, '../temp_index.html'), 'index.html');
      console.log('✅ Updated index.html to use local assets with fallbacks');
    } catch (err) {
      console.error('❌ Could not update index.html:', err.message);
    }

    console.log('\n✅ ASSETS UPLOAD COMPLETE!');
    console.log('All local assets have been uploaded to the server.');
    console.log('The index.html has been updated to use these local assets with fallbacks.');
    console.log('\nVisit: https://missstarinternational.com/');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    client.close();
  }
}

main().catch(console.error); 