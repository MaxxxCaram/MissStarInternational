const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Generate English-only version of the site
 */
async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🔄 GENERATING ENGLISH-ONLY VERSION');
    console.log('==================================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });

    // Prepare English home page
    console.log('\n1. Preparing English-only home page...');
    
    // HTML with English language option only
    const englishOnlyHtml = `<!DOCTYPE html>
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
        .enter-button {
            width: 200px;
            padding: 15px 30px;
            background-color: rgba(30, 30, 30, 0.7);
            border: 2px solid #D4AF37;
            border-radius: 10px;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
            text-decoration: none;
            color: #D4AF37;
            font-size: 1.2rem;
            font-weight: bold;
            margin-top: 20px;
        }
        .enter-button:hover {
            transform: scale(1.05);
            background-color: rgba(50, 50, 50, 0.7);
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
        }
    </style>
</head>
<body>
    <!-- Logo with fallback -->
    <img src="logo.png" alt="Miss Star International" class="logo" onerror="this.onerror=null; this.src='https://imgur.com/kgK4DyW.png';">
    
    <h1 class="title">Welcome to Miss Star International<br>A New Dynasty</h1>
    
    <a href="en/" class="enter-button">Enter</a>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
    
    <!-- Script to ensure images load -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const logoImg = document.querySelector('.logo');
            if (!logoImg.complete || logoImg.naturalWidth === 0) {
                logoImg.src = 'https://imgur.com/kgK4DyW.png';
            }
        });
    </script>
</body>
</html>`;

    const tempEnglishPath = path.join(__dirname, '../temp_english_index.html');
    fs.writeFileSync(tempEnglishPath, englishOnlyHtml, 'utf8');
    
    // Create English-only version at /en-only/
    console.log('\n2. Creating English-only version directory...');
    try {
      await client.ensureDir('/en-only');
      console.log('✅ English-only directory created or exists');
    } catch (err) {
      console.log('⚠️ Error creating English-only directory: ' + err.message);
    }
    
    // Upload the English-only index
    await client.uploadFrom(tempEnglishPath, '/en-only/index.html');
    console.log('✅ English-only index.html uploaded');
    
    // Copy the English content to the English-only directory
    console.log('\n3. Copying English content to English-only directory...');
    
    // First, download the English index content
    const tempEnContentPath = path.join(__dirname, '../temp_en_content.html');
    try {
      await client.downloadTo(tempEnContentPath, '/en/index.html');
      console.log('✅ English content downloaded');
      
      // Upload to the English-only directory
      await client.uploadFrom(tempEnContentPath, '/en-only/main.html');
      console.log('✅ English content uploaded to English-only directory');
    } catch (err) {
      console.log('⚠️ Error copying English content: ' + err.message);
    }
    
    // Create an English-only simplified URL
    console.log('\n4. Creating English-only simplified URL...');
    await client.uploadFrom(tempEnglishPath, '/english.html');
    console.log('✅ English-only page created at /english.html');
    
    // Create a README for the English-only version
    console.log('\n5. Creating README for English-only version...');
    const readmeContent = `# English-Only Version

This directory contains an English-only version of the Miss Star International website.

## Access URLs:
- English-only portal: https://missstarinternational.com/en-only/
- Quick access: https://missstarinternational.com/english.html

## File structure:
- index.html: Entry point with direct access to English content
- main.html: Main English content

Last updated: ${new Date().toISOString()}
`;
    
    const readmePath = path.join(__dirname, '../temp_readme.md');
    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    await client.uploadFrom(readmePath, '/en-only/README.md');
    console.log('✅ README uploaded');
    
    // Clean up temporary files
    fs.unlinkSync(tempEnglishPath);
    if (fs.existsSync(tempEnContentPath)) {
      fs.unlinkSync(tempEnContentPath);
    }
    fs.unlinkSync(readmePath);
    
    console.log('\n✅ ENGLISH-ONLY VERSION CREATED');
    console.log('Access URLs:');
    console.log('- https://missstarinternational.com/en-only/');
    console.log('- https://missstarinternational.com/english.html');
  } catch (err) {
    console.error('Error during English-only version generation:', err);
  } finally {
    client.close();
  }
}

main(); 