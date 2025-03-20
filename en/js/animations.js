// Animaciones principales
document.addEventListener('DOMContentLoaded', () => {
    // Animación del título principal
    const animateHeroTitle = () => {
        const title = document.querySelector('.hero-content h1');
        if (title) {
            const text = title.textContent;
            title.innerHTML = '';
            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.animationDelay = `${i * 0.1}s`;
                title.appendChild(span);
            });
        }
    };

    // Efecto parallax en hero
    const parallaxEffect = () => {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    };

    // Animación de entrada para elementos
    const fadeInElements = () => {
        const elements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.3 });

        elements.forEach(element => observer.observe(element));
    };

    // Iniciar animaciones
    animateHeroTitle();
    parallaxEffect();
    fadeInElements();
});

// Animación de la corona
const animateCrown = () => {
    const crown = document.querySelector('.crown-icon');
    if (crown) {
        crown.addEventListener('mouseover', () => {
            crown.classList.add('rotate-shine');
        });
        crown.addEventListener('mouseout', () => {
            crown.classList.remove('rotate-shine');
        });
    }
}; 