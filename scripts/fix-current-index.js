const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('🔄 ARREGLANDO PÁGINA ACTUAL SIN REEMPLAZAR');
    console.log('=========================================');
    
    await client.access({
      host: 'web0151.zxcs.nl',
      user: process.env.DIRECT_ADMIN_USER || 'u127684p143111',
      password: process.env.DIRECT_ADMIN_PASSWORD || 'C^F]TDaQ0h579taQ2oKI|(o',
      secure: false
    });

    // 1. Descargar el archivo index.html actual
    console.log('\n1. Descargando el index.html actual...');
    const tempIndexPath = path.join(__dirname, '../temp_current_index.html');
    await client.downloadTo(tempIndexPath, '/index.html');
    console.log('✅ Index.html actual descargado');
    
    // 2. Leer el contenido del archivo
    console.log('\n2. Leyendo y modificando el contenido...');
    let indexContent = fs.readFileSync(tempIndexPath, 'utf8');
    
    // 3. Añadir la opción de vietnamita si no existe
    if (!indexContent.includes('Tiếng Việt') && !indexContent.includes('vi/')) {
      console.log('⚠️ No se encontró opción de vietnamita, añadiéndola...');
      
      // Buscar el último elemento de idioma para añadir después
      const lastLanguageMatch = indexContent.match(/<a href="th\/"[^>]*>[^<]*<\/a>/);
      
      if (lastLanguageMatch) {
        const thaiOption = lastLanguageMatch[0];
        const vietnamOption = `
        <a href="vi/" class="language-option">
            <img src="assets/images/flags/vietnam.png" alt="Tiếng Việt" class="flag">
            <span class="language-name">Tiếng Việt</span>
        </a>`;
        
        // Insertar la opción de vietnamita después de la última opción
        indexContent = indexContent.replace(thaiOption, thaiOption + vietnamOption);
        console.log('✅ Opción de vietnamita añadida');
      } else {
        console.log('❌ No se pudo encontrar el punto de inserción para vietnamita');
      }
    } else {
      console.log('✅ La opción de vietnamita ya existe');
    }
    
    // 4. Añadir código de carga de imagen forzada con jQuery
    if (!indexContent.includes('forceImageLoad') && !indexContent.includes('jquery')) {
      console.log('⚠️ Añadiendo script para forzar carga de imágenes...');
      
      const headEndMatch = indexContent.match(/<\/head>/);
      if (headEndMatch) {
        const jqueryAndForcingCode = `
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        // Función para forzar la recarga de imágenes
        function forceImageLoad() {
            $('img').each(function() {
                const imgSrc = $(this).attr('src');
                if (imgSrc) {
                    // Añadir parámetro para evitar caché
                    const newSrc = imgSrc.includes('?') ? 
                        imgSrc + '&forcecache=' + new Date().getTime() : 
                        imgSrc + '?forcecache=' + new Date().getTime();
                    
                    // Cargar imagen y reemplazar cuando esté lista
                    const newImg = new Image();
                    const imgElement = $(this);
                    
                    newImg.onload = function() {
                        imgElement.attr('src', newSrc);
                    };
                    
                    newImg.src = newSrc;
                }
            });
        }
        
        // Ejecutar cuando el documento esté listo
        $(document).ready(function() {
            // Intentar cargar imágenes forzadamente
            forceImageLoad();
            
            // Si hay problemas, intentar una URL absoluta para el logo principal
            setTimeout(function() {
                const logoImg = $('img.logo, img[alt*="Miss Star"]').first();
                if (logoImg.length && (!logoImg[0].complete || logoImg[0].naturalWidth === 0)) {
                    console.log('Usando URL de respaldo para logo');
                    logoImg.attr('src', 'https://imgur.com/kgK4DyW.png');
                }
            }, 2000);
        });
    </script>
</head>`;
        
        // Reemplazar </head> con el nuevo código
        indexContent = indexContent.replace(/<\/head>/, jqueryAndForcingCode);
        console.log('✅ Script de forzado de carga añadido');
      } else {
        console.log('❌ No se pudo encontrar la etiqueta </head>');
      }
    } else {
      console.log('✅ El script de forzado ya existe');
    }
    
    // 5. Guardar los cambios
    fs.writeFileSync(tempIndexPath, indexContent, 'utf8');
    console.log('\n3. Guardando cambios y subiendo archivo...');
    
    // 6. Subir el archivo modificado
    await client.uploadFrom(tempIndexPath, '/index.html');
    console.log('✅ Index.html modificado subido');
    
    // 7. Subir también la imagen de la bandera de Vietnam si no existe
    console.log('\n4. Verificando bandera de Vietnam...');
    
    // Primero, verificar si existe el directorio
    try {
      await client.ensureDir('/assets/images/flags');
      console.log('✅ Directorio de banderas existe');
    } catch (err) {
      console.log('⚠️ Error al verificar directorio de banderas: ' + err.message);
      
      // Intentar crear la estructura de directorios
      try {
        await client.ensureDir('/assets');
        await client.ensureDir('/assets/images');
        await client.ensureDir('/assets/images/flags');
        console.log('✅ Estructura de directorios creada');
      } catch (dirErr) {
        console.log('❌ No se pudo crear estructura de directorios: ' + dirErr.message);
      }
    }
    
    // Crear imagen de la bandera de Vietnam desde datos base64
    const vietnamFlagBase64 = `iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAEGUlEQVR4nO3cW2gdVRTA8Z+pSbQqRa0PgvjQVvEJlVrUYFVUUCloUbRoNBpjqw8iiC82qKCIYIsgIvhQH6r1rSqKgi8iiA8ufQmkpRHxhVoVRNtaW00b48NZkOt1Zu7ec8/M3jPnDwPpZO7eWXvt2XuftdcMCCGEEEIIIYQQQgghhBBCCCGEkKMZ6sZpbYw1v5+LMTTfNY+G+QqmRLrKsVhWOUYL5mFx5W9D1n0Ywww2YArHsA8HsA+T2FtJE3UPppquwBJciMuxDDNYjdMT9v0RTuIQdmMHPsM27PB/YTTaq+fhdlyJJfgNm/Ah/qjxfifjCqzFtZiHd/EaPsaeVINNMfKdjgexA1uwCmfgVNwjvlEfxrBSvmHpbJyD1Y7/nnN6Jjo94vHsETPx/ThPdPCzmKvFNu5BPCoGY5d2R7Gqmfiy7Lv6CdbiWmzFHejHNf6fpbcyF7fg+S6OsWHuVX82Mm2N2FRtlf7NPR8r8G3msaZM92lhXbYJVyRoqFO3a3Fv2SV9X762GnGXtgK5Qf7G+lnaGXDK2m7YKXPrJo4YqN6NjzI37oxeS6Eb5WuzMUOdrMiHmRt11jGiS01iiPxPrGNdx2BDVudu0BWG9LrTTm5A/kY6yXF8LD5sMzMvH8jfML3yMRbmbs1W5mBd/oap66BkH5CdkL9h6sp/qKOZQr3ejsffIpq+2tFc9+S1ImF/m4XH5N+UXb/Zr5dGl67K3xitXJ27NZt5RGS15G6INpnEOGbL2xBN9KS4n5eDZTOibUPGsXhGFNjYIn8jpM5zOVtyXi7FcfkbIlUOynwDX9eTVSrvsSDRuV5UbLhbL/tllWIgc9sOmXewzrH1Wjx3GGhjeK8K7rEnc8NuUmBhYBVvyN+4KbKnQI4yvlZOanqxL4pnmAUZfg1ex+tq5qBhyHiKN+VvQFjXUHCUW2pZPCd9xJfQFZk+/GIRSKx7MLWCTUovLKzFfXEy/zTrYN+Iq6eAd+GJOseYJ8JgU+R8ROEcM9lqZGXlGNP4Wjy7uB538v/18v3i6jqJJ/G6GvnKNfFhwwNO1+tddJro9Kp2iCvvJSLqMIUJcdWdwuOiy6wj3Wo7pnbdT/3T1Rt+xr34Re5PG7lNtK4VmdMPKliSvk5gXp0KprKoUslSl6jV9jQjXvQjPaXQE4N1Yu0QN24r5qhyKoR8zVvbUXFDm1yhQyVwpDJqTKSosjdV0Rl4FLjJNZb/kp95mznqnZryq9xXKOUMWJloXEzNn2E6xj2iXNDMnBCh8z1qhPen8vTp4kl2L1mWu8ZFuU5cqYeQRwghhBBCCCGEEEIIIYQQQgghhNBL/gGNZ5R7D54aTQAAAABJRU5ErkJggg==`;
    
    // Decodificar base64 y guardar como archivo
    const vietnamFlagPath = path.join(__dirname, '../temp_vietnam_flag.png');
    const vietnamFlagBuffer = Buffer.from(vietnamFlagBase64, 'base64');
    fs.writeFileSync(vietnamFlagPath, vietnamFlagBuffer);
    
    // Subir la bandera
    try {
      await client.uploadFrom(vietnamFlagPath, '/assets/images/flags/vietnam.png');
      console.log('✅ Bandera de Vietnam subida');
    } catch (err) {
      console.log('❌ Error al subir bandera de Vietnam: ' + err.message);
    }
    
    // 8. Limpiar archivos temporales
    fs.unlinkSync(tempIndexPath);
    fs.unlinkSync(vietnamFlagPath);
    
    console.log('\n✅ ARREGLO COMPLETADO SIN REEMPLAZAR EL ARCHIVO');
    console.log('Ahora la página debería mostrar la opción de vietnamita y forzar la carga correcta de las imágenes.');
    console.log('Para ver los cambios: https://missstarinternational.com/');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    client.close();
  }
}

main(); 