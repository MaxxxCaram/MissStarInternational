const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = false; // Desactivar verbosidad para tener una salida más limpia

  try {
    console.log('🔄 COMPARANDO ARCHIVOS ENTRE SERVIDOR Y REPOSITORIO LOCAL');
    console.log('======================================================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    
    console.log('\nConexión establecida. Comparando archivos importantes...');

    // Lista de archivos a comparar
    const filesToCompare = [
      { remote: '/index.html', local: 'index.html' },
      { remote: '/force.php', local: 'force.php' },
      { remote: '/assets/images/logo/logo-main1.png', local: 'assets/images/logo/logo-main1.png' },
      { remote: '/assets/images/logo/logo.png', local: 'assets/images/logo/logo.png' },
      { remote: '/logo.png', local: 'assets/images/logo/logo-main1.png' }, // Logo en la raíz vs local
      { remote: '/en/index.html', local: 'en/index.html' },
      { remote: '/es/index.html', local: 'es/index.html' },
      { remote: '/pt/index.html', local: 'pt/index.html' },
      { remote: '/th/index.html', local: 'th/index.html' },
      { remote: '/vi/index.html', local: 'vi/index.html' },
      { remote: '/assets/images/flags/vietnam.png', local: 'assets/images/flags/vietnam.png' }
    ];

    // Directorio temporal para archivos descargados
    const tempDir = path.join(__dirname, '../temp_compare');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    console.log('\nFILE                         | LOCAL EXISTS | REMOTE EXISTS | MATCH | SIZE REMOTE');
    console.log('-----------------------------|--------------|---------------|-------|------------');

    // Comparar cada archivo
    for (const file of filesToCompare) {
      const localPath = path.join(__dirname, '..', file.local);
      const tempPath = path.join(tempDir, path.basename(file.remote));
      
      let localExists = false;
      let remoteExists = false;
      let match = false;
      let remoteSize = 'N/A';
      
      // Verificar si el archivo local existe
      localExists = fs.existsSync(localPath);
      
      // Intentar descargar el archivo remoto
      try {
        await client.downloadTo(tempPath, file.remote);
        remoteExists = true;
        
        // Obtener tamaño del archivo remoto
        const stats = fs.statSync(tempPath);
        remoteSize = formatBytes(stats.size);
        
        // Comparar archivos si ambos existen
        if (localExists) {
          const localHash = getFileHash(localPath);
          const remoteHash = getFileHash(tempPath);
          match = localHash === remoteHash;
        }
      } catch (err) {
        remoteExists = false;
      }
      
      // Mostrar resultado
      console.log(
        `${file.remote.padEnd(30)} | ${formatBool(localExists).padEnd(12)} | ${formatBool(remoteExists).padEnd(13)} | ${formatMatch(match).padEnd(5)} | ${remoteSize}`
      );
    }
    
    // Si la página de vietnamita no existe, buscar otros archivos en esa carpeta
    try {
      console.log('\nVerificando contenido del directorio vietnamita...');
      const viFiles = await client.list('/vi/');
      if (viFiles.length > 0) {
        console.log('\nArchivos en /vi/:');
        console.log('FILENAME                      | TYPE      | SIZE       | MODIFIED');
        console.log('-----------------------------|-----------|------------|------------------');
        for (const file of viFiles) {
          console.log(
            `${file.name.padEnd(30)} | ${file.type.padEnd(9)} | ${formatBytes(file.size).padEnd(10)} | ${new Date(file.modifiedAt).toISOString().slice(0, 19).replace('T', ' ')}`
          );
        }
      } else {
        console.log('⚠️ El directorio vi/ existe pero está vacío');
      }
    } catch (err) {
      console.log(`⚠️ No se pudo acceder al directorio vi/: ${err.message}`);
    }
    
    // Verificar estructura de la página principal para encontrar el código del idioma faltante
    try {
      const indexHtmlPath = path.join(tempDir, 'index.html');
      if (fs.existsSync(indexHtmlPath)) {
        const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
        
        console.log('\nVerificando estructura de index.html:');
        
        // Buscar idiomas en el HTML
        const languageMatches = indexContent.match(/<a href="[a-z]{2}\/"[^>]*>[^<]*<\/a>/g) || [];
        
        console.log(`\nIdiomas encontrados: ${languageMatches.length}`);
        
        for (const match of languageMatches) {
          const langCode = match.match(/href="([a-z]{2})\/"/)?.[1] || 'unknown';
          const langName = match.match(/>([^<]+)<\/a>/)?.[1]?.trim() || 'unknown';
          console.log(`- ${langCode}: ${langName}`);
        }
        
        // Buscar específicamente vietnamita
        const hasVietnamese = indexContent.includes('vi/') || indexContent.includes('Tiếng Việt');
        console.log(`\n¿Contiene referencia a vietnamita? ${hasVietnamese ? 'SÍ' : 'NO'}`);
        
        if (hasVietnamese) {
          const vietnameseMatch = indexContent.match(/<a href="vi\/[^>]*>([^<]*)<\/a>/);
          if (vietnameseMatch) {
            console.log(`Texto del enlace vietnamita: "${vietnameseMatch[1].trim()}"`);
          }
        }
        
        // Buscar referencias a logos
        const logoRefs = indexContent.match(/src="[^"]*logo[^"]*"/g) || [];
        console.log(`\nReferencias a logos encontradas: ${logoRefs.length}`);
        for (const ref of logoRefs) {
          console.log(`- ${ref}`);
        }
      }
    } catch (err) {
      console.log(`⚠️ Error al analizar index.html: ${err.message}`);
    }
    
    // Limpiar archivos temporales
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    console.log('\n✅ COMPARACIÓN COMPLETADA');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    client.close();
  }
}

// Funciones auxiliares
function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

function formatBool(value) {
  return value ? '✅ Sí' : '❌ No';
}

function formatMatch(value) {
  return value ? '✅' : '❌';
}

function formatBytes(bytes, decimals = 2) {
  if (!bytes) return '0 B';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

main(); 