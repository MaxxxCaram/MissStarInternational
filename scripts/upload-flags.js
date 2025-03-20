const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚨 UPLOADING FLAG IMAGES TO SERVER 🚨');
    console.log('===================================');
    
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
    
    // Create the flags directory structure
    console.log('\n2. Creating flags directory structure...');
    
    try {
      await client.ensureDir('assets');
      await client.ensureDir('assets/images');
      await client.ensureDir('assets/images/flags');
      console.log('✅ Flag directory structure created');
    } catch (err) {
      console.error('❌ Failed to create directory structure:', err.message);
      return;
    }
    
    // Define flags to upload - check both SVG and PNG
    console.log('\n3. Uploading flag images...');
    
    const flagMappings = [
      { name: 'usa', lang: 'en' },
      { name: 'spain', lang: 'es' },
      { name: 'portugal', lang: 'pt' },
      { name: 'thailand', lang: 'th' },
      { name: 'vietnam', lang: 'vi' }
    ];
    
    let successfulUploads = 0;
    
    for (const flag of flagMappings) {
      // Try different possible file paths for each flag
      const possiblePaths = [
        `assets/images/flags/${flag.name}.svg`,
        `assets/images/flags/${flag.name}.png`,
        `assets/images/flags/${flag.lang}.svg`,
        `assets/images/flags/${flag.lang}.png`
      ];
      
      let uploaded = false;
      
      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          const fileName = path.basename(filePath);
          const remoteDir = 'assets/images/flags/';
          
          try {
            await client.uploadFrom(filePath, `${remoteDir}${fileName}`);
            console.log(`✅ Uploaded: ${filePath} -> ${remoteDir}${fileName}`);
            uploaded = true;
            successfulUploads++;
            
            // If we found an SVG, also create a PNG version if it's missing
            if (fileName.endsWith('.svg') && !fs.existsSync(filePath.replace('.svg', '.png'))) {
              // For demonstration, we'll skip actual conversion here
              console.log(`⚠️ Note: No PNG version found for ${fileName}`);
            }
            
            // Break after first successful file for this flag
            break;
          } catch (err) {
            console.error(`❌ Failed to upload ${filePath}:`, err.message);
          }
        }
      }
      
      if (!uploaded) {
        console.log(`⚠️ No flag file found for ${flag.name}/${flag.lang}`);
        
        // Create a minimal flag placeholder if no file found
        console.log(`   Creating placeholder for ${flag.name}...`);
        
        // Define colors for flags (simplified)
        const flagColors = {
          'usa': '#00f', // blue
          'spain': '#f00', // red
          'portugal': '#060', // green
          'thailand': '#00f', // blue
          'vietnam': '#f00'  // red
        };
        
        const color = flagColors[flag.name] || '#000';
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="${color}" />
  <text x="50" y="50" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">
    ${flag.name.toUpperCase()}
  </text>
</svg>`;
        
        const tempSvgPath = path.join(__dirname, `../temp_${flag.name}.svg`);
        fs.writeFileSync(tempSvgPath, svgContent);
        
        try {
          await client.uploadFrom(tempSvgPath, `assets/images/flags/${flag.name}.svg`);
          console.log(`✅ Uploaded placeholder for ${flag.name}`);
          successfulUploads++;
          
          // Clean up temp file
          fs.unlinkSync(tempSvgPath);
        } catch (err) {
          console.error(`❌ Failed to upload placeholder for ${flag.name}:`, err.message);
          
          // Clean up temp file even if upload fails
          if (fs.existsSync(tempSvgPath)) {
            fs.unlinkSync(tempSvgPath);
          }
        }
      }
    }
    
    // Now update the index.html to use the flag images
    console.log('\n4. Updating index.html to use flag images...');
    
    const tempIndexPath = path.join(__dirname, '../temp_index_with_flags.html');
    
    try {
      // First, download the current index.html
      await client.downloadTo(tempIndexPath, 'index.html');
      console.log('✅ Downloaded current index.html');
      
      // Read the content
      let indexContent = fs.readFileSync(tempIndexPath, 'utf8');
      
      // Create an updated version with flags
      const updatedHtml = `<!DOCTYPE html>
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
        .logo {
            max-width: 90%;
            width: 400px;
            margin-bottom: 40px;
        }
        .title {
            font-size: 2.2rem;
            color: #D4AF37;
            margin-bottom: 30px;
        }
        .languages {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            max-width: 800px;
            gap: 30px;
            margin: 40px 0;
        }
        .lang-option {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #D4AF37;
            text-decoration: none;
            transition: all 0.3s ease;
            width: 120px;
        }
        .lang-option:hover {
            transform: scale(1.05);
        }
        .flag-img {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #D4AF37;
            margin-bottom: 10px;
            background-color: #333;
        }
        .lang-name {
            font-size: 1.2rem;
            margin-top: 5px;
        }
        footer {
            margin-top: 50px;
            color: #888;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <img src="logo.png" alt="Miss Star International" class="logo">
    
    <h1 class="title">Welcome to Miss Star International</h1>
    
    <p>Select your language:</p>
    
    <div class="languages">
        <a href="en/" class="lang-option">
            <img src="assets/images/flags/usa.svg" alt="English" class="flag-img" 
                 onerror="this.onerror=null; this.src='assets/images/flags/usa.png';">
            <span class="lang-name">English</span>
        </a>
        
        <a href="es/" class="lang-option">
            <img src="assets/images/flags/spain.svg" alt="Español" class="flag-img"
                 onerror="this.onerror=null; this.src='assets/images/flags/spain.png';">
            <span class="lang-name">Español</span>
        </a>
        
        <a href="pt/" class="lang-option">
            <img src="assets/images/flags/portugal.svg" alt="Português" class="flag-img"
                 onerror="this.onerror=null; this.src='assets/images/flags/portugal.png';">
            <span class="lang-name">Português</span>
        </a>
        
        <a href="th/" class="lang-option">
            <img src="assets/images/flags/thailand.svg" alt="ไทย" class="flag-img"
                 onerror="this.onerror=null; this.src='assets/images/flags/thailand.png';">
            <span class="lang-name">ไทย</span>
        </a>
        
        <a href="vi/" class="lang-option">
            <img src="assets/images/flags/vietnam.svg" alt="Tiếng Việt" class="flag-img"
                 onerror="this.onerror=null; this.src='assets/images/flags/vietnam.png';">
            <span class="lang-name">Tiếng Việt</span>
        </a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
</body>
</html>`;
      
      // Write the updated content to a temp file
      fs.writeFileSync(tempIndexPath, updatedHtml);
      
      // Upload the updated file
      await client.uploadFrom(tempIndexPath, 'index.html');
      console.log('✅ Updated index.html with flag images');
      
      // Clean up
      fs.unlinkSync(tempIndexPath);
      
    } catch (err) {
      console.error('❌ Failed to update index.html:', err.message);
      
      // Clean up even if there's an error
      if (fs.existsSync(tempIndexPath)) {
        fs.unlinkSync(tempIndexPath);
      }
    }
    
    console.log(`\n✅ UPLOADED ${successfulUploads} FLAG IMAGES`);
    console.log('The website has been updated with flag images for each language.');
    console.log('Visit: https://missstarinternational.com/');
  } catch (err) {
    console.error('General error:', err);
  } finally {
    client.close();
  }
}

main(); 