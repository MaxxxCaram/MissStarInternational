/**
 * MAIN.JS - Funcionalidad principal para Miss Star International
 * Controla la carga del sitio, navegación, eventos y animaciones
 */

// Asegurar que el código se ejecuta después de cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar funciones principales
  initPortalLoader();
  initNavigation();
  initScrollEffects();
  initHolographicElements();
  initLanguageSwitcher();
  initInteractiveElements();
  
  // Registrar interacciones de usuario
  trackUserInteractions();
  
  // Detectar si viene de otra página del sitio
  if (document.referrer.includes(window.location.hostname)) {
    // Si viene del mismo sitio, no mostrar animación completa de carga
    document.body.classList.add('fast-transition');
  }

  // Si las imágenes no cargan, generar placeholders
  generateTempImages();

  // Detectar errores de carga de imágenes y reemplazar con placeholders
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      replaceMissingImage(this);
    });
  });
});

/**
 * Inicializa el loader del portal con animación futurista
 */
function initPortalLoader() {
  const loader = document.getElementById('portal-loader');
  if (!loader) return;
  
  // Lista de recursos críticos a precargar
  const criticalResources = [
    { type: 'css', url: 'css/future.css' },
    { type: 'css', url: 'css/animations.css' },
    { type: 'js', url: 'js/animations.js' },
    { type: 'js', url: 'js/particles.js' },
    { type: 'font', url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Exo+2:wght@300;400;700&display=swap' }
  ];
  
  // Contar recursos cargados
  let resourcesLoaded = 0;
  const totalResources = criticalResources.length;
  
  // Tiempo mínimo de visualización del loader (ms)
  const minLoaderTime = 2000;
  const startTime = Date.now();
  
  // Precargar CSS
  function preloadCSS(url) {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = resolve;
      link.onerror = resolve; // Continuar incluso si hay error
      document.head.appendChild(link);
    });
  }
  
  // Precargar JavaScript
  function preloadJS(url) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = resolve;
      script.onerror = resolve; // Continuar incluso si hay error
      document.body.appendChild(script);
    });
  }
  
  // Precargar fuentes
  function preloadFont(url) {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://fonts.googleapis.com';
      document.head.appendChild(link);
      
      const link2 = document.createElement('link');
      link2.rel = 'preconnect';
      link2.href = 'https://fonts.gstatic.com';
      link2.crossOrigin = '';
      document.head.appendChild(link2);
      
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = url;
      fontLink.onload = resolve;
      fontLink.onerror = resolve;
      document.head.appendChild(fontLink);
    });
  }
  
  // Precargar cada recurso
  criticalResources.forEach(resource => {
    let loadPromise;
    
    switch (resource.type) {
      case 'css':
        loadPromise = preloadCSS(resource.url);
        break;
      case 'js':
        loadPromise = preloadJS(resource.url);
        break;
      case 'font':
        loadPromise = preloadFont(resource.url);
        break;
      default:
        loadPromise = Promise.resolve();
    }
    
    loadPromise.then(() => {
      resourcesLoaded++;
      updateLoaderProgress(resourcesLoaded / totalResources);
      
      // Verificar si todos los recursos se han cargado
      if (resourcesLoaded === totalResources) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoaderTime - elapsedTime);
        
        // Esperar el tiempo mínimo antes de ocultar el loader
        setTimeout(() => {
          hideLoader();
        }, remainingTime);
      }
    });
  });
  
  // Actualizar barra de progreso del loader (opcional)
  function updateLoaderProgress(progress) {
    const progressText = loader.querySelector('.hologram-text');
    if (progressText) {
      progressText.textContent = `INICIANDO ${Math.floor(progress * 100)}%`;
    }
  }
  
  // Ocultar el loader con una animación
  function hideLoader() {
    // Añadir clase para animar la desaparición
    loader.classList.add('fade-out');
    
    // Eliminar el loader después de la animación
    setTimeout(() => {
      loader.style.display = 'none';
      document.body.classList.add('loaded');
      
      // Iniciar animaciones post-carga
      triggerPostLoadAnimations();
    }, 600);
  }
  
  // Por si acaso algo falla, asegurar que el loader desaparece después de un tiempo
  setTimeout(() => {
    if (loader.style.display !== 'none') {
      hideLoader();
    }
  }, 5000);
}

