// Lazy loading para imágenes
document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll('[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                preloadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, imageOptions);

    images.forEach(image => imageObserver.observe(image));
});

class PortalLoader {
    constructor() {
        this.loader = document.querySelector('.portal-loader');
        this.progress = 0;
        this.init();
    }

    init() {
        // Precarga de assets críticos
        const assets = [
            '/assets/images/logo/miss-star-3d.png',
            '/assets/fonts/Orbitron-Bold.woff2'
        ];

        const promises = assets.map(url => {
            if(url.endsWith('.png')) {
                return new Promise(resolve => {
                    const img = new Image();
                    img.onload = resolve;
                    img.src = url;
                });
            }
            return fetch(url);
        });

        Promise.all(promises)
            .then(() => this.hideLoader())
            .catch(err => console.error('Error cargando assets:', err));
    }

    hideLoader() {
        gsap.to(this.loader, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                this.loader.style.display = 'none';
                this.initPageAnimations();
            }
        });
    }

    initPageAnimations() {
        gsap.from('.cyber-title', {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out"
        });

        gsap.from('.franchise-card', {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.7)"
        });
    }
} 