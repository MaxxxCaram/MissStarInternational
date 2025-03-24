/**
 * LOADER.JS - Sistema de carga avanzado para Miss Star International
 * Portal loader, precarga de recursos y lazy loading de imágenes
 */

// Clase principal para gestionar la carga del portal
class PortalLoader {
  constructor() {
    // Elemento loader
    this.loaderElement = document.getElementById('portal-loader');
    
    // Estado de carga
    this.isLoading = true;
    this.loadingProgress = 0;
    this.resourcesLoaded = 0;
    this.totalResources = 0;
    
    // Recursos críticos a precargar
    this.criticalResources = {
      css: [
        'css/future.css',
        'css/animations.css'
      ],
      js: [
        'js/animations.js',
        'js/particles.js',
        'js/main.js'
      ],
      fonts: [
        'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Exo+2:wght@300;400;700&display=swap'
      ],
      images: []
    };
    
    // Tiempo mínimo de visualización del loader
    this.minLoaderTime = 2000;
    this.startTime = Date.now();
    
    // Componentes del loader
    this.portalCircle = this.loaderElement ? this.loaderElement.querySelector('.portal-circle') : null;
    this.hologramText = this.loaderElement ? this.loaderElement.querySelector('.hologram-text') : null;
    
    // Detectar navegación interna
    this.isInternalNavigation = document.referrer.includes(window.location.hostname);
    
    // Inicializar el detector de recursos fallidos
    this.failedResources = [];
    this.maxRetries = 2;
    
    // Buscar imágenes críticas en el DOM
    this.findCriticalImages();
    
    // Iniciar el proceso de carga
    this.initialize();
  }
  
