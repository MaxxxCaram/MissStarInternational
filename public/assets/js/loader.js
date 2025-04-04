/**
 * Loader.js - Gestión de carga para Miss Star International
 */

// Portal Loader - Gestiona la animación de carga inicial
class PortalLoader {
    constructor() {
        this.loader = document.getElementById('portal-loader');
        this.resources = [
            // Recursos críticos a precargar
            '/assets/css/future.css',
            '/assets/css/animations.css',
            '/assets/js/main.js',
            '/assets/js/animations.js',
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Cinzel:wght@400;700&display=swap'
        ];
        this.totalResources = this.resources.length;
        this.loadedResources = 0;
    }

    // Inicializar el loader
    init() {
        if (!this.loader) return;
        
        // Agregar clases para la animación
        this.loader.classList.add('active');
        
        // Precargar recursos
        this.preloadResources();
        
        // Establecer un tiempo mínimo para la animación de carga
        setTimeout(() => {
            this.hideLoader();
        }, 2000);
    }
    
    // Precargar recursos críticos
    preloadResources() {
        this.resources.forEach(resource => {
            if (resource.endsWith('.css')) {
                this.preloadCSS(resource);
            } else if (resource.endsWith('.js')) {
                this.preloadJS(resource);
            } else {
                this.preloadOther(resource);
            }
        });
    }
    
    // Precargar archivos CSS
    preloadCSS(url) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => this.resourceLoaded();
        link.onerror = () => this.resourceLoaded();
        document.head.appendChild(link);
    }
    
    // Precargar archivos JavaScript
    preloadJS(url) {
        const script = document.createElement('script');
        script.src = url;
        script.defer = true;
        script.onload = () => this.resourceLoaded();
        script.onerror = () => this.resourceLoaded();
        document.head.appendChild(script);
    }
    
    // Precargar otros recursos
    preloadOther(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = () => this.resourceLoaded();
        xhr.onerror = () => this.resourceLoaded();
        xhr.send();
    }
    
    // Registrar recurso cargado
    resourceLoaded() {
        this.loadedResources++;
        
        // Si todos los recursos críticos se han cargado, ocultar el loader
        if (this.loadedResources >= this.totalResources) {
            this.hideLoader();
        }
    }
    
    // Ocultar el loader con animación
    hideLoader() {
        if (!this.loader) return;
        if (this.loader.classList.contains('fade-out')) return;
        
        this.loader.classList.add('fade-out');
        setTimeout(() => {
            if (this.loader) {
                this.loader.style.display = 'none';
                // Iniciar animaciones post-carga
                this.startPostLoadAnimations();
            }
        }, 1000);
    }
    
    // Iniciar animaciones después de la carga
    startPostLoadAnimations() {
        // Animar título
        const titles = document.querySelectorAll('.title-animate');
        titles.forEach((title, index) => {
            setTimeout(() => {
                title.classList.add('animate');
            }, 200 * index);
        });
        
        // Animar tarjetas
        const cards = document.querySelectorAll('.franchise-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, 150 * index);
        });
    }
}

// Lazy Loading - Carga diferida de imágenes
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('[data-src]');
        this.options = {
            rootMargin: '0px',
            threshold: 0.1
        };
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, this.options);
            
            this.images.forEach(image => {
                imageObserver.observe(image);
            });
        } else {
            // Fallback para navegadores sin IntersectionObserver
            this.images.forEach(image => {
                this.loadImage(image);
            });
        }
    }
    
    loadImage(image) {
        const src = image.dataset.src;
        if (!src) return;
        
        if (image.tagName === 'IMG') {
            image.src = src;
        } else {
            image.style.backgroundImage = `url('${src}')`;
        }
        
        image.addEventListener('load', () => {
            image.classList.add('loaded');
        });
        
        delete image.dataset.src;
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Iniciar el portal de carga
    const portalLoader = new PortalLoader();
    portalLoader.init();
    
    // Iniciar carga diferida de imágenes
    const lazyLoader = new LazyLoader();
    lazyLoader.init();
}); 