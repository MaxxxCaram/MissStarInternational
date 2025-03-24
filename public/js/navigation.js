/**
 * Miss Star International - Navigation.js
 * Maneja la navegación, menú móvil y efectos de scroll
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar los componentes de navegación cuando se carga el DOM
    const navigation = new FutureNavigation();
    navigation.init();
});

class FutureNavigation {
    constructor() {
        // Elementos del DOM
        this.header = document.querySelector('.site-header');
        this.hamburger = document.querySelector('.hamburger');
        this.mainNav = document.querySelector('.main-nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.langSelector = document.querySelector('.lang-selector');
        this.currentLang = document.querySelector('.current-lang');
        this.langOptions = document.querySelector('.lang-options');
        
        // Estado de la navegación
        this.isMobileMenuOpen = false;
        this.lastScrollPosition = 0;
        this.isScrollingDown = false;
        
        // Sonidos (si se implementa audio)
        this.sounds = {
            menuOpen: null,
            menuClose: null,
            hover: null,
            select: null
        };
        
        // Configuración
        this.config = {
            scrollThreshold: 100, // Px para considerar que el usuario ha hecho scroll
            headerCompactClass: 'scrolled',
            mobileMenuActiveClass: 'active',
            navItemActiveClass: 'active',
            enableSounds: false // Activar/desactivar sonidos
        };
    }
    
    /**
     * Inicializa la navegación
     */
    init() {
        console.log('Initializing navigation system...');
        
        // Configurar listeners de eventos
        this.setupEventListeners();
        
        // Verificar scroll inicial
        this.handleScroll();
        
        // Marcar el ítem activo en la navegación
        this.updateActiveNavItem();
        
        // Inicializar efectos especiales
        this.initNavEffects();
        
        // Precargar sonidos si están habilitados
        if (this.config.enableSounds) {
            this.preloadSounds();
        }
    }
    
    /**
     * Configurar listeners de eventos
     */
    setupEventListeners() {
        // Evento de scroll
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100));
        
        // Evento de clic en hamburguesa para móvil
        if (this.hamburger) {
            this.hamburger.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Eventos para enlaces de navegación
        this.navLinks.forEach(link => {
            // Hover para efectos visuales
            link.addEventListener('mouseenter', this.handleNavLinkHover.bind(this));
            
            // Clic para navegación suave
            link.addEventListener('click', this.handleNavLinkClick.bind(this));
        });
        
        // Eventos para selector de idioma
        if (this.langSelector) {
            this.langSelector.addEventListener('mouseenter', this.handleLangSelectorHover.bind(this));
            this.langSelector.addEventListener('mouseleave', this.handleLangSelectorLeave.bind(this));
            
            if (this.langOptions) {
                const options = this.langOptions.querySelectorAll('.lang-option');
                options.forEach(option => {
                    option.addEventListener('click', this.handleLangOptionClick.bind(this));
                });
            }
        }
        
        // Evento de redimensionamiento para móvil
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 200));
    }
    
    /**
     * Manejar evento de scroll
     */
    handleScroll() {
        const scrollPosition = window.scrollY;
        
        // Detectar dirección de scroll
        this.isScrollingDown = scrollPosition > this.lastScrollPosition;
        this.lastScrollPosition = scrollPosition;
        
        // Aplicar clase "scrolled" al header cuando el usuario ha hecho scroll
        if (scrollPosition > this.config.scrollThreshold) {
            this.header.classList.add(this.config.headerCompactClass);
            
            // Opcional: ocultar header al hacer scroll hacia abajo en móvil
            // if (this.isScrollingDown && window.innerWidth < 768) {
            //     this.header.style.transform = 'translateY(-100%)';
            // } else {
            //     this.header.style.transform = 'translateY(0)';
            // }
        } else {
            this.header.classList.remove(this.config.headerCompactClass);
            // this.header.style.transform = 'translateY(0)';
        }
        
        // Actualizar ítem activo en la navegación basado en la sección visible
        this.updateActiveNavItem();
    }
    
    /**
     * Alternar menú móvil
     */
    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        if (this.hamburger) {
            this.hamburger.classList.toggle(this.config.mobileMenuActiveClass, this.isMobileMenuOpen);
        }
        
        if (this.mainNav) {
            this.mainNav.classList.toggle(this.config.mobileMenuActiveClass, this.isMobileMenuOpen);
        }
        
        // Reproducir sonido si está habilitado
        if (this.config.enableSounds) {
            this.playSound(this.isMobileMenuOpen ? 'menuOpen' : 'menuClose');
        }
        
        // Prevenir scroll del cuerpo cuando el menú está abierto
        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }
    
    /**
     * Manejador de hover en enlaces de navegación
     * @param {Event} event - Evento mouseenter
     */
    handleNavLinkHover(event) {
        // Reproducir sonido de hover si está habilitado
        if (this.config.enableSounds) {
            this.playSound('hover');
        }
        
        // Se pueden añadir efectos visuales adicionales aquí
        const link = event.currentTarget;
        
        // Crear efecto de resplandor temporal
        const glowEffect = document.createElement('div');
        glowEffect.className = 'nav-glow-effect';
        link.appendChild(glowEffect);
        
        // Remover el efecto después de la animación
        setTimeout(() => {
            if (link.contains(glowEffect)) {
                link.removeChild(glowEffect);
            }
        }, 600);
    }
    
    /**
     * Manejador de clic en enlaces de navegación
     * @param {Event} event - Evento click
     */
    handleNavLinkClick(event) {
        const link = event.currentTarget;
        const href = link.getAttribute('href');
        
        // Comprobar si es un enlace de anclaje
        if (href.startsWith('#') && href.length > 1) {
            event.preventDefault();
            
            // Reproducir sonido si está habilitado
            if (this.config.enableSounds) {
                this.playSound('select');
            }
            
            // Cerrar menú móvil si está abierto
            if (this.isMobileMenuOpen) {
                this.toggleMobileMenu();
            }
            
            // Obtener el elemento objetivo
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calcular posición considerando el header fijo
                const headerHeight = this.header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                // Scroll suave hasta la sección
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    /**
     * Actualizar ítem activo en la navegación basado en la sección visible
     */
    updateActiveNavItem() {
        // Obtener la posición actual de scroll
        const scrollPosition = window.scrollY + (this.header.offsetHeight + 50);
        
        // Encontrar qué sección está actualmente visible
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Solo procesar enlaces de anclaje
            if (href && href.startsWith('#') && href.length > 1) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const targetPosition = targetElement.offsetTop;
                    const targetHeight = targetElement.offsetHeight;
                    
                    // Verificar si la sección está visible
                    if (scrollPosition >= targetPosition && 
                        scrollPosition < (targetPosition + targetHeight)) {
                        // Marcar como activo
                        link.classList.add(this.config.navItemActiveClass);
                    } else {
                        // Remover activo
                        link.classList.remove(this.config.navItemActiveClass);
                    }
                }
            }
        });
    }
    
    /**
     * Manejador de hover en selector de idioma
     */
    handleLangSelectorHover() {
        // Ya manejado por CSS, pero se puede añadir efectos adicionales
    }
    
    /**
     * Manejador de salida de selector de idioma
     */
    handleLangSelectorLeave() {
        // Ya manejado por CSS, pero se puede añadir efectos adicionales
    }
    
    /**
     * Manejador de clic en opción de idioma
     * @param {Event} event - Evento click
     */
    handleLangOptionClick(event) {
        const option = event.currentTarget;
        const lang = option.textContent.trim();
        
        // Actualizar el idioma seleccionado
        if (this.currentLang) {
            this.currentLang.textContent = lang;
        }
        
        // Reproducir sonido si está habilitado
        if (this.config.enableSounds) {
            this.playSound('select');
        }
        
        // La navegación real se maneja a través del href del enlace
    }
    
    /**
     * Manejar cambios de tamaño de ventana
     */
    handleResize() {
        // Verificar si el menú móvil debe cerrarse al cambiar a desktop
        if (window.innerWidth > 768 && this.isMobileMenuOpen) {
            this.isMobileMenuOpen = false;
            
            if (this.hamburger) {
                this.hamburger.classList.remove(this.config.mobileMenuActiveClass);
            }
            
            if (this.mainNav) {
                this.mainNav.classList.remove(this.config.mobileMenuActiveClass);
            }
            
            // Restaurar scroll
            document.body.style.overflow = '';
        }
    }
    
    /**
     * Precargar sonidos para la navegación
     */
    preloadSounds() {
        if (!window.Audio) return;
        
        // Definir rutas a los sonidos
        const soundPaths = {
            menuOpen: '../assets/sounds/menu-open.mp3',
            menuClose: '../assets/sounds/menu-close.mp3',
            hover: '../assets/sounds/hover.mp3',
            select: '../assets/sounds/select.mp3'
        };
        
        // Cargar cada sonido
        Object.keys(soundPaths).forEach(key => {
            this.sounds[key] = new Audio(soundPaths[key]);
            this.sounds[key].load();
        });
    }
    
    /**
     * Reproducir un sonido específico
     * @param {string} soundName - Nombre del sonido a reproducir
     */
    playSound(soundName) {
        if (this.sounds[soundName] && this.sounds[soundName].readyState >= 2) {
            // Clonar el sonido para permitir reproducción simultánea
            const sound = this.sounds[soundName].cloneNode();
            sound.volume = 0.3; // Volumen bajo
            sound.play().catch(err => console.warn('Error al reproducir sonido:', err));
        }
    }
    
    /**
     * Inicializar efectos especiales para la navegación
     */
    initNavEffects() {
        // Añadir clase para activar efectos CSS
        if (this.header) {
            this.header.classList.add('future-nav-initialized');
        }
        
        // Añadir elementos decorativos
        if (this.navLinks) {
            this.navLinks.forEach(link => {
                // Añadir partículas de brillo al hover
                link.addEventListener('mouseenter', this.createParticleEffect.bind(this));
            });
        }
    }
    
    /**
     * Crear efecto de partículas para hover
     * @param {Event} event - Evento mouseenter
     */
    createParticleEffect(event) {
        const element = event.currentTarget;
        const rect = element.getBoundingClientRect();
        
        // Crear 5-10 partículas
        const particleCount = 5 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'nav-particle';
            
            // Posición inicial aleatoria dentro del elemento
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            
            // Establecer propiedades de la partícula
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty('--size', `${2 + Math.random() * 3}px`);
            particle.style.setProperty('--travel-distance', `${20 + Math.random() * 30}px`);
            particle.style.setProperty('--travel-direction', `${Math.random() * 360}deg`);
            particle.style.setProperty('--fade-delay', `${Math.random() * 300}ms`);
            
            // Añadir al body
            document.body.appendChild(particle);
            
            // Remover después de la animación
            setTimeout(() => {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    /**
     * Función throttle para limitar llamadas a funciones
     * @param {Function} func - Función a limitar
     * @param {number} delay - Retardo en ms
     * @returns {Function} - Función limitada
     */
    throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return func(...args);
        };
    }
}