/**
 * Inicializa la navegación con efectos de scroll y menú responsivo
 */
function initNavigation() {
  const nav = document.querySelector('.nav-holographic');
  if (!nav) return;
  
  // Cambiar estilo de navegación al hacer scroll
  function handleScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }
  
  // Escuchar evento de scroll
  window.addEventListener('scroll', handleScroll);
  
  // Aplicar estado inicial
  handleScroll();
  
  // Navegación móvil
  const menuToggle = document.createElement('div');
  menuToggle.className = 'menu-toggle';
  for (let i = 0; i < 3; i++) {
    const bar = document.createElement('span');
    menuToggle.appendChild(bar);
  }
  
  nav.insertBefore(menuToggle, nav.firstChild);
  
  // Evento para menú móvil
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('menu-open');
  });
  
  // Navegación por scroll suave a secciones
  const menuItems = document.querySelectorAll('.menu-item');
  
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetSection = item.getAttribute('data-section');
      if (targetSection === 'home') {
        // Scroll al inicio
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        // Scroll a la sección específica
        const section = document.getElementById(targetSection);
        if (section) {
          section.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
      
      // Cerrar menú móvil si está abierto
      nav.classList.remove('menu-open');
    });
  });
}

/**
 * Inicializa efectos de scroll y animaciones al aparecer elementos
 */
function initScrollEffects() {
  // Usar Intersection Observer para detectar elementos visibles
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };
  
  // Callback cuando los elementos entran/salen del viewport
  const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        
        // Activar animación específica basada en el atributo data-animation
        const animation = entry.target.getAttribute('data-animation');
        if (animation) {
          entry.target.classList.add(`animate-${animation}`);
        }
        
        // Opcional: dejar de observar después de animar
        // observer.unobserve(entry.target);
      } else {
        // Opcional: quitar clases para repetir animación cuando vuelva a entrar en vista
        // entry.target.classList.remove('in-view');
        // const animation = entry.target.getAttribute('data-animation');
        // if (animation) {
        //   entry.target.classList.remove(`animate-${animation}`);
        // }
      }
    });
  };
  
  // Crear observer
  const observer = new IntersectionObserver(handleIntersect, observerOptions);
  
  // Observar elementos con clase 'scroll-reveal'
  document.querySelectorAll('.scroll-reveal, .feature, .franchise-card, .timeline-item, .news-card').forEach(el => {
    observer.observe(el);
  });
  
  // Efecto de paralaje al hacer scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Aplicar efecto a elementos con clase 'parallax'
    document.querySelectorAll('.parallax').forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax-speed') || 0.2);
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}

/**
 * Inicializa elementos holográficos y efectos 3D
 */
function initHolographicElements() {
  // Añadir efectos de hover 3D a tarjetas
  document.querySelectorAll('.franchise-card, .feature, .news-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      const mouseX = (e.clientX - cardCenterX) / (cardRect.width / 2);
      const mouseY = (e.clientY - cardCenterY) / (cardRect.height / 2);
      
      // Limitar rotación a 10 grados
      const rotateY = mouseX * 10;
      const rotateX = mouseY * -10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      
      // Efecto de luz siguiendo al cursor
      if (card.querySelector('.franchise-hologram')) {
        card.querySelector('.franchise-hologram').style.background = `
          radial-gradient(
            circle at ${e.clientX - cardRect.left}px ${e.clientY - cardRect.top}px, 
            rgba(0, 255, 255, 0.3) 0%, 
            rgba(255, 0, 255, 0.1) 50%, 
            rgba(10, 10, 30, 0.1) 100%
          )
        `;
      }
    });
    
    // Restaurar cuando el ratón sale
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      
      if (card.querySelector('.franchise-hologram')) {
        card.querySelector('.franchise-hologram').style.background = '';
      }
    });
  });
  
  // Añadir efectos de glitch a textos con clase específica
  document.querySelectorAll('.glitch-text').forEach(text => {
    if (!text.hasAttribute('data-text')) {
      text.setAttribute('data-text', text.textContent);
    }
  });
}

