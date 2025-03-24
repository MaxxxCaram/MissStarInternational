/**
 * Miss Star International - Animations Javascript
 * Maneja las animaciones y efectos visuales del sitio
 */

// Esperar a que se cargue el documento
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar animaciones cuando el loader se haya completado
    window.addEventListener('load-complete', initializeAnimations);
    
    // Por si el evento personalizado no se dispara
    setTimeout(initializeAnimations, 3000);
});

/**
 * Inicializa todas las animaciones del sitio
 */
function initializeAnimations() {
    // Animaciones para la sección hero
    animateHeroSection();
    
    // Inicializar efecto de texto de escritura para subtítulos donde aplique
    initializeTypingEffect();
    
    // Hacer que las características aparezcan al hacer scroll
    initializeScrollAnimations();
    
    // Animaciones para el navegador
    animateNavigation();
    
    // Inicializar hologramas 3D
    initializeHolograms();
    
    // Animar las tarjetas de franquicias
    animateFranchiseCards();
    
    // Eventos de hover para elementos interactivos
    setupInteractiveElements();
}

/**
 * Animaciones específicas para la sección hero
 */
function animateHeroSection() {
    const heroLogo = document.querySelector('.hero-logo');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    if (heroLogo) {
        heroLogo.classList.add('fade-in-down');
        heroLogo.style.animationDelay = '0.2s';
    }
    
    if (heroTitle) {
        heroTitle.classList.add('fade-in');
        heroTitle.style.animationDelay = '0.5s';
        
        // Añadir efecto de glitch al título
        heroTitle.setAttribute('data-text', heroTitle.textContent);
        heroTitle.classList.add('glitch-text');
    }
    
    if (heroSubtitle) {
        heroSubtitle.classList.add('fade-in-up');
        heroSubtitle.style.animationDelay = '0.8s';
    }
    
    // Animar los botones CTA
    ctaButtons.forEach((button, index) => {
        button.classList.add('fade-in-up');
        button.style.animationDelay = `${1 + (index * 0.2)}s`;
        
        // Añadir efecto de ripple a los botones
        button.classList.add('ripple');
    });
}

/**
 * Inicializa el efecto de escritura para elementos seleccionados
 */
function initializeTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.classList.add('typing-animation');
        
        // Establecer ancho máximo basado en el contenido
        element.style.width = `${text.length}ch`;
        
        // Reemplazar contenido después de un retraso para iniciar la animación
        setTimeout(() => {
            element.textContent = text;
        }, 500);
    });
}

/**
 * Inicializa animaciones basadas en scroll
 */
function initializeScrollAnimations() {
    // Elementos que animaremos al hacer scroll
    const animatedElements = document.querySelectorAll('.feature, .news-card, .timeline-item');
    
    // Función para verificar si un elemento está en el viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    };
    
    // Función para animar elementos visibles
    const animateOnScroll = () => {
        animatedElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated', 'fade-in-up');
                
                // Añadir efecto de escaneo a elementos seleccionados
                if (element.classList.contains('feature')) {
                    element.classList.add('scan-effect');
                }
            }
        });
    };
    
    // Ejecutar una vez al inicio
    animateOnScroll();
    
    // Añadir listener de scroll
    window.addEventListener('scroll', animateOnScroll);
}

/**
 * Animaciones para la navegación
 */
