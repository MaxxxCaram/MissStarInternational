// Implementando:
- Three.js para elementos 3D
- GSAP para animaciones fluidas
- WebGL para efectos visuales
- Intersection Observer para animaciones al scroll
- Web Audio API para efectos de sonido 

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initHolographicEffects();
    initPortalLoader();
    initTiltCards();
});

// Portal Loader
function initPortalLoader() {
    setTimeout(() => {
        document.querySelector('.portal-loader').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.portal-loader').style.display = 'none';
        }, 1000);
    }, 2000);
}

// Efectos Holográficos
function initHolographicEffects() {
    const hologramElements = document.querySelectorAll('.hologram');
    hologramElements.forEach(element => {
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
    VanillaTilt.init(document.querySelectorAll(".franchise-card"), {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
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