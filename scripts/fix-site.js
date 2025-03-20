const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = false; // Reducir el log

  try {
    console.log('🚀 Arreglando el sitio web...');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: 'u127684p143111',
      password: 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    
    // Navegar al directorio correcto
    await client.cd('/domains/missstarinternational.com/public_html');
    console.log('✅ Conectado al servidor');
    
    // Crear HTML de emergencia muy simple
    const emergencyHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miss Star International</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            font-family: Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
        }
        .container {
            text-align: center;
            padding: 20px;
        }
        .logo {
            max-width: 300px;
            margin-bottom: 40px;
        }
        .welcome-text {
            font-size: 2em;
            margin-bottom: 40px;
            color: #D4AF37;
        }
        .links {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
        }
        .lang-link {
            padding: 15px 30px;
            background-color: #D4AF37;
            color: #000;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        footer {
            margin-top: 50px;
            color: #D4AF37;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="welcome-text">
            Welcome to Miss Star International<br>
            <small>A New Dynasty</small>
        </div>
        
        <div class="links">
            <a href="en/" class="lang-link">English</a>
            <a href="es/" class="lang-link">Español</a>
            <a href="pt/" class="lang-link">Português</a>
            <a href="th/" class="lang-link">ไทย</a>
            <a href="vi/" class="lang-link">Tiếng Việt</a>
        </div>
    </div>

    <footer>
        <div>© 2024 Miss Star International. All rights reserved.</div>
    </footer>
</body>
</html>`;

    // Escribir archivo temporal
    const tempPath = path.join(__dirname, '../emergency.html');
    fs.writeFileSync(tempPath, emergencyHtml);
    
    // Subir archivo
    await client.uploadFrom(tempPath, 'index.html');
    console.log('✅ Página de emergencia subida con éxito');
    
    console.log('✅ ¡Sitio arreglado! Por favor verifica https://missstarinternational.com/');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    client.close();
  }
}

main().catch(console.error); 