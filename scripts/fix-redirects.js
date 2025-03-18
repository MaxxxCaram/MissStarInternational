const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

// Contenido del archivo .htaccess que reemplazará al existente
const htaccessContent = `# Avoid domain errors
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>

# IMPORTANTE: NO redireccionar las páginas de conferencia
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Reglas específicas para las páginas de conferencia - NO REDIRECCIONAR
    RewriteRule ^(en|es|pt|th|vi)/conference/(.*)$ - [L]
    
    # Solo redireccionar a la página de inicio cuando la URL no existe
    # y no es una página de conferencia
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /index.html [L]
</IfModule>

# Compress files to improve performance
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript
</IfModule>

# Browser cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/icon "access plus 1 year"
    ExpiresByType image/vnd.microsoft.icon "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/x-javascript "access plus 1 month"
    ExpiresByType application/x-shockwave-flash "access plus 1 month"
    ExpiresDefault "access plus 2 days"
</IfModule>`;

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log('🔄 Conectando al servidor FTP...');
    await client.access({
      host: 'web0151.zxcs.nl',
      user: 'u127684p143111',
      password: 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false,
      port: 21
    });
    console.log('✅ Conexión exitosa');
    
    // 1. Reemplazar el .htaccess principal
    console.log('🔧 Reemplazando el archivo .htaccess principal...');
    
    // Crear un archivo .htaccess temporal
    const tempHtaccessPath = path.resolve(__dirname, 'temp-htaccess');
    fs.writeFileSync(tempHtaccessPath, htaccessContent);
    
    // Subir el nuevo .htaccess
    await client.uploadFrom(tempHtaccessPath, '/.htaccess');
    
    // Eliminar el archivo temporal
    fs.unlinkSync(tempHtaccessPath);
    
    console.log('✅ Archivo .htaccess principal reemplazado correctamente');
    
    // 2. Verificar si existen archivos .htaccess en cada directorio de idioma
    const languages = ['en', 'es', 'pt', 'th', 'vi'];
    
    for (const lang of languages) {
      try {
        console.log(`🔍 Verificando el directorio /${lang}...`);
        await client.cd(`/${lang}`);
        
        // Obtener listado de archivos en el directorio
        const items = await client.list();
        
        // Verificar si existe un .htaccess en este directorio
        const htaccessExists = items.some(item => item.name === '.htaccess');
        
        if (htaccessExists) {
          console.log(`⚠️ Se encontró un archivo .htaccess en /${lang} - Eliminando...`);
          await client.remove(`/${lang}/.htaccess`);
          console.log(`✅ Archivo .htaccess en /${lang} eliminado`);
        } else {
          console.log(`✅ No se encontró archivo .htaccess en /${lang} - Correcto`);
        }
        
        // Verificar el directorio de conferencia
        try {
          console.log(`🔍 Verificando el directorio /${lang}/conference...`);
          await client.cd(`/${lang}/conference`);
          
          // Obtener listado de archivos en el directorio de conferencia
          const confItems = await client.list();
          
          // Verificar si existe un .htaccess en este directorio
          const confHtaccessExists = confItems.some(item => item.name === '.htaccess');
          
          if (confHtaccessExists) {
            console.log(`⚠️ Se encontró un archivo .htaccess en /${lang}/conference - Eliminando...`);
            await client.remove(`/${lang}/conference/.htaccess`);
            console.log(`✅ Archivo .htaccess en /${lang}/conference eliminado`);
          } else {
            console.log(`✅ No se encontró archivo .htaccess en /${lang}/conference - Correcto`);
          }
        } catch (error) {
          console.error(`❌ Error al verificar directorio /${lang}/conference:`, error.message);
        }
      } catch (error) {
        console.error(`❌ Error al procesar directorio /${lang}:`, error.message);
      }
    }
    
    console.log('=========================================');
    console.log('🎉 PROCESO COMPLETADO');
    console.log('Las redirecciones han sido corregidas.');
    console.log('Las páginas de conferencia deberían estar accesibles ahora.');
    console.log('=========================================');
  } catch (error) {
    console.error('❌ Error en el proceso:', error.message);
  } finally {
    client.close();
  }
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
}); 