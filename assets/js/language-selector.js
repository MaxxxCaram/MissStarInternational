document.addEventListener('DOMContentLoaded', function() {
    // Crear los elementos de audio
    const hoverSound = new Audio('../assets/sounds/hover.mp3');
    const clickSound = new Audio('../assets/sounds/click.mp3');
    const switchSound = new Audio('../assets/sounds/switch.mp3');
    
    // Ajustar volumen
    [hoverSound, clickSound, switchSound].forEach(sound => {
        sound.volume = 0.2;
    });

    const body = document.body;
    
    // Crear botón toggle con efectos mejorados
    const toggleButton = document.createElement('button');
    toggleButton.className = 'lang-toggle';
    toggleButton.innerHTML = `
        <span class="toggle-icon">🌐</span>
        <span class="toggle-ripple"></span>
    `;
    toggleButton.setAttribute('data-tooltip', 'Change Language');
    body.appendChild(toggleButton);

    // Obtener el selector de idioma
    const languageSelector = document.querySelector('.language-selector');
    
    // Mapa de idiomas con información extendida
    const langMap = {
        'en': { 
            flag: '🇺🇸', 
            name: 'English',
            welcome: 'Welcome'
        },
        'es': { 
            flag: '🇪🇸', 
            name: 'Español',
            welcome: 'Bienvenido'
        },
        'pt': { 
            flag: '🇧🇷', 
            name: 'Português',
            welcome: 'Bem-vindo'
        },
        'fr': { 
            flag: '🇫🇷', 
            name: 'Français',
            welcome: 'Bienvenue'
        }
    };

    // Estado inicial con animación
    const currentPath = window.location.pathname;
    const currentLang = currentPath.split('/')[1];
    
    if (['en', 'es', 'pt', 'fr'].includes(currentLang)) {
        languageSelector.classList.add('collapsed');
        updateCurrentLang(currentLang);
        showWelcomeMessage(currentLang);
    }

    // Función para mostrar mensaje de bienvenida
    function showWelcomeMessage(lang) {
        const welcome = document.createElement('div');
        welcome.className = 'welcome-message';
        welcome.textContent = langMap[lang].welcome;
        body.appendChild(welcome);
        
        setTimeout(() => {
            welcome.classList.add('show');
            setTimeout(() => {
                welcome.classList.remove('show');
                setTimeout(() => {
                    welcome.remove();
                }, 500);
            }, 2000);
        }, 100);
    }

    // Función para actualizar el idioma actual con animación
    function updateCurrentLang(lang) {
        const currentLangDisplay = document.querySelector('.current-lang');
        if (currentLangDisplay && langMap[lang]) {
            currentLangDisplay.innerHTML = `
                <span class="lang-flag">${langMap[lang].flag}</span>
                <span class="lang-code">${lang.toUpperCase()}</span>
            `;
        }
    }

    // Toggle con efectos de sonido y animación
    function toggleLanguageSelector() {
        clickSound.play();
        
        if (languageSelector.classList.contains('collapsed')) {
            languageSelector.classList.remove('collapsed');
            languageSelector.style.animation = 'slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        } else {
            languageSelector.style.animation = 'slideOut 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            setTimeout(() => {
                languageSelector.classList.add('collapsed');
            }, 600);
        }
    }

    // Event listeners con efectos
    toggleButton.addEventListener('click', toggleLanguageSelector);
    toggleButton.addEventListener('mouseover', function() {
        hoverSound.play();
        this.style.transform = 'rotate(180deg) scale(1.1)';
    });
    toggleButton.addEventListener('mouseout', function() {
        this.style.transform = 'rotate(0) scale(1)';
    });

    // Manejar selección de idioma con efectos
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('mouseover', () => {
            hoverSound.play();
        });
        
        option.addEventListener('click', function(e) {
            switchSound.play();
            const selectedLang = this.getAttribute('href').replace('/', '');
            localStorage.setItem('selectedLanguage', selectedLang);
            
            // Efecto visual al seleccionar
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                languageSelector.style.animation = 'slideOut 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            }, 200);
        });
    });
});