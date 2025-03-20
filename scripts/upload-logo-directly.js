const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚨 UPLOADING LOGO DIRECTLY 🚨');
    console.log('============================');
    
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
    
    // Upload logo directly to root
    console.log('\n2. Uploading logo directly to root directory...');
    const logoPath = 'assets/images/logo/logo-main1.png';
    
    if (fs.existsSync(logoPath)) {
      // Upload directly to root
      await client.uploadFrom(logoPath, 'logo.png');
      console.log('✅ Logo uploaded directly to root as logo.png');
    } else {
      console.error('❌ Logo file not found at path:', logoPath);
      return;
    }
    
    // Create a very simple HTML that only uses the logo in the root
    console.log('\n3. Creating a very simple index.html...');
    const simpleIndexHtml = `<!DOCTYPE html>
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
            gap: 20px;
            margin: 40px 0;
        }
        .lang-link {
            display: inline-block;
            color: #D4AF37;
            text-decoration: none;
            padding: 10px 20px;
            border: 1px solid #D4AF37;
            border-radius: 5px;
            font-size: 1.2rem;
            min-width: 120px;
            transition: all 0.3s ease;
        }
        .lang-link:hover {
            background-color: rgba(212, 175, 55, 0.2);
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
        <a href="en/" class="lang-link">English</a>
        <a href="es/" class="lang-link">Español</a>
        <a href="pt/" class="lang-link">Português</a>
        <a href="th/" class="lang-link">ไทย</a>
        <a href="vi/" class="lang-link">Tiếng Việt</a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
</body>
</html>`;
    
    const tempIndexPath = path.join(__dirname, '../temp_simple_index.html');
    fs.writeFileSync(tempIndexPath, simpleIndexHtml, 'utf8');
    
    await client.uploadFrom(tempIndexPath, 'index.html');
    console.log('✅ Simple index.html uploaded');
    
    fs.unlinkSync(tempIndexPath);
    
    console.log('\n✅ LOGO UPLOAD COMPLETE!');
    console.log('A very simple version of the site has been created with just the logo.');
    console.log('No flag images are used in this version to maximize reliability.');
    console.log('\nVisit: https://missstarinternational.com/');
  } catch (err) {
    console.error('Error during upload:', err);
  } finally {
    client.close();
  }
}

main(); 