// Estilos adicionales para efectos de navegación
document.addEventListener('DOMContentLoaded', () => {
    // Añadir estilos CSS para partículas
    const style = document.createElement('style');
    style.textContent = `
        .nav-particle {
            position: fixed;
            width: var(--size, 3px);
            height: var(--size, 3px);
            background: var(--primary-color, #00ffff);
            border-radius: 50%;
            z-index: 1000;
            pointer-events: none;
            opacity: 1;
            box-shadow: 0 0 6px var(--primary-color, #00ffff);
            animation: 
                particle-travel 0.6s ease-out forwards,
                particle-fade 0.6s ease-out var(--fade-delay, 0ms) forwards;
        }
        
        @keyframes particle-travel {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(
                    calc(cos(var(--travel-direction, 0deg)) * var(--travel-distance, 20px)),
                    calc(sin(var(--travel-direction, 0deg)) * var(--travel-distance, 20px))
                );
            }
        }
        
        @keyframes particle-fade {
            0% {
                opacity: 1;
            }
            100% {
                opacity: 0;
            }
        }
        
        .nav-glow-effect {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--primary-rgb), 0) 70%);
            border-radius: 4px;
            opacity: 0;
            animation: nav-glow 0.6s ease-out forwards;
            pointer-events: none;
        }
        
        @keyframes nav-glow {
            0% {
                opacity: 0;
                transform: scale(0.8);
            }
            50% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: scale(1.5);
            }
        }
    `;
    
    document.head.appendChild(style);
}); 