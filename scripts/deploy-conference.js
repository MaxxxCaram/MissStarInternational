const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log('Conectando al servidor FTP...');
    await client.access({
      host: 'web0151.zxcs.nl',
      user: 'u127684p143111',
      password: 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false,
      port: 21
    });
    console.log('Conexión exitosa');
    
    const languages = ['en', 'es', 'pt', 'th', 'vi'];
    
    // Subir archivo favicon.ico a la raíz y assets/images
    try {
      const faviconPath = path.resolve(__dirname, '..', 'assets', 'images', 'favicon.ico');
      
      if (fs.existsSync(faviconPath)) {
        console.log('Subiendo favicon.ico a la raíz...');
        await client.uploadFrom(faviconPath, '/favicon.ico');
        console.log('favicon.ico subido a la raíz');
        
        console.log('Subiendo favicon.ico a /assets/images/...');
        await client.ensureDir('/assets');
        await client.ensureDir('/assets/images');
        await client.uploadFrom(faviconPath, '/assets/images/favicon.ico');
        console.log('favicon.ico subido a /assets/images/');
      } else {
        console.error('Archivo favicon.ico no encontrado en assets/images');
      }
    } catch (error) {
      console.error('Error al subir favicon.ico:', error.message);
    }
    
    // Subir archivos .htaccess actualizado
    try {
      const htaccessPath = path.resolve(__dirname, '..', '.htaccess');
      
      if (fs.existsSync(htaccessPath)) {
        console.log('Subiendo .htaccess actualizado...');
        await client.uploadFrom(htaccessPath, '/.htaccess');
        console.log('.htaccess subido correctamente');
      } else {
        console.error('Archivo .htaccess no encontrado');
      }
    } catch (error) {
      console.error('Error al subir .htaccess:', error.message);
    }
    
    // Procesar cada idioma
    for (const lang of languages) {
      try {
        const sourceDir = path.resolve(__dirname, '..', lang, 'conference');
        
        if (!fs.existsSync(sourceDir)) {
          console.error(`Directorio ${sourceDir} no encontrado`);
          continue;
        }
        
        // Crear directorio remoto si no existe
        console.log(`Creando directorio /${lang}/conference si no existe...`);
        await client.ensureDir(`/${lang}`);
        await client.ensureDir(`/${lang}/conference`);
        console.log(`Directorio creado o verificado: /${lang}/conference`);
        
        // Subir archivo index.html
        const indexPath = path.join(sourceDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          console.log(`Subiendo archivo index.html para ${lang}...`);
          await client.uploadFrom(indexPath, `/${lang}/conference/index.html`);
          console.log(`Archivo index.html para ${lang} subido correctamente`);
        } else {
          console.error(`Archivo index.html para ${lang} no encontrado`);
        }
      } catch (error) {
        console.error(`Error al procesar ${lang}:`, error.message);
      }
    }
    
    console.log('=========================================');
    console.log('🎉 PROCESO COMPLETADO CON ÉXITO');
    console.log('Las páginas de conferencia han sido subidas.');
    console.log('=========================================');
  } catch (error) {
    console.error('Error en el proceso:', error.message);
  } finally {
    client.close();
  }
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
}); 