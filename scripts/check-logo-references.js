const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Función para conectar al FTP
async function connectFTP() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  await client.access({
    host: 'web0151.zxcs.nl',
    user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
    password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
    secure: false
  });
  
  return client;
}

async function downloadFile(client, remotePath, localPath) {
  try {
    await client.downloadTo(localPath, remotePath);
    console.log(`✅ Archivo descargado: ${remotePath}`);
    return true;
  } catch (err) {
    console.error(`❌ Error al descargar ${remotePath}:`, err.message);
    return false;
  }
}

async function uploadFile(client, localPath, remotePath) {
  try {
    await client.uploadFrom(localPath, remotePath);
    console.log(`✅ Archivo subido: ${remotePath}`);
    return true;
  } catch (err) {
    console.error(`❌ Error al subir ${remotePath}:`, err.message);
    return false;
  }
}

async function checkAndFixLogoReferences() {
  let client = null;
  
  try {
    client = await connectFTP();
    
    // Lista de páginas principales a verificar y corregir
    const pages = [
      '/en/index.html',
      '/es/index.html',
      '/pt/index.html',
      '/th/index.html',
      '/vi/index.html'
    ];
    
    for (const page of pages) {
      console.log(`\nVerificando página: ${page}`);
      
      // Crear nombre de archivo temporal
      const tempFile = path.join(__dirname, `../temp_${path.basename(page)}`);
      
      // Descargar el archivo
      if (await downloadFile(client, page, tempFile)) {
        // Leer contenido
        let content = fs.readFileSync(tempFile, 'utf8');
        
        // Verificar referencias a logos
        console.log('Analizando referencias a logos...');
        
        // Buscar y corregir rutas de logos
        let originalContent = content;
        
        // Patrones comunes de imágenes de logo
        const logoPatterns = [
          {
            regex: /src="[^"]*logo[^"]*\.png"/gi,
            correctPath: 'src="../assets/images/logo/logo-main1.png"'
          },
          {
            regex: /src='[^']*logo[^']*\.png'/gi,
            correctPath: "src='../assets/images/logo/logo-main1.png'"
          }
        ];
        
        // Verificar cada patrón
        let referenciasEncontradas = 0;
        let referenciasCambiadas = 0;
        
        for (const pattern of logoPatterns) {
          const matches = content.match(pattern.regex) || [];
          referenciasEncontradas += matches.length;
          
          if (matches.length > 0) {
            console.log(`- Encontradas ${matches.length} referencias con patrón: ${pattern.regex}`);
            content = content.replace(pattern.regex, (match) => {
              referenciasCambiadas++;
              return pattern.correctPath;
            });
          }
        }
        
        console.log(`Total: ${referenciasEncontradas} referencias encontradas, ${referenciasCambiadas} modificadas.`);
        
        // Si hubo cambios, guardar y subir
        if (originalContent !== content) {
          console.log('Actualizando archivo con las correcciones...');
          fs.writeFileSync(tempFile, content, 'utf8');
          
          // Subir archivo modificado
          await uploadFile(client, tempFile, page);
        } else {
          console.log('No se requieren cambios en este archivo.');
        }
        
        // Eliminar archivo temporal
        fs.unlinkSync(tempFile);
      }
    }
    
    console.log('\n✅ Verificación y corrección de referencias de logos completada.');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    if (client) {
      client.close();
    }
  }
}

// Ejecutar la función principal
checkAndFixLogoReferences(); 