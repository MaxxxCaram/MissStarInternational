/**
 * Main JavaScript for Miss Star International
 * Dependencies:
 * - Three.js: 3D elements
 * - GSAP: Fluid animations
 * - WebGL: Visual effects
 * - Intersection Observer: Scroll animations
 * - Web Audio API: Sound effects
 */

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Verificar recursos críticos
    const requiredScripts = [
        'THREE',
        'gsap',
        'particlesJS',
        'VanillaTilt'
    ];

    // Verificar si faltan scripts
    const missingScripts = requiredScripts.filter(script => {
        return typeof window[script] === 'undefined';
    });

    if (missingScripts.length > 0) {
        console.error('Scripts faltantes:', missingScripts);
        return;
    }

    // Inicializar componentes
    try {
        initPortalLoader();
        initParticles();
        initHolographicEffects();
        initTiltCards();
    } catch (error) {
        console.error('Error inicializando componentes:', error);
    }
});

// Inicializar Portal Loader
function initPortalLoader() {
    const loader = document.querySelector('.portal-loader');
    if (!loader) return;
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 1000);
    }, 2000);
}

// Inicializar Partículas
function initParticles() {
    if (typeof particlesJS === 'undefined') return;
    
    particlesJS('particles-js', {
        particles: {
            number: { value: 80 },
            color: { value: '#ffffff' },
            opacity: { value: 0.5 },
            size: { value: 3 }
        }
    });
}

// Inicializar Efectos Holográficos
function initHolographicEffects() {
    const elements = document.querySelectorAll('.hologram');
    elements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = element.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            element.style.setProperty('--x', x);
            element.style.setProperty('--y', y);
        });
    });
}

// Inicializar Tilt en Cards
function initTiltCards() {
    if (typeof VanillaTilt === 'undefined') return;
    VanillaTilt.init(document.querySelectorAll(".franchise-card"));
}

// Scroll Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.franchise-card, .timeline-item').forEach((el) => observer.observe(el)); 