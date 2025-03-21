// Implementando:
- Three.js para elementos 3D
- GSAP para animaciones fluidas
- WebGL para efectos visuales
- Intersection Observer para animaciones al scroll
- Web Audio API para efectos de sonido 

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
        initStarField();
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
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    }, 2000);
}

// Inicializar Campo de Estrellas
function initStarField() {
    if (typeof THREE === 'undefined') return;
    
    const starField = new StarField();
    starField.init();
}

// Inicializar Partículas
function initParticles() {
    if (typeof particlesJS === 'undefined') return;
    
    particlesJS('particles-js', particlesConfig);
}

// Inicializar Efectos Holográficos
function initHolographicEffects() {
    const elements = document.querySelectorAll('.hologram');
    elements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = element.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            element.style.transform = `
                perspective(1000px)
                rotateX(${y * 20}deg)
                rotateY(${x * 20}deg)
            `;
        });
    });
}

// Inicializar Tilt en Cards
function initTiltCards() {
    if (typeof VanillaTilt === 'undefined') return;
    
    VanillaTilt.init(document.querySelectorAll(".franchise-card"), {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5
    });
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