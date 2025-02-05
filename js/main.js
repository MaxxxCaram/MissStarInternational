document.addEventListener('DOMContentLoaded', function() {
    // Safe function to get elements
    function safeQuerySelector(selector) {
        const element = document.querySelector(selector);
        return element || null;
    }

    // Safe function to handle styles
    function safeSetStyle(element, property, value) {
        if (element && element.style) {
            element.style[property] = value;
        }
    }

    // Safe menu handling
    const menuBtn = safeQuerySelector('.menu-btn');
    const menu = safeQuerySelector('.menu');
    
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // Safe scroll handling
    window.addEventListener('scroll', function() {
        const header = safeQuerySelector('header');
        if (header) {
            const scrolled = window.scrollY > 50;
            safeSetStyle(header, 'background', scrolled ? 'rgba(0,0,0,0.9)' : 'transparent');
        }
    });

    // Safe smooth scroll handling
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

    // Safe animation handling
    const animatedElements = document.querySelectorAll('.animated');
    animatedElements.forEach(element => {
        if (element) {
            safeSetStyle(element, 'opacity', '1');
        }
    });

    // Safe loader handling
    const loader = safeQuerySelector('.loader');
    if (loader) {
        setTimeout(() => {
            safeSetStyle(loader, 'opacity', '0');
            setTimeout(() => {
                safeSetStyle(loader, 'display', 'none');
            }, 500);
        }, 1000);
    }

    // Safe mobile navigation handling
    const navToggle = safeQuerySelector('.nav-toggle');
    const nav = safeQuerySelector('nav');
    
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}); 