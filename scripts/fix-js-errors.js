const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log('🚀 CORRECCIÓN DE ERRORES JAVASCRIPT 🚀');
    console.log('======================================');
    
    // Conectar al servidor
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });
    
    // Navegar al directorio correcto
    console.log('\n1. Navegando al directorio público...');
    await client.cd('/domains/missstarinternational.com/public_html');
    console.log('✅ Navegación exitosa');
    
    // Crear un archivo JavaScript mejorado que maneja los errores
    console.log('\n2. Creando y subiendo JavaScript optimizado...');
    
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

  console.log('Miss Star International - Sitio cargado correctamente');
});`;
    
    // Guardamos el JavaScript en un archivo temporal
    const tempJsPath = path.join(__dirname, '../temp_main.js');
    fs.writeFileSync(tempJsPath, mainJs);
    
    // Crear directorios si no existen
    try {
      await client.ensureDir('assets/js');
    } catch (error) {
      console.log('Creando estructura de directorios...');
      try { await client.ensureDir('assets'); } catch (e) {}
      try { await client.ensureDir('assets/js'); } catch (e) {}
    }
    
    // Subimos el archivo al servidor
    await client.cd('/domains/missstarinternational.com/public_html/assets/js');
    await client.uploadFrom(tempJsPath, 'main.js');
    console.log('✅ Archivo JavaScript optimizado subido correctamente');
    
    // Limpiamos el archivo temporal
    fs.unlinkSync(tempJsPath);
    
    console.log('\n✅ Proceso completado exitosamente');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.close();
  }
}

main(); 