document.addEventListener('DOMContentLoaded', () => {
    initPortalLoader();
    initParticles();
    // Inicializar video de fondo si existe
    const videoBackground = document.getElementById('video-background');
    if (videoBackground) {
        videoBackground.play().catch(function(error) {
            console.log("Video autoplay failed:", error);
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

    // Animación del mensaje de bienvenida
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.style.opacity = '1';
        welcomeMessage.style.transform = 'translateY(0)';
    }

    // Efecto de scroll en la navegación
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.nav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            } else {
                nav.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            }
        }
    });

    // Interceptar errores de red silenciosamente
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    console.log('Miss Star International - Sitio web cargado correctamente');
});