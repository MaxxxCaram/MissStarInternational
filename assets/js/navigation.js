/**
 * Miss Star International - Navigation JS
 * Este archivo maneja el menú móvil, efectos de navegación y funcionalidades relacionadas
 */

class FutureNavigation {
    constructor(options = {}) {
        // Opciones por defecto
        this.options = {
            headerSelector: '.site-header',
            mobileToggleSelector: '.mobile-menu-toggle',
            mainNavSelector: '.main-nav',
            dropdownSelector: '.dropdown',
            dropdownToggleSelector: '.dropdown-toggle',
            dropdownMenuSelector: '.dropdown-menu',
            scrollThreshold: 50,
            mobileBreakpoint: 992,
            ...options
        };
        
        // Referencias DOM
        this.header = document.querySelector(this.options.headerSelector);
        this.mobileToggle = document.querySelector(this.options.mobileToggleSelector);
        this.mainNav = document.querySelector(this.options.mainNavSelector);
        this.dropdowns = document.querySelectorAll(this.options.dropdownSelector);
        
        // Estado
        this.isMobile = window.innerWidth < this.options.mobileBreakpoint;
        this.isMenuOpen = false;
        
        // Inicializar
        this.init();
    }
    
    /**
     * Inicializar la navegación
     */
    init() {
        if (!this.header || !this.mainNav) return;
        
        // Configurar menú móvil
        this.setupMobileMenu();
        
        // Configurar dropdowns
        this.setupDropdowns();
        
        // Configurar eventos de scroll
        this.setupScrollEvents();
        
        // Configurar eventos de resize
        this.setupResizeEvents();
        
        // Configurar eventos de links
        this.setupLinkEvents();
        
        console.log('Navigation initialized');
    }
    
    /**
     * Configurar menú móvil
     */
    setupMobileMenu() {
        if (!this.mobileToggle) return;
        
        this.mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Ajustar estado inicial basado en clases
        if (this.mainNav.classList.contains('active')) {
            this.isMenuOpen = true;
        }
    }
    