  /**
   * Busca imágenes críticas en el DOM que deben precargarse
   */
  findCriticalImages() {
    // Buscar imágenes en el hero y logo
    const criticalSelectors = [
      '.hero-logo img', 
      '.nav-logo img',
      '.hero-section img',
      '.franchise-flag img'
    ];
    
    criticalSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !this.criticalResources.images.includes(src)) {
          this.criticalResources.images.push(src);
        }
      });
    });
  }
  
  /**
   * Inicializa el sistema de carga
   */
  initialize() {
    console.log('Initializing portal loader...');
    
    // Calcular el número total de recursos
    this.countTotalResources();
    
    // Actualizar el texto con el total de recursos
    this.updateLoaderText(`INITIALIZING... 0/${this.totalResources}`);
    
    // Empezar a precargar recursos
    this.preloadResources();
    
    // Inicializar carga progresiva de imágenes
    this.initLazyLoading();
  }
  
  /**
   * Cuenta el número total de recursos a cargar
   */
  countTotalResources() {
    let count = 0;
    
    // Contar todos los recursos
    Object.keys(this.criticalResources).forEach(type => {
      count += this.criticalResources[type].length;
    });
    
    this.totalResources = count;
    console.log(`Total critical resources to load: ${this.totalResources}`);
  }
  
  /**
   * Actualiza el texto mostrado en el loader
   */
  updateLoaderText(text) {
    if (this.hologramText) {
      this.hologramText.textContent = text;
    }
  }
  
  /**
   * Actualiza el progreso de carga
   */
  updateProgress() {
    this.resourcesLoaded++;
    const percentage = Math.round((this.resourcesLoaded / this.totalResources) * 100);
    
    this.updateLoaderText(`LOADING... ${this.resourcesLoaded}/${this.totalResources}`);
    
    console.log(`Resource loaded: ${this.resourcesLoaded}/${this.totalResources} (${percentage}%)`);
    
    // Comprobar si todos los recursos se han cargado
    if (this.resourcesLoaded >= this.totalResources) {
      this.finishLoading();
    }
  }
  
  /**
   * Precargar todos los recursos críticos
   */
  preloadResources() {
    // Precargar CSS
    this.criticalResources.css.forEach(url => {
      this.preloadCSS(url);
    });
    
    // Precargar JS
    this.criticalResources.js.forEach(url => {
      this.preloadJS(url);
    });
    
    // Precargar fuentes
    this.criticalResources.fonts.forEach(url => {
      this.preloadFont(url);
    });
    
    // Precargar imágenes
    this.criticalResources.images.forEach(url => {
      this.preloadImage(url);
    });
  }
  
  /**
   * Precargar archivo CSS
   */
  preloadCSS(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    
    link.onload = () => this.updateProgress();
    link.onerror = () => this.handleLoadError(url);
    
    document.head.appendChild(link);
  }
  
  /**
   * Precargar archivo JavaScript
   */
  preloadJS(url) {
    const script = document.createElement('script');
    script.src = url;
    
    script.onload = () => this.updateProgress();
    script.onerror = () => this.handleLoadError(url);
    
    document.body.appendChild(script);
  }
  
  /**
   * Precargar fuente
   */
  preloadFont(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    
    link.onload = () => this.updateProgress();
    link.onerror = () => this.handleLoadError(url);
    
    document.head.appendChild(link);
  }
  
  /**
   * Precargar imagen
   */
  preloadImage(url) {
    const img = new Image();
    img.src = url;
    
    img.onload = () => this.updateProgress();
    img.onerror = () => this.handleLoadError(url);
  }
  
  /**
   * Manejar errores de carga
   */
  handleLoadError(url) {
    console.error(`Failed to load resource: ${url}`);
    
    // Intentar cargar de nuevo una vez
    setTimeout(() => {
      console.log(`Retrying to load: ${url}`);
      
      if (url.endsWith('.css')) {
        this.preloadCSS(url);
      } else if (url.endsWith('.js')) {
        this.preloadJS(url);
      } else if (url.includes('fonts.googleapis')) {
        this.preloadFont(url);
      } else {
        this.preloadImage(url);
      }
    }, 1000);
    
    // Actualizar progreso de todos modos para no bloquear
    this.updateProgress();
  }
  
  /**
   * Finalizar la carga y mostrar el contenido
   */
  finishLoading() {
    console.log('All critical resources loaded!');
    
    // Cambiar texto a "PORTAL READY"
    this.updateLoaderText('PORTAL READY');
    
    // Esperar un momento para mostrar "PORTAL READY" y luego ocultar el loader
    setTimeout(() => {
      // Agregar clase para iniciar la animación de salida
      if (this.loaderElement) {
        this.loaderElement.style.opacity = '0';
        
        // Eliminar el loader después de la animación
        setTimeout(() => {
          if (this.loaderElement) {
            this.loaderElement.style.display = 'none';
            
            // Disparar evento para indicar que la carga está completa
            window.dispatchEvent(new CustomEvent('load-complete'));
            
            console.log('Portal loader complete, site ready!');
          }
        }, 500);
      }
    }, 800);
  }
  
  /**
   * Inicializar carga diferida para imágenes no críticas
   */
  initLazyLoading() {
    // Inicializar después de que los recursos críticos se hayan cargado
    window.addEventListener('load-complete', () => {
      const lazyLoader = new LazyLoader();
    });
  }
  
  /**
   * Actualiza la interfaz del loader con el progreso actual
   */
  updateLoaderUI() {
    if (!this.loaderElement) return;
    
    // Actualizar texto de progreso
    if (this.hologramText) {
      this.hologramText.textContent = `INICIANDO ${Math.floor(this.loadingProgress * 100)}%`;
    }
    
    // Animar círculo del portal
    if (this.portalCircle) {
      const intensity = 20 + (this.loadingProgress * 30);
      this.portalCircle.style.boxShadow = `inset 0 0 ${intensity}px var(--primary-color), 0 0 ${intensity}px var(--primary-color)`;
    }
  }
  
  /**
   * Oculta el loader con animación
   */
  hideLoader() {
    if (!this.loaderElement || !this.isLoading) return;
    this.isLoading = false;
    
    // Agregar clase para animar desaparición
    this.loaderElement.classList.add('fade-out');
    
    // Eliminar el loader después de la animación
    setTimeout(() => {
      this.loaderElement.style.display = 'none';
      document.body.classList.add('loaded');
      
      // Iniciar animaciones post-carga
      this.triggerPostLoadAnimations();
    }, 600);
  }
  
  /**
   * Activa animaciones después de ocultar el loader
   */
  triggerPostLoadAnimations() {
    // Animar títulos
    document.querySelectorAll('.hero-title').forEach(title => {
      title.classList.add('animate-in');
    });
    
    // Animar elementos con retraso secuencial
    const animateSequence = [
      { selector: '.hero-subtitle', delay: 200 },
      { selector: '.cta-container', delay: 400 },
      { selector: '.feature', delay: 600, stagger: 200 },
      { selector: '.franchise-card', delay: 600, stagger: 200 },
      { selector: '.timeline-item', delay: 800, stagger: 200 }
    ];
    
    animateSequence.forEach(item => {
      const elements = document.querySelectorAll(item.selector);
      
      if (item.stagger) {
        // Animar con retraso progresivo
        elements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('animate-in');
          }, item.delay + (index * item.stagger));
        });
      } else {
        // Animar todos a la vez
        setTimeout(() => {
          elements.forEach(el => el.classList.add('animate-in'));
        }, item.delay);
      }
    });
  }
}

