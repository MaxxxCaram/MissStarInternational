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
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            const loader = document.querySelector('.portal-loader');
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 1000);
            }, 2000);
        });
    }
} 