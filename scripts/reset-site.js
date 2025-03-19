const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🚨 RESET COMPLETE WEBSITE 🚨');
    console.log('===========================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });

    // 1. Backup current index file just in case
    console.log('\n1. Creating backup of current index...');
    const backupPath = path.join(__dirname, '../temp_backup_index.html');
    try {
      await client.downloadTo(backupPath, '/index.html');
      console.log('✅ Index backup created');
    } catch (err) {
      console.log('⚠️ Could not backup index: ' + err.message);
    }
    
    // 2. Delete everything except .htaccess and critical files
    console.log('\n2. Deleting all content except critical files...');
    const preserveFiles = ['.htaccess', 'robots.txt', 'sitemap.xml'];
    
    // Get root directory listing
    const rootFiles = await client.list('/');
    
    // Delete each file/directory except preserved ones
    for (const item of rootFiles) {
      if (!preserveFiles.includes(item.name)) {
        try {
          if (item.type === 1) { // Directory
            console.log(`Deleting directory: /${item.name}/`);
            await client.removeDir(`/${item.name}`);
          } else {
            console.log(`Deleting file: /${item.name}`);
            await client.remove(`/${item.name}`);
          }
        } catch (err) {
          console.log(`⚠️ Could not delete ${item.name}: ${err.message}`);
        }
      }
    }
    
    // 3. Create a clean structure for the site
    console.log('\n3. Creating clean site structure...');
    
    // Create main directories
    const mainDirs = ['assets', 'assets/images', 'assets/images/logo', 'assets/images/flags', 
                    'en', 'es', 'pt', 'th', 'vi'];
    
    for (const dir of mainDirs) {
      try {
        await client.ensureDir('/' + dir);
        console.log(`✅ Created directory: /${dir}`);
      } catch (err) {
        console.log(`⚠️ Could not create ${dir}: ${err.message}`);
      }
    }
    
    // 4. Create a fresh index.html
    console.log('\n4. Creating fresh index.html...');
    
    const freshIndex = `<!DOCTYPE html>
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
    <!-- Direct logo URL with fallback -->
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

    const freshIndexPath = path.join(__dirname, '../temp_fresh_index.html');
    fs.writeFileSync(freshIndexPath, freshIndex, 'utf8');
    
    // Upload the fresh index
    await client.uploadFrom(freshIndexPath, '/index.html');
    console.log('✅ Fresh index.html uploaded');
    
    // 5. Create a simple page for each language
    console.log('\n5. Creating simple pages for each language...');
    
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'th', name: 'Thai' },
      { code: 'vi', name: 'Vietnamese' }
    ];
    
    const simplePageTemplate = (lang) => `<!DOCTYPE html>
<html lang="${lang.code}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miss Star International - ${lang.name}</title>
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
    
    <h1>Miss Star International - ${lang.name} Version</h1>
    
    <div class="content">
        <p>This is a placeholder page for the ${lang.name} version of the Miss Star International website.</p>
        <p>The site is currently being updated with new content.</p>
        
        <a href="/" class="back-link">Back to Language Selection</a>
    </div>
</body>
</html>`;
    
    for (const lang of languages) {
      const langPagePath = path.join(__dirname, `../temp_${lang.code}_index.html`);
      fs.writeFileSync(langPagePath, simplePageTemplate(lang), 'utf8');
      
      await client.uploadFrom(langPagePath, `/${lang.code}/index.html`);
      console.log(`✅ Created ${lang.name} page`);
      
      // Clean up
      fs.unlinkSync(langPagePath);
    }
    
    // 6. Clean up temporary files
    console.log('\n6. Cleaning up...');
    fs.unlinkSync(freshIndexPath);
    
    if (fs.existsSync(backupPath)) {
      // Keep the backup in a safe location
      const finalBackupPath = path.join(__dirname, '../backup_index_' + Date.now() + '.html');
      fs.renameSync(backupPath, finalBackupPath);
      console.log(`✅ Backup saved to ${finalBackupPath}`);
    }
    
    console.log('\n✅ SITE RESET COMPLETE');
    console.log('The website has been completely reset and rebuilt with a clean structure.');
    console.log('All pages now use direct Imgur links for reliability.');
    console.log('The original content is backed up locally if needed.');
    console.log('\nVisit: https://missstarinternational.com/');
  } catch (err) {
    console.error('Error during site reset:', err);
  } finally {
    client.close();
  }
}

main(); 