/**
 * Inicializa el selector de idioma
 */
function initLanguageSwitcher() {
  const languageSelector = document.querySelector('.language-selector');
  if (!languageSelector) return;
  
  // Añadir clase para mostrar/ocultar el menú en móvil
  languageSelector.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      languageSelector.classList.toggle('open');
      e.stopPropagation();
    }
  });
  
  // Cerrar selector al hacer clic en otra parte
  document.addEventListener('click', () => {
    if (languageSelector.classList.contains('open')) {
      languageSelector.classList.remove('open');
    }
  });
  
  // Implementar cambio de idioma
  const langOptions = document.querySelectorAll('.lang-option');
  
  langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      const targetLang = option.getAttribute('href').replace('/', '');
      changeLanguage(targetLang);
    });
  });
}

/**
 * Cambia el idioma del sitio
 * @param {string} lang - Código de idioma (en, es, pt, vi, th)
 */
function changeLanguage(lang) {
  // Si el lang es vacío, ir a la página principal de selección de idioma
  if (!lang) {
    window.location.href = '/';
    return;
  }
  
  // Redireccionar a la versión del idioma seleccionado
  window.location.href = `/${lang}`;
}

/**
 * Inicializa elementos interactivos del sitio
 */
function initInteractiveElements() {
  // Formulario de suscripción
  const subscribeForm = document.querySelector('.subscribe-form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = subscribeForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (validateEmail(email)) {
        // Animación de éxito
        subscribeForm.classList.add('success');
        
        // Simular envío (aquí se conectaría con backend real)
        setTimeout(() => {
          // Resetear formulario
          emailInput.value = '';
          subscribeForm.classList.remove('success');
          
          // Mostrar mensaje de éxito
          showNotification('¡Suscripción exitosa! Recibirás nuestras actualizaciones.');
        }, 1500);
      } else {
        // Mostrar error
        subscribeForm.classList.add('error');
        
        setTimeout(() => {
          subscribeForm.classList.remove('error');
        }, 1500);
      }
    });
  }
  
  // Botones CTA
  document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.classList.add('hover');
    });
    
    button.addEventListener('mouseleave', () => {
      button.classList.remove('hover');
    });
  });
}

/**
 * Dispara animaciones después de que la página se carga completamente
 */
function triggerPostLoadAnimations() {
  // Animar títulos con efecto de typing
  document.querySelectorAll('.hero-title').forEach(title => {
    title.classList.add('animate-in');
  });
  
  // Animar elementos con delay secuencial
  const animateSequence = [
    '.hero-subtitle',
    '.cta-container',
    '.feature:nth-child(1)',
    '.feature:nth-child(2)',
    '.feature:nth-child(3)',
    '.franchise-card:nth-child(1)',
    '.franchise-card:nth-child(2)',
    '.franchise-card:nth-child(3)'
  ];
  
  animateSequence.forEach((selector, index) => {
    const elements = document.querySelectorAll(selector);
    
    setTimeout(() => {
      elements.forEach(el => {
        el.classList.add('animate-in');
      });
    }, 200 + (index * 200));
  });
}

/**
 * Registra interacciones de usuario para análisis
 */
function trackUserInteractions() {
  // Registrar clics en elementos importantes
  document.querySelectorAll('a, button, .menu-item, .franchise-card').forEach(element => {
    element.addEventListener('click', (e) => {
      const elementType = element.tagName.toLowerCase();
      const elementText = element.textContent.trim();
      const elementId = element.id || '';
      const elementClass = Array.from(element.classList).join(' ');
      
      // Aquí se puede implementar envío a sistema de análisis
      console.log('Interacción:', {
        type: elementType,
        text: elementText,
        id: elementId,
        class: elementClass
      });
    });
  });
  
  // Registrar tiempo en página
  const startTime = Date.now();
  
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
    
    // Enviar datos de tiempo en página
    console.log('Tiempo en página:', timeOnPage + 's');
  });
}

