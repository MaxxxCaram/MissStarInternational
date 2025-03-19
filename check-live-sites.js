const axios = require('axios');

// Lista de URLs a verificar
const urls = [
  'https://missstarinternational.com/',
  'https://missstarinternational.com/en/',
  'https://missstarinternational.com/es/',
  'https://missstarinternational.com/pt/',
  'https://missstarinternational.com/th/',
  'https://missstarinternational.com/vi/',
  'https://missstarinternational.com/en/conference/',
  'https://missstarinternational.com/es/conference/',
  'https://missstarinternational.com/pt/conference/',
  'https://missstarinternational.com/th/conference/',
  'https://missstarinternational.com/vi/conference/',
  'https://missstarinternational.com/assets/images/logo/logo-main1.png',
  'https://missstarinternational.com/assets/images/logo/logo.png'
];

async function checkUrl(url) {
  try {
    console.log(`Verificando: ${url}`);
    const response = await axios.get(url);
    console.log(`✅ Código ${response.status}: ${url} está funcionando correctamente`);
    return true;
  } catch (error) {
    if (error.response) {
      console.error(`❌ Error ${error.response.status}: ${url} - ${error.response.statusText}`);
    } else {
      console.error(`❌ Error: ${url} - ${error.message}`);
    }
    return false;
  }
}

async function checkAllUrls() {
  console.log('🔍 VERIFICACIÓN DE SITIOS EN VIVO');
  console.log('================================');
  
  let working = 0;
  let notWorking = 0;
  
  for (const url of urls) {
    const isWorking = await checkUrl(url);
    if (isWorking) {
      working++;
    } else {
      notWorking++;
    }
  }
  
  console.log('\nRESUMEN:');
  console.log(`✅ ${working} URLs funcionando correctamente`);
  console.log(`❌ ${notWorking} URLs con problemas`);
  console.log('================================');
}

// Ejecutar la verificación
checkAllUrls(); 