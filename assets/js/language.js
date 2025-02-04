function changeLanguage() {
    const select = document.getElementById('languageSelect');
    const currentPath = window.location.pathname;
    const newLanguage = select.value;
    
    // Obtener la ruta actual sin el idioma
    const pathWithoutLang = currentPath.split('/').slice(2).join('/');
    
    // Construir la nueva URL
    const newUrl = `/${newLanguage}/${pathWithoutLang}`;
    window.location.href = newUrl;
}

// Detectar el idioma del navegador al cargar la página
function detectLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    const primaryLang = userLang.split('-')[0];
    
    // Redirigir si estamos en la raíz
    if (window.location.pathname === '/') {
        switch(primaryLang) {
            case 'es':
                window.location.href = '/es/';
                break;
            case 'en':
                window.location.href = '/en/';
                break;
            case 'pt':
                window.location.href = '/pt/';
                break;
            default:
                window.location.href = '/en/'; // Idioma por defecto
        }
    }
} 