    /**
     * Alternar menú móvil
     */
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    /**
     * Abrir menú móvil
     */
    openMobileMenu() {
        if (!this.mainNav || !this.mobileToggle) return;
        
        // Activar toggle
        this.mobileToggle.classList.add('active');
        this.mobileToggle.setAttribute('aria-expanded', 'true');
        
        // Mostrar menú con animación
        this.mainNav.classList.add('active');
        
        // Animar los elementos del menú
        const menuItems = this.mainNav.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.animation = `fadeInRight 0.5s ease forwards ${index * 0.1}s`;
        });
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        // Actualizar estado
        this.isMenuOpen = true;
        
        // Disparar evento custom
        this.dispatchEvent('menuOpened');
    }
    
    /**
     * Cerrar menú móvil
     */
    closeMobileMenu() {
        if (!this.mainNav || !this.mobileToggle) return;
        
        // Desactivar toggle
        this.mobileToggle.classList.remove('active');
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        
        // Resetear animaciones
        const menuItems = this.mainNav.querySelectorAll('li');
        menuItems.forEach(item => {
            item.style.animation = 'none';
        });
        
        // Ocultar menú con animación
        this.mainNav.classList.remove('active');
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        // Actualizar estado
        this.isMenuOpen = false;
        
        // Cerrar dropdowns abiertos
        this.closeAllDropdowns();
        
        // Disparar evento custom
        this.dispatchEvent('menuClosed');
    }
    
    /**
     * Configurar dropdowns
     */
    setupDropdowns() {
        if (!this.dropdowns.length) return;
        
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector(this.options.dropdownToggleSelector);
            const menu = dropdown.querySelector(this.options.dropdownMenuSelector);
            
            if (!toggle || !menu) return;
            
            // En móvil, usar click para mostrar/ocultar
            toggle.addEventListener('click', (e) => {
                if (this.isMobile) {
                    e.preventDefault();
                    this.toggleDropdown(dropdown);
                }
            });
            
            // En desktop, usar hover
            if (!this.isMobile) {
                dropdown.addEventListener('mouseenter', () => {
                    this.openDropdown(dropdown);
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    this.closeDropdown(dropdown);
                });
            }
        });
    }
    
    /**
     * Alternar dropdown
     * @param {HTMLElement} dropdown - Elemento dropdown
     */
    toggleDropdown(dropdown) {
        if (dropdown.classList.contains('active')) {
            this.closeDropdown(dropdown);
        } else {
            // Cerrar otros dropdowns
            this.dropdowns.forEach(item => {
                if (item !== dropdown) {
                    this.closeDropdown(item);
                }
            });
            
            this.openDropdown(dropdown);
        }
    }
    
    /**
     * Abrir dropdown
     * @param {HTMLElement} dropdown - Elemento dropdown
     */
    openDropdown(dropdown) {
        if (!dropdown) return;
        
        const toggle = dropdown.querySelector(this.options.dropdownToggleSelector);
        const menu = dropdown.querySelector(this.options.dropdownMenuSelector);
        
        if (!toggle || !menu) return;
        
        // Activar dropdown
        dropdown.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        menu.classList.add('active');
    }
    
    /**
     * Cerrar dropdown
     * @param {HTMLElement} dropdown - Elemento dropdown
     */
    closeDropdown(dropdown) {
        if (!dropdown) return;
        
        const toggle = dropdown.querySelector(this.options.dropdownToggleSelector);
        const menu = dropdown.querySelector(this.options.dropdownMenuSelector);
        
        if (!toggle || !menu) return;
        
        // Desactivar dropdown
        dropdown.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
    }
    
    /**
     * Cerrar todos los dropdowns
     */
    closeAllDropdowns() {
        this.dropdowns.forEach(dropdown => {
            this.closeDropdown(dropdown);
        });
    }
    
    /**
     * Configurar eventos de scroll
     */
    setupScrollEvents() {
        if (!this.header) return;
        
        // Detectar scroll para cambiar estilo del header
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Comprobar estado inicial
        this.handleScroll();
        
        // Actualizar links activos basados en sección visible
        window.addEventListener('scroll', this.debounce(() => {
            this.updateActiveLinks();
        }, 100));
        
        // Comprobar links activos inicialmente
        this.updateActiveLinks();
    }
    
    /**
     * Manejar evento de scroll
     */
    handleScroll() {
        if (!this.header) return;
        
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (scrollY > this.options.scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
    
    /**
     * Actualizar links activos basados en sección visible
     */
    updateActiveLinks() {
        if (!this.mainNav) return;
        
        // Obtener todos los links de navegación
        const navLinks = this.mainNav.querySelectorAll('a[href^="#"]');
        if (!navLinks.length) return;
        
        // Obtener secciones objetivo
        const scrollPosition = window.scrollY || window.pageYOffset;
        
        // Encontrar la sección actualmente visible
        navLinks.forEach(link => {
            const sectionId = link.getAttribute('href');
            if (sectionId === '#') return;
            
            const section = document.querySelector(sectionId);
            if (!section) return;
            
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Eliminar active de todos los links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Añadir active al link actual
                link.classList.add('active');
                
                // También marcar como activo el dropdown padre si existe
                const parentDropdown = link.closest(this.options.dropdownSelector);
                if (parentDropdown) {
                    const parentLink = parentDropdown.querySelector(this.options.dropdownToggleSelector);
                    if (parentLink) parentLink.classList.add('active');
                }
            }
        });
    }
    
    /**
     * Configurar eventos de resize
     */
    setupResizeEvents() {
        window.addEventListener('resize', this.debounce(() => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth < this.options.mobileBreakpoint;
            
            // Si cambió el estado de móvil/desktop
            if (wasMobile !== this.isMobile) {
                // Resetear estado del menú en cambio de modo
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // Reconfigurar comportamiento de dropdowns
                this.setupDropdowns();
            }
        }, 100));
    }
    
    /**
     * Configurar eventos de links
     */
    setupLinkEvents() {
        if (!this.mainNav) return;
        
        // Smooth scroll para links internos
        const internalLinks = this.mainNav.querySelectorAll('a[href^="#"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href !== '#') {
                    e.preventDefault();
                    
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        // Cerrar menú móvil si está abierto
                        if (this.isMenuOpen) {
                            this.closeMobileMenu();
                        }
                        
                        // Scroll suave a la sección
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    /**
     * Helper: Debounce para optimizar eventos
     * @param {Function} func - Función a ejecutar
     * @param {number} wait - Tiempo de espera en ms
     * @returns {Function} - Función con debounce
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Helper: Disparar evento custom
     * @param {string} name - Nombre del evento
     * @param {Object} detail - Datos adicionales
     */
    dispatchEvent(name, detail = {}) {
        const event = new CustomEvent(`navigation:${name}`, {
            bubbles: true,
            detail: { navigation: this, ...detail }
        });
        
        document.dispatchEvent(event);
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    window.siteNavigation = new FutureNavigation();
}); 