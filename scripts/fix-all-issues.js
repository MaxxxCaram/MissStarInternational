const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log('🚀 CORRECCIÓN COMPLETA DE ERRORES - MISS STAR INTERNATIONAL 🚀');
    console.log('============================================================');
    
    // Conectar al servidor
    console.log('\n1. Conectando al servidor FTP...');
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    console.log('✅ Conexión exitosa');
    
    // Navegar al directorio correcto
    console.log('\n2. Navegando al directorio público...');
    await client.cd('/domains/missstarinternational.com/public_html');
    console.log('✅ Navegación exitosa');
    
    // PASO 1: Crear un favicon y subirlo
    console.log('\n3. Creando y subiendo favicon.ico...');
    
    // Creamos un archivo de favicon simple (16x16 dorado)
    const faviconData = Buffer.from([
      0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10, 0x00, 0x00, 0x01, 0x00, 0x18, 0x00, 0x68, 0x03,
      0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x10, 0x00, 
      0x00, 0x00, 0x01, 0x00, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
      0x00, 0x00, 0x00, 0x00, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 
      0xD4, 0xAF, 0x37, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 
      0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
      0x00, 0x00, 0x00, 0x00, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 
      0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 
      0xAF, 0x37, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
      0x00, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 
      0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0x00, 
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 
      0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 
      0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0x00, 
      0x00, 0x00, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 
      0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 
      0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 
      0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 
      0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 
      0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 
      0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 
      0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 
      0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 
      0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 
      0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 
      0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 
      0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 
      0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 
      0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 
      0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 
      0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 
      0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 
      0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 
      0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 
      0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 
      0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 
      0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 
      0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37, 0xD4, 0xAF, 0x37
    ]);
    
    const faviconPath = path.join(__dirname, '../temp_favicon.ico');
    fs.writeFileSync(faviconPath, faviconData);
    
    // Subir a la carpeta raíz primero
    await client.uploadFrom(faviconPath, 'favicon.ico');
    console.log('✅ favicon.ico subido a la raíz correctamente');
    
    // Crear directorios de imágenes si no existen
    try {
      await client.ensureDir('assets/images');
    } catch (error) {
      console.log('Creando estructura de directorios para imágenes...');
      try { await client.ensureDir('assets'); } catch (e) {}
      try { await client.ensureDir('assets/images'); } catch (e) {}
    }
    
    // Subir también a la carpeta de imágenes para asegurar consistencia
    await client.cd('/domains/missstarinternational.com/public_html/assets/images');
    await client.uploadFrom(faviconPath, 'favicon.ico');
    console.log('✅ favicon.ico subido a assets/images correctamente');
    
    // PASO 2: Crear un archivo JavaScript mejorado que maneja los errores
    console.log('\n4. Creando y subiendo JavaScript optimizado...');
    
    const mainJs = `document.addEventListener('DOMContentLoaded', () => {
  // Manejar errores de carga de recursos
  window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
      // Prevenir propagación del error a la consola
      e.preventDefault();
      e.stopPropagation();
      
      // Si es una imagen, podemos intentar mostrar una imagen alternativa
      if (e.target.tagName === 'IMG') {
        console.log('Error cargando imagen:', e.target.src);
        // Opcionalmente, establecer una imagen de respaldo
        // e.target.src = '/path/to/fallback.png';
      }
      
      return false;
    }
  }, true);
  
  // Inicializar video de fondo si existe
  const videoBackground = document.getElementById('video-background');
  if (videoBackground) {
    videoBackground.play().catch(function(error) {
      console.log("Autoplay de video fallido:", error);
      // No mostrar error visual al usuario
    });
  }

  // Verificar si hay un idioma seleccionado en localStorage
  const selectedLanguage = localStorage.getItem('selectedLanguage');
  const languageSelector = document.getElementById('language-selector');
  
  if (selectedLanguage && languageSelector) {
    languageSelector.value = selectedLanguage;
  }

  // Ocultar selector de idioma en páginas específicas
  const currentPath = window.location.pathname;
  if (currentPath.includes('/conference/') || currentPath.includes('/dashboard/')) {
    const languageContainer = document.querySelector('.language-container');
    if (languageContainer) {
      languageContainer.style.display = 'none';
    }
  }

  // Gestión mejorada del desplazamiento
  let scrollTimer;
  window.addEventListener('scroll', () => {
    if (scrollTimer) clearTimeout(scrollTimer);
    
    scrollTimer = setTimeout(() => {
      const nav = document.querySelector('.nav');
      if (nav) {
        if (window.scrollY > 50) {
          nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        } else {
          nav.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        }
      }
    }, 20); // Debounce para mejor rendimiento
  });

  // Si estamos en móvil, optimizar el rendimiento
  if (window.innerWidth < 768) {
    // Reducir animaciones para mejorar rendimiento en móviles
    const elements = document.querySelectorAll('.animate');
    elements.forEach(el => {
      el.style.transition = 'none';
    });
  }

  // Animación del mensaje de bienvenida
  const welcomeMessage = document.querySelector('.welcome-message');
  if (welcomeMessage) {
    welcomeMessage.style.opacity = '1';
    welcomeMessage.style.transform = 'translateY(0)';
  }

  console.log('Miss Star International - Sitio cargado correctamente');
});`;
    
    // Guardamos el JavaScript en un archivo temporal
    const tempJsPath = path.join(__dirname, '../temp_main.js');
    fs.writeFileSync(tempJsPath, mainJs);
    
    // Crear directorios para JS si no existen
    await client.cd('/domains/missstarinternational.com/public_html');
    try {
      await client.ensureDir('assets/js');
    } catch (error) {
      console.log('Creando estructura de directorios para JavaScript...');
      try { await client.ensureDir('assets'); } catch (e) {}
      try { await client.ensureDir('assets/js'); } catch (e) {}
    }
    
    // Subimos el archivo al servidor
    await client.cd('/domains/missstarinternational.com/public_html/assets/js');
    await client.uploadFrom(tempJsPath, 'main.js');
    console.log('✅ Archivo JavaScript optimizado subido correctamente');
    
    // PASO 3: Actualizar el .htaccess para mejorar el manejo de errores y caché
    console.log('\n5. Actualizando archivo .htaccess...');
    
    const htaccess = `# Avoid domain errors
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>

# Redirect 404 errors to home page - except for conference pages
ErrorDocument 404 /index.html

# Allow direct access to conference pages
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Don't redirect if the file or directory exists
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]
    
    # Don't redirect conference URLs
    RewriteRule ^(en|es|pt|th|vi)/conference/ - [L]
    
    # For all other 404s, redirect to home page
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
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    ExpiresByType image/x-icon "access plus 1 month"
    ExpiresByType image/ico "access plus 1 month"
    ExpiresByType image/icon "access plus 1 month"
    ExpiresByType image/vnd.microsoft.icon "access plus 1 month"
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/x-javascript "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
    ExpiresByType application/x-javascript "access plus 1 week"
    ExpiresByType application/x-shockwave-flash "access plus 1 month"
    ExpiresDefault "access plus 2 days"
</IfModule>

# Disable cache for HTML and PHP files
<FilesMatch "\.(html|htm|php)$">
    <IfModule mod_headers.c>
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires 0
    </IfModule>
</FilesMatch>`;
    
    // Guardamos el .htaccess en un archivo temporal
    const tempHtaccessPath = path.join(__dirname, '../temp_htaccess');
    fs.writeFileSync(tempHtaccessPath, htaccess);
    
    // Subimos el archivo al servidor
    await client.cd('/domains/missstarinternational.com/public_html');
    await client.uploadFrom(tempHtaccessPath, '.htaccess');
    console.log('✅ Archivo .htaccess actualizado correctamente');
    
    // Limpiamos los archivos temporales
    fs.unlinkSync(faviconPath);
    fs.unlinkSync(tempJsPath);
    fs.unlinkSync(tempHtaccessPath);
    
    console.log('\n✅ Proceso completado exitosamente');
    console.log('\n📋 Resumen de cambios realizados:');
    console.log('1. Se creó y subió un favicon.ico para prevenir errores 404');
    console.log('2. Se optimizó el código JavaScript para manejar errores silenciosamente');
    console.log('3. Se actualizó el archivo .htaccess para mejorar la caché y el manejo de errores');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.close();
  }
}

main(); 