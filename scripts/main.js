document.addEventListener('DOMContentLoaded', function() {
    // Funciones para el menú
    const menu = document.querySelector('.menu');
    const menuBtn = document.querySelector('.menu-btn');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if (menu) {
                menu.classList.toggle('active');
            }
        });
    }

    // Funciones para animaciones
    const animatedElements = document.querySelectorAll('.animated');
    if (animatedElements.length > 0) {
        animatedElements.forEach(element => {
            element.style.opacity = '1';
        });
    }

    // Funciones para enlaces
    const links = document.querySelectorAll('a');
    if (links.length > 0) {
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.hash) {
                    e.preventDefault();
                    const hash = this.hash;
                    const target = document.querySelector(hash);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Inicializar VanillaTilt si existe
    if (typeof VanillaTilt !== 'undefined') {
        const tiltElements = document.querySelectorAll('.tilt');
        if (tiltElements.length > 0) {
            VanillaTilt.init(tiltElements, {
                max: 25,
                speed: 400
            });
        }
    }

    // Función para el scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(0,0,0,0.9)';
            } else {
                header.style.background = 'transparent';
            }
        }
    });
}); 