/**
 * Animations.js - Efectos y animaciones para Miss Star International
 */

// Función para inicializar las animaciones del portal
function initPortalAnimations() {
    const portal = document.getElementById('portal-loader');
    if (!portal) return;
    
    // Agregar clases de animación al portal
    portal.classList.add('active');
    
    // Ocultar el portal después de que la página se haya cargado
    window.addEventListener('load', () => {
        setTimeout(() => {
            portal.classList.add('fade-out');
            setTimeout(() => {
                portal.style.display = 'none';
            }, 1000);
        }, 1500);
    });
}

// Función para inicializar efectos de hover en los elementos
function initHoverEffects() {
    // Añadir efecto de hover a los enlaces del menú
    const menuLinks = document.querySelectorAll('.cyber-nav a');
    menuLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.classList.add('hover-glow');
        });
        link.addEventListener('mouseleave', () => {
            link.classList.remove('hover-glow');
        });
    });
    
    // Añadir efecto de hover a las tarjetas
    const cards = document.querySelectorAll('.franchise-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('card-hover');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('card-hover');
        });
    });
}

// Función para inicializar las animaciones de desplazamiento
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos con la clase 'scroll-animate'
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Inicializar todas las animaciones cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    initPortalAnimations();
    initHoverEffects();
    initScrollAnimations();
});

// Exportar funciones para uso en otros archivos
window.MSI_Animations = {
    initPortalAnimations,
    initHoverEffects,
    initScrollAnimations
}; 