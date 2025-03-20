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
    
    // Upload logo files
    console.log('\n3. Uploading logo files...');
    
    const logoFiles = [
      { local: 'assets/images/logo/logo-main1.png', remote: 'assets/images/logo/logo-main1.png' },
      { local: 'assets/images/logo/logo.png', remote: 'assets/images/logo/logo.png' }
    ];
    
    for (const file of logoFiles) {
      if (fs.existsSync(file.local)) {
        await client.uploadFrom(file.local, file.remote);
        console.log(`✅ Uploaded: ${file.local} -> ${file.remote}`);
        
        // Also place logo in root for easy access
        if (file.local.includes('logo-main1.png')) {
          await client.uploadFrom(file.local, 'logo.png');
          console.log(`✅ Uploaded logo to root as logo.png`);
        }
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
      // Check for SVG
      const svgPath = `assets/images/flags/${flag.lang}.svg`;
      const svgCountryPath = `assets/images/flags/${flag.country}.svg`;
      
      // Check for PNG
      const pngPath = `assets/images/flags/${flag.lang}.png`;
      const pngCountryPath = `assets/images/flags/${flag.country}.png`;
      
      // Upload SVG if exists
      if (fs.existsSync(svgPath)) {
        await client.uploadFrom(svgPath, `assets/images/flags/${flag.country}.svg`);
        console.log(`✅ Uploaded: ${svgPath} -> assets/images/flags/${flag.country}.svg`);
      } else if (fs.existsSync(svgCountryPath)) {
        await client.uploadFrom(svgCountryPath, `assets/images/flags/${flag.country}.svg`);
        console.log(`✅ Uploaded: ${svgCountryPath} -> assets/images/flags/${flag.country}.svg`);
      }
      
      // Upload PNG if exists
      if (fs.existsSync(pngPath)) {
        await client.uploadFrom(pngPath, `assets/images/flags/${flag.country}.png`);
        console.log(`✅ Uploaded: ${pngPath} -> assets/images/flags/${flag.country}.png`);
      } else if (fs.existsSync(pngCountryPath)) {
        await client.uploadFrom(pngCountryPath, `assets/images/flags/${flag.country}.png`);
        console.log(`✅ Uploaded: ${pngCountryPath} -> assets/images/flags/${flag.country}.png`);
      }
    }
    
    // Now update the index.html to use the local files
    console.log('\n5. Updating index.html to use local files...');
    
    const tempIndexPath = path.join(__dirname, '../temp_local_index.html');
    
    const localAssetsHtml = `<!DOCTYPE html>
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
    <!-- Using local image -->
    <img src="logo.png" alt="Miss Star International" class="logo">
    
    <h1 class="title">Select Your Language</h1>
    
    <div class="language-grid">
        <!-- English -->
        <a href="en/" class="language-option">
            <img src="assets/images/flags/usa.png" alt="English" class="flag" 
                 onerror="this.onerror=null; this.src='assets/images/flags/usa.svg';">
            <span class="language-name">English</span>
        </a>
        
        <!-- Spanish -->
        <a href="es/" class="language-option">
            <img src="assets/images/flags/spain.png" alt="Español" class="flag"
                 onerror="this.onerror=null; this.src='assets/images/flags/spain.svg';">
            <span class="language-name">Español</span>
        </a>
        
        <!-- Portuguese -->
        <a href="pt/" class="language-option">
            <img src="assets/images/flags/portugal.png" alt="Português" class="flag"
                 onerror="this.onerror=null; this.src='assets/images/flags/portugal.svg';">
            <span class="language-name">Português</span>
        </a>
        
        <!-- Thai -->
        <a href="th/" class="language-option">
            <img src="assets/images/flags/thailand.png" alt="ไทย" class="flag"
                 onerror="this.onerror=null; this.src='assets/images/flags/thailand.svg';">
            <span class="language-name">ไทย</span>
        </a>
        
        <!-- Vietnamese -->
        <a href="vi/" class="language-option">
            <img src="assets/images/flags/vietnam.png" alt="Tiếng Việt" class="flag"
                 onerror="this.onerror=null; this.src='assets/images/flags/vietnam.svg';">
            <span class="language-name">Tiếng Việt</span>
        </a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
    
    <script>
        // Additional check if images fail to load
        document.addEventListener('DOMContentLoaded', function() {
            // Function to check if image loaded correctly
            function checkImage(img) {
                if (!img.complete || img.naturalWidth === 0) {
                    console.error('Failed to load image:', img.src);
                }
            }
            
            // Check all images
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.complete) {
                    checkImage(img);
                } else {
                    img.addEventListener('load', function() {
                        checkImage(img);
                    });
                    img.addEventListener('error', function() {
                        console.error('Failed to load image:', img.src);
                    });
                }
            });
        });
    </script>
</body>
</html>`;
    
    fs.writeFileSync(tempIndexPath, localAssetsHtml, 'utf8');
    await client.uploadFrom(tempIndexPath, 'index.html');
    console.log('✅ Updated index.html to use local assets');
    
    fs.unlinkSync(tempIndexPath);
    
    console.log('\n✅ ASSETS UPLOAD COMPLETE!');
    console.log('All local assets have been uploaded to the server.');
    console.log('The index.html has been updated to use these local assets.');
    console.log('\nVisit: https://missstarinternational.com/');
  } catch (err) {
    console.error('Error during upload:', err);
  } finally {
    client.close();
  }
}

main(); 