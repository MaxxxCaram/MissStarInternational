document.addEventListener('DOMContentLoaded', () => {
    // Initialize video background
    const video = document.getElementById('heroVideo');
    if (video) {
        video.play().catch(function(error) {
            console.log("Video autoplay failed:", error);
        });
    }

    const languageSelector = document.querySelector('.language-select');
    
    // Verificar si ya hay un idioma seleccionado
    const selectedLang = localStorage.getItem('selectedLanguage');
    if (selectedLang && languageSelector) {
        // Solo ocultar si estamos en la página principal
        if (window.location.pathname === '/' || 
            window.location.pathname.endsWith('index.html')) {
            languageSelector.style.opacity = '0';
            languageSelector.style.visibility = 'hidden';
            setTimeout(() => {
                window.location.href = `${selectedLang}/`;
            }, 300);
        }
    }

    // Manejar clics en los selectores de idioma
    document.querySelectorAll('.language-item').forEach(item => {
        item.addEventListener('click', function(e) {
            localStorage.setItem('selectedLanguage', this.dataset.lang);
            languageSelector.style.opacity = '0';
            languageSelector.style.visibility = 'hidden';
        });
    });

    // Welcome messages animation
    const welcomeMessages = document.querySelectorAll('.welcome-messages h1');
    welcomeMessages.forEach((message, index) => {
        message.style.animationDelay = `${0.5 + (index * 0.5)}s`;
    });

    // Navegación
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Interceptar errores de red silenciosamente
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // Verificar que todas las imágenes de banderas estén cargadas
    const flags = document.querySelectorAll('.flag');
    flags.forEach(flag => {
        flag.onerror = function() {
            console.log('Error al cargar bandera:', flag.src);
            // Reemplazar con un color de fondo como fallback
            flag.style.backgroundColor = '#333';
            flag.style.border = '1px solid #D4AF37';
            return true;
        };
    });

    console.log('Miss Star International - Sitio web cargado correctamente');
});