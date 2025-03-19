const axios = require('axios');

async function checkUrl(url) {
  try {
    console.log(`Verificando acceso a: ${url}`);
    const response = await axios.head(url);
    console.log(`✅ Código: ${response.status} - ${response.statusText}`);
    return true;
  } catch (error) {
    if (error.response) {
      console.error(`❌ Error ${error.response.status}: ${error.response.statusText}`);
    } else {
      console.error(`❌ Error: ${error.message}`);
    }
    return false;
  }
}

async function main() {
  const urls = [
    'https://missstarinternational.com',
    'https://missstarinternational.com/en/conference/',
    'https://missstarinternational.com/es/conference/',
    'https://missstarinternational.com/pt/conference/',
    'https://missstarinternational.com/th/conference/',
    'https://missstarinternational.com/vi/conference/'
  ];

  console.log('Verificando accesibilidad de sitios web...');

  for (const url of urls) {
    await checkUrl(url);
  }

  console.log('Verificación completa!');
}

main().catch(error => {
  console.error('Error general:', error);
  process.exit(1);
}); 