function animateNavigation() {
    const nav = document.querySelector('.nav-holographic');
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Cambiar estilos de la navegación al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(5, 5, 16, 0.9)';
            nav.style.height = '70px';
        } else {
            nav.style.background = 'var(--glass-bg)';
            nav.style.height = '80px';
        }
    });
    
    // Efecto de pulsación para elementos del menú
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('neon-pulse');
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('neon-pulse');
        });
        
        // Scroll suave a las secciones
        item.addEventListener('click', (e) => {
            const targetSection = item.getAttribute('data-section');
            const section = document.getElementById(targetSection);
            
            if (section) {
                e.preventDefault();
                window.scrollTo({
                    top: section.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Inicializa elementos holográficos
 */
function initializeHolograms() {
    // Añadir clase de efecto de holograma donde sea necesario
    const hologramElements = document.querySelectorAll('.franchise-hologram, .feature-icon, .holographic-globe');
    
    hologramElements.forEach(element => {
        element.classList.add('hologram-flicker');
    });
    
    // Inicializar el globo holográfico si existe
    initializeHolographicGlobe();
}

/**
 * Crea el globo holográfico en 3D si Three.js está disponible
 */
function initializeHolographicGlobe() {
    const globeContainer = document.querySelector('.holographic-globe');
    
    if (!globeContainer || typeof THREE === 'undefined') return;
    
    // Configuración básica de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
    renderer.setClearColor(0x000000, 0);
    
    globeContainer.appendChild(renderer.domElement);
    
    // Crear el globo
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    
    // Material para el globo - efecto holográfico
    const material = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    
    // Añadir puntos de brillo en lugares específicos (franquicias)
    addFranchisePoints(scene, globe.geometry);
    
    // Posicionar cámara
    camera.position.z = 10;
    
    // Función de animación
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotar el globo
        globe.rotation.y += 0.005;
        globe.rotation.x += 0.002;
        
        renderer.render(scene, camera);
    }
    
    // Iniciar animación
    animate();
    
    // Manejar redimensionamiento
    window.addEventListener('resize', () => {
        camera.aspect = globeContainer.clientWidth / globeContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
    });
}

/**
 * Añade puntos brillantes al globo para representar franquicias
 */
function addFranchisePoints(scene, globeGeometry) {
    if (typeof THREE === 'undefined') return;
    
    // Coordenadas de franquicias (simplificadas)
    const franchiseLocations = [
        { lat: 40.7128, lng: -74.0060 }, // New York
        { lat: -23.5505, lng: -46.6333 }, // São Paulo
        { lat: 35.6762, lng: 139.6503 }, // Tokyo
        { lat: 19.4326, lng: -99.1332 }, // Mexico City
        { lat: 48.8566, lng: 2.3522 }, // Paris
        { lat: -33.8688, lng: 151.2093 }, // Sydney
        { lat: 55.7558, lng: 37.6173 }, // Moscow
        { lat: 28.6139, lng: 77.2090 }, // New Delhi
    ];
    
    // Crear puntos brillantes para cada ubicación
    franchiseLocations.forEach(location => {
        // Convertir lat/lng a coordenadas 3D
        const phi = (90 - location.lat) * (Math.PI / 180);
        const theta = (location.lng + 180) * (Math.PI / 180);
        
        const x = -5 * Math.sin(phi) * Math.cos(theta);
        const y = 5 * Math.cos(phi);
        const z = 5 * Math.sin(phi) * Math.sin(theta);
        
        // Crear punto brillante
        const pointGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const pointMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0080,
            transparent: true,
            opacity: 0.8
        });
        
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        point.position.set(x, y, z);
        
        // Añadir brillo
        const pointLight = new THREE.PointLight(0xff0080, 0.5, 1);
        pointLight.position.set(x, y, z);
        
        scene.add(point);
        scene.add(pointLight);
    });
}

/**
 * Anima las tarjetas de franquicias
 */
function animateFranchiseCards() {
    const franchiseCards = document.querySelectorAll('.franchise-card');
    
    franchiseCards.forEach(card => {
        // Añadir efecto de flotar a las tarjetas
        card.classList.add('floating');
        
        // Efecto de hover mejorado
        card.addEventListener('mouseenter', () => {
            const hologram = card.querySelector('.franchise-hologram');
            if (hologram) {
                hologram.style.transform = 'scale(1.05) rotateX(5deg) rotateY(5deg)';
                hologram.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.4)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const hologram = card.querySelector('.franchise-hologram');
            if (hologram) {
                hologram.style.transform = '';
                hologram.style.boxShadow = '';
            }
        });
    });
}

/**
 * Configura elementos interactivos adicionales
 */
function setupInteractiveElements() {
    // Añadir efecto de shimmer a los botones
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.classList.add('shimmer');
    });
    
    // Añadir efecto de flicker a los títulos de sección
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('neon-pulse');
    });
    
    // Efecto de data-flow para secciones específicas
    const dataSections = document.querySelectorAll('.competition-section, .about-section');
    dataSections.forEach(section => {
        section.classList.add('data-flow');
    });
} 