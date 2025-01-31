document.addEventListener('DOMContentLoaded', function() {
    // Función segura para obtener elementos
    function safeQuerySelector(selector) {
        const element = document.querySelector(selector);
        return element || null;
    }

    // Función segura para manejar estilos
    function safeSetStyle(element, property, value) {
        if (element && element.style) {
            element.style[property] = value;
        }
    }

    // Manejo seguro del menú
    const menuBtn = safeQuerySelector('.menu-btn');
    const menu = safeQuerySelector('.menu');
    
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // Manejo seguro del scroll
    window.addEventListener('scroll', function() {
        const header = safeQuerySelector('header');
        if (header) {
            const scrolled = window.scrollY > 50;
            safeSetStyle(header, 'background', scrolled ? 'rgba(0,0,0,0.9)' : 'transparent');
        }
    });

    // Manejo seguro de enlaces suaves
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = safeQuerySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Manejo seguro de animaciones
    const animatedElements = document.querySelectorAll('.animated');
    animatedElements.forEach(element => {
        if (element) {
            safeSetStyle(element, 'opacity', '1');
        }
    });

    // Manejo seguro del loader
    const loader = safeQuerySelector('.loader');
    if (loader) {
        setTimeout(() => {
            safeSetStyle(loader, 'opacity', '0');
            setTimeout(() => {
                safeSetStyle(loader, 'display', 'none');
            }, 500);
        }, 1000);
    }

    // Manejo seguro de la navegación móvil
    const navToggle = safeQuerySelector('.nav-toggle');
    const nav = safeQuerySelector('nav');
    
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Grid Animation
    const grid = document.querySelector('.cyber-grid');
    if (grid) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            requestAnimationFrame(() => {
                grid.style.transform = `perspective(500px) rotateX(${60 + mouseY * 5}deg) rotateY(${mouseX * 5}deg)`;
            });
        });
    }
}); 