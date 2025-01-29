document.addEventListener('DOMContentLoaded', () => {
    // Loader
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);

    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorGlow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // Hover effects
    const links = document.querySelectorAll('a, button, .consortium-card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(2)';
        });
        
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .consortium-card, .highlight-item').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect on hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled * 0.003);
    });

    // Tilt effect on cards
    VanillaTilt.init(document.querySelectorAll(".consortium-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.5
    });

    // Efectos de scroll
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    scrollRevealElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // Navegación y menú móvil
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('.nav-main');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        navToggle.classList.toggle('active');
    });

    // Efecto de scroll en la navegación
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Efecto de partículas
    const createParticles = () => {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = 10 + Math.random() * 20 + 's';
            particlesContainer.appendChild(particle);
        }
    };

    createParticles();

    // Efecto parallax en el hero
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        document.querySelectorAll('.grid-item').forEach(item => {
            item.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Efecto de hover en las cards
    document.querySelectorAll('.featured-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = -(x - centerX) / 10;
            
            card.style.transform = 
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    const video = document.getElementById('heroVideo');
    
    // Verificar si el video se carga correctamente
    video.addEventListener('error', (e) => {
        console.error('Error loading video:', e);
    });

    // Intentar reproducir el video
    video.play().catch((e) => {
        console.error('Error playing video:', e);
    });
});

// Gestión de idiomas
function changeLanguage() {
    const select = document.getElementById('languageSelect');
    const currentPath = window.location.pathname;
    const newLanguage = select.value;
    
    // Obtener la ruta actual sin el idioma
    const pathParts = currentPath.split('/');
    const currentPage = pathParts[pathParts.length - 1] || 'index.html';
    
    // Mapeo de URLs para cada idioma
    const urlMappings = {
        'competencia.html': {
            'en': 'competition.html',
            'pt': 'competicao.html',
            'es': 'competencia.html'
        },
        'candidatas.html': {
            'en': 'contestants.html',
            'pt': 'candidatas.html',
            'es': 'candidatas.html'
        },
        'noticias.html': {
            'en': 'news.html',
            'pt': 'noticias.html',
            'es': 'noticias.html'
        },
        'historia.html': {
            'en': 'history.html',
            'pt': 'historia.html',
            'es': 'historia.html'
        },
        'contacto.html': {
            'en': 'contact.html',
            'pt': 'contato.html',
            'es': 'contacto.html'
        },
        'index.html': {
            'en': 'index.html',
            'pt': 'index.html',
            'es': 'index.html'
        }
    };

    // Obtener la nueva URL correspondiente
    const newPage = urlMappings[currentPage]?.[newLanguage] || currentPage;
    const newUrl = `/${newLanguage}/${newPage}`;
    
    window.location.href = newUrl;
}

// Navegación responsive
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        navToggle.classList.toggle('active');
    });

    // Inicializar el selector de idiomas
    const currentLang = window.location.pathname.split('/')[1];
    const langSelect = document.getElementById('languageSelect');
    if (langSelect && currentLang) {
        langSelect.value = currentLang;
    }

    // Animación de carga
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// Efectos de scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav-main');
    if (window.scrollY > 50) {
        nav?.classList.add('nav-scrolled');
    } else {
        nav?.classList.remove('nav-scrolled');
    }
});

// Video Background
const video = document.getElementById('bgVideo');
video.play().catch(function(error) {
    console.log("Video autoplay failed:", error);
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.parallax').forEach(element => {
        const speed = element.dataset.speed;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Scroll Reveal Animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal(); // Initial check

// Scroll Reveal
const sections = document.querySelectorAll('.section');

const revealSection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Mouse Trail Effect
function createTrail(e) {
    const trail = document.createElement('div');
    trail.className = 'trail';
    trail.style.left = e.pageX + 'px';
    trail.style.top = e.pageY + 'px';
    document.body.appendChild(trail);

    trail.style.opacity = '1';
    
    setTimeout(() => {
        trail.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(trail);
        }, 300);
    }, 100);
}

document.addEventListener('mousemove', createTrail);

// Grid Item Hover Effect
document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        item.style.transform = `
            perspective(1000px)
            rotateX(${(y - 0.5) * 10}deg)
            rotateY(${(x - 0.5) * 10}deg)
            translateZ(20px)
        `;
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'none';
    });
});

// Glitch Effect on Scroll
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.glitch-on-scroll');
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add('glitch-active');
        } else {
            element.classList.remove('glitch-active');
        }
    });
});

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Language Switcher
const langButtons = document.querySelectorAll('.lang-btn');
let currentLang = 'en'; // Default language

function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    
    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });

    // Update active state of language buttons
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

// Event listeners for language buttons
langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        switchLanguage(btn.getAttribute('data-lang'));
    });
});

// Initialize with default language
switchLanguage(currentLang);

// Navigation Background on Scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Grid Animation
document.addEventListener('mousemove', (e) => {
    const grid = document.querySelector('.cyber-grid');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    grid.style.transform = `perspective(500px) rotateX(${60 + mouseY * 5}deg) rotateY(${mouseX * 5}deg)`;
});

// Glitch Effect
document.querySelectorAll('.glitch-text').forEach(element => {
    element.setAttribute('data-text', element.textContent);
});

// Hologram Cards
document.querySelectorAll('.holo-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});