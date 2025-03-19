const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Lista de idiomas a sincronizar (excluyendo inglés que es la referencia)
const languages = ['es', 'pt', 'th', 'vi'];

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

// Traduce los textos según el idioma
function translateTexts(content, language) {
  let result = content;
  
  // Cambiar el atributo lang
  result = result.replace('<html lang="en">', `<html lang="${language}">`);
  
  // Traducciones comunes
  const translations = {
    es: {
      '<title>Miss Star International - A New Dynasty</title>': '<title>Miss Star International - Una Nueva Dinastía</title>',
      '>About</a>': '>Sobre Nosotros</a>',
      '>Franchises</a>': '>Franquicias</a>',
      '>History</a>': '>Historia</a>',
      '>Contact</a>': '>Contacto</a>',
      'A New Dynasty of Beauty and Empowerment': 'Una Nueva Dinastía de Belleza y Empoderamiento',
      'Current Winner': 'Ganadora Actual',
      'Meet our reigning queen': 'Conoce a nuestra reina vigente',
      'View Profile': 'Ver Perfil',
      'About Miss Star International': 'Sobre Miss Star International',
      'Our Mission': 'Nuestra Misión',
      'Our Global Franchises': 'Nuestras Franquicias Globales',
      'Our History': 'Nuestra Historia',
      'Contact Us': 'Contáctanos'
    },
    pt: {
      '<title>Miss Star International - A New Dynasty</title>': '<title>Miss Star International - Uma Nova Dinastia</title>',
      '>About</a>': '>Sobre Nós</a>',
      '>Franchises</a>': '>Franquias</a>',
      '>History</a>': '>História</a>',
      '>Contact</a>': '>Contato</a>',
      'A New Dynasty of Beauty and Empowerment': 'Uma Nova Dinastia de Beleza e Empoderamento',
      'Current Winner': 'Vencedora Atual',
      'Meet our reigning queen': 'Conheça nossa rainha reinante',
      'View Profile': 'Ver Perfil',
      'About Miss Star International': 'Sobre Miss Star International',
      'Our Mission': 'Nossa Missão',
      'Our Global Franchises': 'Nossas Franquias Globais',
      'Our History': 'Nossa História',
      'Contact Us': 'Contate-nos'
    },
    th: {
      '<title>Miss Star International - A New Dynasty</title>': '<title>Miss Star International - ราชวงศ์ใหม่</title>',
      '>About</a>': '>เกี่ยวกับเรา</a>',
      '>Franchises</a>': '>แฟรนไชส์</a>',
      '>History</a>': '>ประวัติ</a>',
      '>Contact</a>': '>ติดต่อ</a>'
    },
    vi: {
      '<title>Miss Star International - A New Dynasty</title>': '<title>Miss Star International - Một Triều Đại Mới</title>',
      '>About</a>': '>Giới Thiệu</a>',
      '>Franchises</a>': '>Nhượng Quyền</a>',
      '>History</a>': '>Lịch Sử</a>',
      '>Contact</a>': '>Liên Hệ</a>'
    }
  };
  
  // Aplicar traducciones para el idioma específico
  if (translations[language]) {
    const langTranslations = translations[language];
    for (const [original, translation] of Object.entries(langTranslations)) {
      // Usar una expresión regular para reemplazar todas las ocurrencias
      const regex = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, translation);
    }
  }
  
  return result;
}

async function syncPages() {
  let client = null;
  
  try {
    console.log('🔄 SINCRONIZANDO TODAS LAS PÁGINAS ENTRE IDIOMAS');
    console.log('================================================');
    
    client = await connectFTP();
    
    // Lista de páginas a sincronizar
    const pages = [
      'index.html',
      'conference/index.html'
    ];
    
    // Para cada página, sincronizar entre idiomas
    for (const page of pages) {
      console.log(`\n📄 Sincronizando: ${page}`);
      
      // Ruta para la página en inglés (referencia)
      const enPagePath = `/en/${page}`;
      
      // Descargar la página en inglés
      const tempEnFile = path.join(__dirname, `../temp_en_${path.basename(page)}`);
      if (await downloadFile(client, enPagePath, tempEnFile)) {
        // Leer contenido
        const enContent = fs.readFileSync(tempEnFile, 'utf8');
        
        // Para cada idioma, adaptar y subir
        for (const lang of languages) {
          console.log(`\n- Procesando idioma: ${lang.toUpperCase()}`);
          
          // Adaptar el contenido al idioma
          const adaptedContent = translateTexts(enContent, lang);
          
          // Guardar temporalmente el archivo adaptado
          const tempLangFile = path.join(__dirname, `../temp_${lang}_${path.basename(page)}`);
          fs.writeFileSync(tempLangFile, adaptedContent, 'utf8');
          
          // Subir el archivo adaptado
          const langPagePath = `/${lang}/${page}`;
          await uploadFile(client, tempLangFile, langPagePath);
          
          // Eliminar el archivo temporal
          fs.unlinkSync(tempLangFile);
        }
        
        // Eliminar el archivo temporal en inglés
        fs.unlinkSync(tempEnFile);
      }
    }
    
    console.log('\n✅ SINCRONIZACIÓN COMPLETADA CON ÉXITO');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    if (client) {
      client.close();
    }
  }
}

// Ejecutar la sincronización
syncPages(); 