// Clase para lazy loading de imágenes
class LazyLoader {
  constructor() {
    // Seleccionar imágenes con atributo data-src
    this.lazyImages = document.querySelectorAll('img[data-src]');
    
    // Opciones para el Intersection Observer
    this.options = {
      root: null, // viewport
      rootMargin: '100px', // margen para cargar antes de llegar
      threshold: 0.1 // umbral de visibilidad para cargar
    };
  }
  
  /**
   * Inicializa el sistema de lazy loading
   */
  init() {
    if (!this.lazyImages.length) return;
    
    // Verificar soporte para Intersection Observer
    if ('IntersectionObserver' in window) {
      // Crear observer
      const observer = new IntersectionObserver(this.onIntersection.bind(this), this.options);
      
      // Observar cada imagen
      this.lazyImages.forEach(image => {
        observer.observe(image);
      });
    } else {
      // Fallback para navegadores sin soporte
      this.loadAllImages();
    }
  }
  
  /**
   * Callback para cuando las imágenes intersectan con el viewport
   * @param {IntersectionObserverEntry[]} entries - Entradas de intersección
   * @param {IntersectionObserver} observer - Observer
   */
  onIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Cargar imagen
        this.loadImage(entry.target);
        
        // Dejar de observar
        observer.unobserve(entry.target);
      }
    });
  }
  
  /**
   * Carga una imagen específica
   * @param {HTMLImageElement} img - Elemento de imagen
   */
  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    
    // Precargar la imagen
    const tempImg = new Image();
    tempImg.src = src;
    
    tempImg.onload = () => {
      // Establecer src original y añadir clase
      img.src = src;
      img.classList.add('loaded');
      // Eliminar atributo data-src
      img.removeAttribute('data-src');
    };
    
    tempImg.onerror = () => {
      console.warn(`No se pudo cargar la imagen: ${src}`);
      // Opcional: establecer imagen de fallback
      // img.src = 'ruta/a/imagen/fallback.jpg';
    };
  }
  
  /**
   * Carga todas las imágenes a la vez (fallback)
   */
  loadAllImages() {
    this.lazyImages.forEach(img => {
      this.loadImage(img);
    });
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar el loader del portal
  const portalLoader = new PortalLoader();
  portalLoader.init();
  
  // Inicializar lazy loading de imágenes
  const lazyLoader = new LazyLoader();
  lazyLoader.init();
});

// Exportar clases para uso en otros scripts
window.MissStarLoader = {
  PortalLoader,
  LazyLoader
}; 