/**
 * Miss Star International - Main JavaScript
 * Archivo principal para manejar la funcionalidad del sitio
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Miss Star International - Sitio web inicializado');
    
    // Inicializar todos los componentes
    const missStarApp = new MissStarApp();
    missStarApp.init();
});

class MissStarApp {
    constructor() {
        // Referencias DOM
        this.body = document.body;
        this.header = document.querySelector('.site-header');
        this.loader = document.querySelector('.page-loader');
        this.scrollTopBtn = document.querySelector('.scroll-top-btn');
        
        // Estado de la aplicación
        this.isLoading = true;
        this.isAnimating = false;
        this.isModalOpen = false;
        
        // Opciones de configuración
        this.options = {
            scrollOffset: 100,
            animationDelay: 100,
            fancyboxEnabled: true,
            lazyLoadEnabled: true
        };
    }
    
    /**
     * Inicializar la aplicación
     */
    init() {
        // Ocultar loader después de la carga completa
        this.hideLoader();
        
        // Inicializar navegación
        this.initNavigation();
        
        // Inicializar animaciones de scroll
        this.initScrollAnimations();
        
        // Inicializar carruseles
        this.initCarousels();
        
        // Inicializar modales y lightbox
        this.initModals();
        
        // Inicializar validación de formularios
        this.initForms();
        
        // Inicializar botón de volver arriba
        this.initScrollToTop();
        
        // Inicializar lazyload para imágenes
        this.initLazyLoad();
        
        // Configurar eventos globales
        this.setupGlobalEvents();
    }
    
    /**
     * Ocultar el loader de la página
     */
    hideLoader() {
        if (this.loader) {
            setTimeout(() => {
                this.loader.classList.add('loaded');
                this.isLoading = false;
                
                // Remover el loader después de la animación
                setTimeout(() => {
                    if (this.loader.parentNode) {
                        this.loader.parentNode.removeChild(this.loader);
                    }
                }, 500);
                
                // Iniciar animaciones iniciales
                this.triggerInitialAnimations();
            }, 500);
        } else {
            this.isLoading = false;
            this.triggerInitialAnimations();
        }
    }
    
    /**
     * Inicializar la navegación
     */
    initNavigation() {
        // Hamburger menu toggle
        const hamburger = document.querySelector('.hamburger');
        const mainNav = document.querySelector('.main-nav');
        
        if (hamburger && mainNav) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                mainNav.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });
        }
        
        // Header scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header?.classList.add('scrolled');
            } else {
                this.header?.classList.remove('scrolled');
            }
        });
        
        // Smooth scroll for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (hamburger?.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        mainNav?.classList.remove('active');
                        document.body.classList.remove('nav-open');
                    }
                    
                    // Calculate position
                    const headerHeight = this.header?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    // Smooth scroll
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    /**
     * Inicializar animaciones al hacer scroll
     */
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animated');
                        }, this.options.animationDelay);
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            animatedElements.forEach(el => {
                observer.observe(el);
            });
        } else {
            // Fallback para navegadores sin IntersectionObserver
            animatedElements.forEach(el => {
                el.classList.add('animated');
            });
        }
        
        // Counter animation
        const counterElements = document.querySelectorAll('.count-up');
        if (counterElements.length > 0 && 'IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseInt(el.getAttribute('data-target'), 10);
                        const duration = parseInt(el.getAttribute('data-duration') || 2000, 10);
                        const increment = target / (duration / 16);
                        
                        let current = 0;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                el.textContent = target.toLocaleString();
                                clearInterval(timer);
                            } else {
                                el.textContent = Math.floor(current).toLocaleString();
                            }
                        }, 16);
                        
                        counterObserver.unobserve(el);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            counterElements.forEach(el => {
                counterObserver.observe(el);
            });
        }
    }
    
    /**
     * Activar animaciones iniciales
     */
    triggerInitialAnimations() {
        const initialElements = document.querySelectorAll('.animate-initial');
        
        if (initialElements.length > 0) {
            initialElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animated');
                }, index * 200);
            });
        }
    }
    
    /**
     * Inicializar carruseles
     */
    initCarousels() {
        // Check if Swiper is available
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper is not loaded. Carousels will not work.');
            return;
        }
        
        // Franchise slider
        const franchiseSlider = document.querySelector('.franchise-slider');
        if (franchiseSlider) {
            new Swiper(franchiseSlider, {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                autoplay: {
                    delay: 5000
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2
                    },
                    992: {
                        slidesPerView: 3
                    },
                    1200: {
                        slidesPerView: 4
                    }
                }
            });
        }
        
        // Testimonial slider
        const testimonialSlider = document.querySelector('.testimonial-slider');
        if (testimonialSlider) {
            new Swiper(testimonialSlider, {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 6000
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                }
            });
        }
    }
    
    /**
     * Inicializar modales y lightbox
     */
    initModals() {
        // Video modals
        const videoTriggers = document.querySelectorAll('.video-modal-trigger');
        
        videoTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                
                const videoUrl = trigger.getAttribute('data-video-url');
                const videoId = this.getYoutubeId(videoUrl);
                
                if (videoId) {
                    this.openVideoModal(videoId);
                }
            });
        });
    }
    
    /**
     * Abrir modal de vídeo
     * @param {string} videoId - ID del vídeo de YouTube
     */
    openVideoModal(videoId) {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-backdrop"></div>
            <div class="video-modal-content">
                <button class="video-modal-close">&times;</button>
                <div class="video-container">
                    <iframe 
                        width="560" 
                        height="315" 
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.isModalOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add visible class for animation
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);
        
        // Close events
        const closeBtn = modal.querySelector('.video-modal-close');
        const backdrop = modal.querySelector('.video-modal-backdrop');
        
        closeBtn.addEventListener('click', () => this.closeVideoModal(modal));
        backdrop.addEventListener('click', () => this.closeVideoModal(modal));
    }
    
    /**
     * Cerrar modal de vídeo
     * @param {HTMLElement} modal - Modal element to close
     */
    closeVideoModal(modal) {
        modal.classList.remove('visible');
        
        // Remove after animation
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            this.isModalOpen = false;
            document.body.style.overflow = '';
        }, 300);
    }
    
    /**
     * Extraer ID de YouTube de una URL
     * @param {string} url - URL de YouTube
     * @returns {string|null} - ID del vídeo o null
     */
    getYoutubeId(url) {
        if (!url) return null;
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    /**
     * Inicializar validación de formularios
     */
    initForms() {
        const forms = document.querySelectorAll('form:not(.no-validate)');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    return false;
                }
            });
            
            // Validate fields on blur
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        });
        
        // Init contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (this.validateForm(contactForm)) {
                    this.submitContactForm(contactForm);
                }
            });
        }
        
        // Init newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (this.validateForm(newsletterForm)) {
                    this.submitNewsletterForm(newsletterForm);
                }
            });
        }
    }
    
    /**
     * Validar un formulario
     * @param {HTMLFormElement} form - Formulario a validar
     * @returns {boolean} - Válido o no
     */
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Validar un campo
     * @param {HTMLElement} field - Campo a validar
     * @returns {boolean} - Válido o no
     */
    validateField(field) {
        // Skip hidden or disabled fields
        if (field.type === 'hidden' || field.disabled || field.readOnly) {
            return true;
        }
        
        // Get parent container
        const fieldContainer = field.closest('.form-group') || field.parentNode;
        let errorMsg = '';
        let isValid = true;
        
        // Validate based on type and attributes
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMsg = 'Este campo es obligatorio';
        } else if (field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            isValid = false;
            errorMsg = 'Por favor, ingresa un correo electrónico válido';
        } else if (field.hasAttribute('minlength') && field.value.length < parseInt(field.getAttribute('minlength'), 10)) {
            isValid = false;
            errorMsg = `Este campo debe tener al menos ${field.getAttribute('minlength')} caracteres`;
        } else if (field.hasAttribute('data-match') && field.value !== document.querySelector(field.getAttribute('data-match')).value) {
            isValid = false;
            errorMsg = 'Los campos no coinciden';
        }
        
        // Show or hide error
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            
            // Remove error message if exists
            const errorEl = fieldContainer.querySelector('.invalid-feedback');
            if (errorEl) {
                errorEl.remove();
            }
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            
            // Show error message
            let errorEl = fieldContainer.querySelector('.invalid-feedback');
            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.className = 'invalid-feedback';
                fieldContainer.appendChild(errorEl);
            }
            errorEl.textContent = errorMsg;
        }
        
        return isValid;
    }
    
    /**
     * Enviar formulario de contacto
     * @param {HTMLFormElement} form - Formulario de contacto
     */
    submitContactForm(form) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        
        // Send Ajax request
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Restore button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Show response message
            const responseEl = document.createElement('div');
            responseEl.className = data.success ? 'form-response success' : 'form-response error';
            responseEl.innerHTML = data.message || (data.success ? 'Mensaje enviado correctamente.' : 'Hubo un error al enviar el mensaje.');
            
            // Replace any previous message
            const oldResponse = form.querySelector('.form-response');
            if (oldResponse) {
                oldResponse.remove();
            }
            
            form.appendChild(responseEl);
            
            // Reset form if successful
            if (data.success) {
                form.reset();
                
                // Remove after some time
                setTimeout(() => {
                    responseEl.classList.add('fade-out');
                    setTimeout(() => {
                        responseEl.remove();
                    }, 500);
                }, 5000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Restore button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Show error message
            const responseEl = document.createElement('div');
            responseEl.className = 'form-response error';
            responseEl.textContent = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
            
            const oldResponse = form.querySelector('.form-response');
            if (oldResponse) {
                oldResponse.remove();
            }
            
            form.appendChild(responseEl);
        });
    }
    
    /**
     * Enviar formulario de newsletter
     * @param {HTMLFormElement} form - Formulario de newsletter
     */
    submitNewsletterForm(form) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span>';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        
        // Send Ajax request
        fetch(form.action || 'subscribe.php', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Restore button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Show temporary message
            const messageEl = document.createElement('div');
            messageEl.className = 'newsletter-message';
            messageEl.textContent = data.success ? 
                '¡Gracias por suscribirte!' : 
                'Hubo un error. Por favor, inténtalo de nuevo.';
            
            form.appendChild(messageEl);
            
            // Reset form if successful
            if (data.success) {
                form.reset();
            }
            
            // Remove message after some time
            setTimeout(() => {
                messageEl.classList.add('fade-out');
                setTimeout(() => {
                    messageEl.remove();
                }, 500);
            }, 3000);
        })
        .catch(error => {
            console.error('Error:', error);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Show error message
            const messageEl = document.createElement('div');
            messageEl.className = 'newsletter-message error';
            messageEl.textContent = 'Error al suscribirse. Inténtalo de nuevo.';
            
            form.appendChild(messageEl);
            
            // Remove message after some time
            setTimeout(() => {
                messageEl.classList.add('fade-out');
                setTimeout(() => {
                    messageEl.remove();
                }, 500);
            }, 3000);
        });
    }
    
    /**
     * Inicializar botón de volver arriba
     */
    initScrollToTop() {
        if (this.scrollTopBtn) {
            // Show/hide based on scroll position
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    this.scrollTopBtn.classList.add('visible');
                } else {
                    this.scrollTopBtn.classList.remove('visible');
                }
            });
            
            // Click event
            this.scrollTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        } else {
            // Create button if it doesn't exist
            const scrollBtn = document.createElement('button');
            scrollBtn.className = 'scroll-top-btn';
            scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            scrollBtn.setAttribute('aria-label', 'Volver arriba');
            document.body.appendChild(scrollBtn);
            
            this.scrollTopBtn = scrollBtn;
            this.initScrollToTop();
        }
    }
    
    /**
     * Inicializar lazy loading de imágenes
     */
    initLazyLoad() {
        if (!this.options.lazyLoadEnabled) return;
        
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src], source[data-srcset]');
            
            if (lazyImages.length === 0) return;
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        
                        if (lazyImage.hasAttribute('data-src')) {
                            lazyImage.src = lazyImage.getAttribute('data-src');
                            lazyImage.removeAttribute('data-src');
                        }
                        
                        if (lazyImage.hasAttribute('data-srcset')) {
                            lazyImage.srcset = lazyImage.getAttribute('data-srcset');
                            lazyImage.removeAttribute('data-srcset');
                        }
                        
                        lazyImage.classList.add('loaded');
                        imageObserver.unobserve(lazyImage);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without Intersection Observer
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                img.classList.add('loaded');
            });
            
            document.querySelectorAll('source[data-srcset]').forEach(source => {
                source.srcset = source.getAttribute('data-srcset');
                source.removeAttribute('data-srcset');
            });
        }
    }
    
    /**
     * Configurar eventos globales
     */
    setupGlobalEvents() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            // Close modals with ESC
            if (e.key === 'Escape' && this.isModalOpen) {
                const modal = document.querySelector('.video-modal.visible');
                if (modal) {
                    this.closeVideoModal(modal);
                }
            }
        });
        
        // Language selector
        const langSelector = document.querySelector('.lang-selector');
        if (langSelector) {
            const langOptions = langSelector.querySelectorAll('.lang-option');
            
            langOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    const url = option.getAttribute('data-url');
                    if (url) {
                        window.location.href = url;
                    }
                });
            });
        }
        
        // Add parallax effect
        if (document.querySelector('.parallax-bg')) {
            window.addEventListener('scroll', this.handleParallaxEffect.bind(this));
        }
    }
    
    /**
     * Manejar efecto de parallax al hacer scroll
     */
    handleParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        parallaxElements.forEach(el => {
            const scrollY = window.scrollY;
            const speed = parseFloat(el.getAttribute('data-speed') || 0.3);
            const yPos = -(scrollY * speed);
            el.style.backgroundPosition = `center ${yPos}px`;
        });
    }
}

// Create loader if it doesn't exist
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.page-loader')) {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">Miss Star International</div>
            </div>
        `;
        document.body.appendChild(loader);
    }
});