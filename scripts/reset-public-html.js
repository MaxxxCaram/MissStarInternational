const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚨 RESET PUBLIC_HTML DIRECTORY 🚨');
    console.log('================================');
    
    // Connect using the correct path to public_html
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
    
    // Backup index.html
    console.log('\n2. Backing up current index.html...');
    const backupPath = path.join(__dirname, '../backup_index_' + Date.now() + '.html');
    try {
      await client.downloadTo(backupPath, 'index.html');
      console.log(`✅ Backup created at ${backupPath}`);
    } catch (err) {
      console.log('⚠️ Could not backup index.html:', err.message);
    }
    
    // Delete index.html
    console.log('\n3. Deleting current index.html...');
    try {
      await client.remove('index.html');
      console.log('✅ Old index.html deleted');
    } catch (err) {
      console.log('⚠️ Could not delete index.html:', err.message);
    }
    
    // Create a completely new index.html
    console.log('\n4. Creating new index.html...');
    
    const newIndexHtml = `<!DOCTYPE html>
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
        .language-name {
            font-size: 1.2rem;
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
    <!-- Direct Imgur URL for guaranteed loading -->
    <img src="https://imgur.com/kgK4DyW.png" alt="Miss Star International" class="logo">
    
    <h1 class="title">Select Your Language</h1>
    
    <div class="language-grid">
        <!-- English -->
        <a href="en/" class="language-option">
            <img src="https://imgur.com/PkPcgOE.png" alt="English" class="flag">
            <span class="language-name">English</span>
        </a>
        
        <!-- Spanish -->
        <a href="es/" class="language-option">
            <img src="https://imgur.com/mUPzWMq.png" alt="Español" class="flag">
            <span class="language-name">Español</span>
        </a>
        
        <!-- Portuguese -->
        <a href="pt/" class="language-option">
            <img src="https://imgur.com/UiykDBI.png" alt="Português" class="flag">
            <span class="language-name">Português</span>
        </a>
        
        <!-- Thai -->
        <a href="th/" class="language-option">
            <img src="https://imgur.com/OXXfmfR.png" alt="ไทย" class="flag">
            <span class="language-name">ไทย</span>
        </a>
        
        <!-- Vietnamese -->
        <a href="vi/" class="language-option">
            <img src="https://imgur.com/3ItCKJA.png" alt="Tiếng Việt" class="flag">
            <span class="language-name">Tiếng Việt</span>
        </a>
    </div>
    
    <footer>
        &copy; 2024 Miss Star International. All rights reserved.
    </footer>
</body>
</html>`;

    // Save and upload the new index.html
    const newIndexPath = path.join(__dirname, '../temp_direct_index.html');
    fs.writeFileSync(newIndexPath, newIndexHtml, 'utf8');
    
    await client.uploadFrom(newIndexPath, 'index.html');
    console.log('✅ New index.html uploaded successfully');
    
    // Check and create language directories if needed
    console.log('\n5. Checking language directories...');
    const languages = ['en', 'es', 'pt', 'th', 'vi'];
    
    for (const lang of languages) {
      try {
        // First check if the directory already exists
        let dirExists = false;
        try {
          await client.cd(lang);
          dirExists = true;
          await client.cd('..'); // Go back to public_html
        } catch (error) {
          dirExists = false;
        }
        
        if (!dirExists) {
          await client.mkdir(lang);
          console.log(`Created directory: ${lang}`);
        } else {
          console.log(`Directory ${lang} already exists`);
        }
        
        // Create a simple index.html in each language directory
        const langHtml = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miss Star International</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #000;
            color: #fff;
            text-align: center;
            margin: 0;
            padding: 40px 20px;
        }
        .logo {
            max-width: 300px;
            margin-bottom: 40px;
        }
        h1 {
            color: #D4AF37;
            margin-bottom: 30px;
        }
        .content {
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
        }
        .back-link {
            display: inline-block;
            margin-top: 40px;
            color: #D4AF37;
            text-decoration: none;
            border: 1px solid #D4AF37;
            padding: 10px 20px;
            border-radius: 5px;
        }
        .back-link:hover {
            background-color: rgba(212, 175, 55, 0.2);
        }
    </style>
</head>
<body>
    <img src="https://imgur.com/kgK4DyW.png" alt="Miss Star International" class="logo">
    
    <h1>Miss Star International</h1>
    
    <div class="content">
        <p>Welcome to the Miss Star International website.</p>
        <p>This page is currently under construction.</p>
        
        <a href="/" class="back-link">Back to Language Selection</a>
    </div>
</body>
</html>`;
        
        const tempLangPath = path.join(__dirname, `../temp_${lang}_index.html`);
        fs.writeFileSync(tempLangPath, langHtml, 'utf8');
        
        await client.uploadFrom(tempLangPath, `${lang}/index.html`);
        console.log(`✅ Created ${lang}/index.html`);
        
        fs.unlinkSync(tempLangPath);
      } catch (err) {
        console.log(`❌ Error processing ${lang}: ${err.message}`);
      }
    }
    
    // Clean up
    console.log('\n6. Cleaning up...');
    fs.unlinkSync(newIndexPath);
    
    console.log('\n✅ PUBLIC_HTML RESET COMPLETE!');
    console.log('The website has been completely rebuilt with direct Imgur links for all images.');
    console.log('All language options (including Vietnamese) should now be visible.');
    console.log('\nVisit: https://missstarinternational.com/');
  } catch (err) {
    console.error('Error during site reset:', err);
  } finally {
    client.close();
  }
}

main(); 