/**
 * Muestra una notificación temporal
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, info)
 * @param {number} duration - Duración en milisegundos
 */
function showNotification(message, type = 'success', duration = 3000) {
  // Crear elemento de notificación si no existe
  let notification = document.querySelector('.site-notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'site-notification';
    document.body.appendChild(notification);
  }
  
  // Configurar mensaje y tipo
  notification.textContent = message;
  notification.className = `site-notification ${type}`;
  
  // Mostrar notificación
  notification.classList.add('active');
  
  // Ocultar después de la duración especificada
  setTimeout(() => {
    notification.classList.remove('active');
  }, duration);
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @return {boolean} - true si es válido
 */
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

// Generador temporal de imágenes para logo y banderas
function generateTempImages() {
  // Generar logo temporal si no existe
  generateTempLogo();
  // Generar banderas temporales si no existen
  generateTempFlags();
}

function generateTempLogo() {
  // Función para generar un logo temporal con canvas
  const logos = document.querySelectorAll('.logo-small, .logo-large');
  logos.forEach(logo => {
    if (isImageMissing(logo.src)) {
      createTempLogoImage(logo);
    }
  });
}

function generateTempFlags() {
  // Función para generar banderas temporales con canvas
  const flags = document.querySelectorAll('.lang-flag');
  flags.forEach(flag => {
    if (isImageMissing(flag.src)) {
      createTempFlagImage(flag);
    }
  });
}

function isImageMissing(src) {
  // Comprobar si la imagen está rota o no existe
  const img = new Image();
  img.src = src;
  return !img.complete || img.naturalWidth === 0;
}

function createTempLogoImage(imgElement) {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  
  // Fondo del logo
  ctx.fillStyle = '#1a1a3a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Texto del logo
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('MISS STAR', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillText('INTL', canvas.width / 2, canvas.height / 2 + 10);
  
  // Estrella
  drawStar(ctx, canvas.width / 2, 25, 5, 10, 5, '#00e5ff');
  
  // Reemplazar la imagen original
  imgElement.src = canvas.toDataURL();
}

function createTempFlagImage(imgElement) {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  // Obtener el código de idioma
  const langCode = imgElement.alt.split(' ')[0].toLowerCase();
  
  // Color base según el idioma
  let flagColor;
  switch(langCode) {
    case 'english':
      flagColor = '#1a5dc8'; // Azul para inglés
      break;
    case 'spanish':
      flagColor = '#c8341a'; // Rojo para español
      break;
    case 'portuguese':
      flagColor = '#1ac834'; // Verde para portugués
      break;
    case 'vietnamese':
      flagColor = '#c8b91a'; // Amarillo para vietnamita
      break;
    case 'thai':
      flagColor = '#8c1ac8'; // Púrpura para tailandés
      break;
    default:
      flagColor = '#1a5dc8'; // Azul por defecto
  }
  
  // Dibujar bandera circular
  ctx.beginPath();
  ctx.arc(16, 16, 15, 0, 2 * Math.PI);
  ctx.fillStyle = flagColor;
  ctx.fill();
  
  // Iniciales del idioma
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(langCode.substring(0, 2).toUpperCase(), 16, 16);
  
  // Borde
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Reemplazar la imagen original
  imgElement.src = canvas.toDataURL();
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;
  
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;
    
    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function replaceMissingImage(imgElement) {
  // Determinar qué tipo de imagen falta
  if (imgElement.classList.contains('logo-small') || imgElement.classList.contains('logo-large')) {
    createTempLogoImage(imgElement);
  } else if (imgElement.classList.contains('lang-flag')) {
    createTempFlagImage(imgElement);
  }
}

// Exportar funciones para uso en otros scripts
window.MissStarMain = {
  initPortalLoader,
  initNavigation,
  initScrollEffects,
  initHolographicElements,
  initLanguageSwitcher,
  initInteractiveElements,
  changeLanguage,
  showNotification
}; 