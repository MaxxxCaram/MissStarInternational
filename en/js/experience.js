/**
 * Miss Star International - Experiencia Interactiva
 * Gestiona las interacciones avanzadas del usuario con la interfaz
 */

class FutureExperience {
    constructor() {
        // Estado de la experiencia
        this.isInitialized = false;
        this.activeSection = null;
        this.previousScrollPosition = 0;
        this.scrollDirection = 'down';
        this.lastInteractionTime = Date.now();
        this.idleTimeout = 30000; // 30 segundos
        this.isIdle = false;
        this.isFullscreenEnabled = false;
        this.audioEnabled = false;
        this.isPaused = false;
        
        // Referencias a elementos DOM
        this.cursor = null;
        this.cursorFollower = null;
        this.audioPlayer = null;
        this.idleVideo = null;
        this.parallaxItems = [];
        this.interactiveElements = [];
        this.glitchElements = [];
        
        // Configuración
        this.config = {
            cursorSize: 20,
            cursorFollowerSize: 40,
            cursorColor: 'rgba(0, 255, 255, 0.5)',
            cursorFollowerColor: 'rgba(255, 0, 255, 0.2)',
            parallaxIntensity: 0.05,
            audioVolume: 0.2,
            idleDetection: true,
            enableCustomCursor: true,
            enableGlitchOnHover: true,
            enableParallaxEffects: true,
            enableAudioFeedback: false,
            enableFullscreenMode: true
        };
        
        // Sonidos interactivos
        this.sounds = {
            hover: null,
            click: null,
            transition: null,
            glitch: null,
            ambient: null
        };
        
        // Inicializar cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', this.init.bind(this));
    }
    
    /**
     * Inicializa la experiencia interactiva
     */
    init() {
        console.log('Initializing interactive experience...');
        
        // Esperar a que se complete la carga
        document.addEventListener('load-complete', () => {
            this.setupDOMElements();
            this.setupEventListeners();
            this.setupParallaxElements();
            this.setupInteractiveElements();
            this.setupAudio();
            this.setupIdleDetection();
            
            // Inicializar cursor personalizado si está habilitado
            if (this.config.enableCustomCursor) {
                this.initCustomCursor();
            }
            
            this.isInitialized = true;
            console.log('Interactive experience initialized');
        });
        
        // Por si el evento nunca se dispara
        setTimeout(() => {
            if (!this.isInitialized) {
                console.warn('Forcing interactive experience initialization');
                this.setupDOMElements();
                this.setupEventListeners();
                this.setupParallaxElements();
                this.setupInteractiveElements();
                this.setupAudio();
                this.setupIdleDetection();
                
                if (this.config.enableCustomCursor) {
                    this.initCustomCursor();
                }
                
                this.isInitialized = true;
            }
        }, 5000);
    }
    
    /**
     * Configura las referencias a elementos DOM importantes
     */
    setupDOMElements() {
        // Crear elemento para el cursor personalizado
        this.cursor = document.createElement('div');
        this.cursor.className = 'future-cursor';
        document.body.appendChild(this.cursor);
        
        // Crear elemento seguidor del cursor
        this.cursorFollower = document.createElement('div');
        this.cursorFollower.className = 'future-cursor-follower';
        document.body.appendChild(this.cursorFollower);
        
        // Aplicar estilos a los elementos del cursor
        this.applyCustomCursorStyles();
        
        // Encontrar elementos para efectos de parallax
        this.parallaxItems = document.querySelectorAll('.parallax-item');
        
        // Encontrar elementos interactivos
        this.interactiveElements = document.querySelectorAll('.interactive-element, button, .menu-item, a, .franchise-card, .btn-future');
        
        // Encontrar elementos para efecto glitch
        this.glitchElements = document.querySelectorAll('.glitch-on-hover');
    }
    
    /**
     * Aplica estilos CSS a los elementos del cursor personalizado
     */
    applyCustomCursorStyles() {
        // Estilos base para el cursor principal
        this.cursor.style.position = 'fixed';
        this.cursor.style.width = `${this.config.cursorSize}px`;
        this.cursor.style.height = `${this.config.cursorSize}px`;
        this.cursor.style.borderRadius = '50%';
        this.cursor.style.backgroundColor = this.config.cursorColor;
        this.cursor.style.pointerEvents = 'none';
        this.cursor.style.zIndex = '9999';
        this.cursor.style.transform = 'translate(-50%, -50%)';
        this.cursor.style.mixBlendMode = 'difference';
        this.cursor.style.transition = 'transform 0.1s ease, width 0.2s ease, height 0.2s ease, background-color 0.2s ease';
        
        // Estilos para el seguidor del cursor
        this.cursorFollower.style.position = 'fixed';
        this.cursorFollower.style.width = `${this.config.cursorFollowerSize}px`;
        this.cursorFollower.style.height = `${this.config.cursorFollowerSize}px`;
        this.cursorFollower.style.borderRadius = '50%';
        this.cursorFollower.style.border = '1px solid rgba(255, 255, 255, 0.5)';
        this.cursorFollower.style.backgroundColor = this.config.cursorFollowerColor;
        this.cursorFollower.style.pointerEvents = 'none';
        this.cursorFollower.style.zIndex = '9998';
        this.cursorFollower.style.transform = 'translate(-50%, -50%)';
        this.cursorFollower.style.transition = 'transform 0.15s ease, width 0.3s ease, height 0.3s ease, opacity 0.2s ease';
    }
    
    /**
     * Configura los listeners de eventos
     */
    setupEventListeners() {
        // Actualizar posición del cursor
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // Detectar clics
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        
        // Detectar scroll
        window.addEventListener('scroll', this.throttle(this.onScroll.bind(this), 100));
        
        // Detectar redimensión de ventana
        window.addEventListener('resize', this.throttle(this.onResize.bind(this), 200));
        
        // Detectar actividad para reiniciar el temporizador de inactividad
        const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
        activityEvents.forEach(eventType => {
            document.addEventListener(eventType, this.resetIdleTimer.bind(this));
        });
        
        // Detectar entrada/salida de elementos interactivos
        this.interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => this.onElementEnter(e));
            element.addEventListener('mouseleave', (e) => this.onElementLeave(e));
            element.addEventListener('click', (e) => this.onElementClick(e));
        });
        
        // Detectar teclas para fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' && this.config.enableFullscreenMode) {
                this.toggleFullscreen();
            }
        });
        
        // Botón de sonido si existe
        const audioToggle = document.querySelector('.audio-toggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', this.toggleAudio.bind(this));
        }
    }
    
    /**
     * Inicializa el cursor personalizado
     */
    initCustomCursor() {
        // Ocultar el cursor por defecto
        document.body.style.cursor = 'none';
        
        // Posicionar el cursor y el seguidor fuera de la pantalla
        this.cursor.style.top = '-50px';
        this.cursor.style.left = '-50px';
        this.cursorFollower.style.top = '-50px';
        this.cursorFollower.style.left = '-50px';
        
        console.log('Custom cursor initialized');
    }
    
    /**
     * Maneja el movimiento del mouse
     */
    onMouseMove(e) {
        // Actualizar posición del cursor principal inmediatamente
        this.cursor.style.left = `${e.clientX}px`;
        this.cursor.style.top = `${e.clientY}px`;
        
        // Suavizar el movimiento del seguidor
        this.animateCursorFollower(e.clientX, e.clientY);
        
        // Actualizar elementos de parallax si están habilitados
        if (this.config.enableParallaxEffects && this.parallaxItems.length > 0) {
            this.updateParallaxElements(e);
        }
    }
    
    /**
     * Anima el seguidor del cursor con suavidad
     */
    animateCursorFollower(x, y) {
        requestAnimationFrame(() => {
            const followerRect = this.cursorFollower.getBoundingClientRect();
            const followerX = followerRect.left + followerRect.width / 2;
            const followerY = followerRect.top + followerRect.height / 2;
            
            // Calcular la distancia entre el cursor y el seguidor
            const dx = x - followerX;
            const dy = y - followerY;
            
            // Mover el seguidor una fracción de la distancia hacia el cursor
            const newX = followerX + dx * 0.3;
            const newY = followerY + dy * 0.3;
            
            this.cursorFollower.style.left = `${newX}px`;
            this.cursorFollower.style.top = `${newY}px`;
        });
    }
    
    /**
     * Maneja el evento de presionar el botón del mouse
     */
    onMouseDown(e) {
        // Reducir el tamaño del cursor para efecto de clic
        this.cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        this.cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
        
        // Reproducir sonido de clic si está habilitado
        if (this.config.enableAudioFeedback && this.sounds.click) {
            this.playSound(this.sounds.click);
        }
    }
    
    /**
     * Maneja el evento de soltar el botón del mouse
     */
    onMouseUp(e) {
        // Restaurar el tamaño del cursor
        this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        this.cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    }
    
    /**
     * Maneja el evento de entrada del mouse en un elemento interactivo
     */
    onElementEnter(e) {
        // Expandir el cursor sobre elementos interactivos
        this.cursor.style.width = `${this.config.cursorSize * 1.5}px`;
        this.cursor.style.height = `${this.config.cursorSize * 1.5}px`;
        this.cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        
        this.cursorFollower.style.width = `${this.config.cursorFollowerSize * 1.5}px`;
        this.cursorFollower.style.height = `${this.config.cursorFollowerSize * 1.5}px`;
        this.cursorFollower.style.border = '2px solid rgba(0, 255, 255, 0.8)';
        
        // Añadir clase para indicar que está sobre un elemento interactivo
        this.cursor.classList.add('on-interactive');
        this.cursorFollower.classList.add('on-interactive');
        
        // Reproducir sonido hover si está habilitado
        if (this.config.enableAudioFeedback && this.sounds.hover) {
            this.playSound(this.sounds.hover);
        }
        
        // Añadir efecto glitch si está habilitado y el elemento lo soporta
        if (this.config.enableGlitchOnHover && e.target.classList.contains('glitch-on-hover')) {
            e.target.classList.add('glitching');
            
            // Reproducir sonido de glitch si está disponible
            if (this.config.enableAudioFeedback && this.sounds.glitch) {
                this.playSound(this.sounds.glitch);
            }
        }
    }
    
    /**
     * Maneja el evento de salida del mouse de un elemento interactivo
     */
    onElementLeave(e) {
        // Restaurar el tamaño normal del cursor
        this.cursor.style.width = `${this.config.cursorSize}px`;
        this.cursor.style.height = `${this.config.cursorSize}px`;
        this.cursor.style.backgroundColor = this.config.cursorColor;
        
        this.cursorFollower.style.width = `${this.config.cursorFollowerSize}px`;
        this.cursorFollower.style.height = `${this.config.cursorFollowerSize}px`;
        this.cursorFollower.style.border = '1px solid rgba(255, 255, 255, 0.5)';
        
        // Quitar clase de interactivo
        this.cursor.classList.remove('on-interactive');
        this.cursorFollower.classList.remove('on-interactive');
        
        // Quitar efecto glitch si estaba activo
        if (e.target.classList.contains('glitching')) {
            e.target.classList.remove('glitching');
        }
    }
    
    /**
     * Maneja el evento de clic en un elemento interactivo
     */
    onElementClick(e) {
        // Efecto especial en el cursor para clic en elemento interactivo
        this.cursor.classList.add('clicked');
        this.cursorFollower.classList.add('clicked');
        
        // Quitar la clase después de la animación
        setTimeout(() => {
            this.cursor.classList.remove('clicked');
            this.cursorFollower.classList.remove('clicked');
        }, 300);
        
        // Reproducir sonido de clic si está habilitado
        if (this.config.enableAudioFeedback && this.sounds.click) {
            this.playSound(this.sounds.click);
        }
    }
    
    /**
     * Maneja el evento de scroll
     */
    onScroll(e) {
        const currentScrollPosition = window.scrollY;
        
        // Determinar dirección del scroll
        this.scrollDirection = currentScrollPosition > this.previousScrollPosition ? 'down' : 'up';
        this.previousScrollPosition = currentScrollPosition;
        
        // Detectar qué sección está activa
        this.updateActiveSection();
        
        // Actualizar elementos que dependen del scroll
        this.updateScrollDependentElements();
    }
    
    /**
     * Actualiza la sección activa basada en la posición de scroll
     */
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSection = section.id;
            }
        });
        
        // Si encontramos una sección activa y es diferente a la anterior
        if (currentSection && currentSection !== this.activeSection) {
            this.activeSection = currentSection;
            
            // Disparar evento de cambio de sección
            const event = new CustomEvent('section-change', { detail: { section: currentSection } });
            document.dispatchEvent(event);
            
            // Reproducir sonido de transición si está habilitado
            if (this.config.enableAudioFeedback && this.sounds.transition) {
                this.playSound(this.sounds.transition);
            }
        }
    }
    
    /**
     * Actualiza elementos que dependen de la posición de scroll
     */
    updateScrollDependentElements() {
        // Actualizar navegación si existe
        const navItems = document.querySelectorAll('.menu-item');
        
        navItems.forEach(item => {
            const targetSection = item.getAttribute('data-section');
            
            if (targetSection === this.activeSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Actualizar elementos con efectos de aparición al hacer scroll
        const fadeElements = document.querySelectorAll('.fade-in-scroll:not(.fade-in-visible)');
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.85) {
                element.classList.add('fade-in-visible');
            }
        });
    }
    
    /**
     * Configura elementos con efecto parallax
     */
    setupParallaxElements() {
        if (!this.config.enableParallaxEffects || this.parallaxItems.length === 0) return;
        
        this.parallaxItems.forEach(item => {
            // Guardar la posición original
            const rect = item.getBoundingClientRect();
            item.dataset.originalLeft = rect.left + window.scrollX;
            item.dataset.originalTop = rect.top + window.scrollY;
            
            // Configurar intensidad del parallax (puede ser personalizada por elemento)
            if (!item.dataset.parallaxIntensity) {
                item.dataset.parallaxIntensity = this.config.parallaxIntensity;
            }
        });
    }
    
    /**
     * Actualiza la posición de elementos parallax
     */
    updateParallaxElements(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Calcular posición relativa del ratón (entre -1 y 1)
        const relativeX = (mouseX / windowWidth) * 2 - 1;
        const relativeY = (mouseY / windowHeight) * 2 - 1;
        
        this.parallaxItems.forEach(item => {
            const intensity = parseFloat(item.dataset.parallaxIntensity);
            
            // Mover el elemento en dirección opuesta al movimiento del ratón
            const moveX = -relativeX * intensity * 50;
            const moveY = -relativeY * intensity * 50;
            
            // Aplicar transformación con suavidad
            item.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
    
    /**
     * Configura elementos interactivos específicos
     */
    setupInteractiveElements() {
        // Configurar elementos de franquicia con efectos especiales
        const franchiseCards = document.querySelectorAll('.franchise-card');
        
        franchiseCards.forEach(card => {
            // Añadir efecto 3D de inclinación
            card.addEventListener('mousemove', (e) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                // Calcular ángulo de inclinación basado en la posición del ratón
                const angleX = (mouseY - cardCenterY) / (cardRect.height / 2) * 10;
                const angleY = (cardCenterX - mouseX) / (cardRect.width / 2) * 10;
                
                // Aplicar transformación con perspectiva
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
                
                // Actualizar el efecto de brillo interno
                const glare = card.querySelector('.card-glare');
                if (glare) {
                    const glareX = ((mouseX - cardRect.left) / cardRect.width) * 100;
                    const glareY = ((mouseY - cardRect.top) / cardRect.height) * 100;
                    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`;
                }
            });
            
            // Restaurar al salir
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                
                const glare = card.querySelector('.card-glare');
                if (glare) {
                    glare.style.background = 'none';
                }
            });
        });
        
        // Configurar botones con efectos de ondas
        const buttons = document.querySelectorAll('.btn-future');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Crear elemento de onda
                const ripple = document.createElement('span');
                ripple.className = 'btn-ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                button.appendChild(ripple);
                
                // Eliminar el elemento después de la animación
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    /**
     * Configura el audio para la experiencia interactiva
     */
    setupAudio() {
        if (!this.config.enableAudioFeedback) return;
        
        // Crear contenedor de audio
        this.audioPlayer = document.createElement('div');
        this.audioPlayer.id = 'audio-container';
        this.audioPlayer.style.display = 'none';
        document.body.appendChild(this.audioPlayer);
        
        // Cargar sonidos
        this.loadSounds();
        
        console.log('Audio feedback system initialized');
    }
    
    /**
     * Carga los sonidos para la experiencia interactiva
     */
    loadSounds() {
        // Definir sonidos a cargar
        const soundsToLoad = {
            hover: 'audio/hover.mp3',
            click: 'audio/click.mp3',
            transition: 'audio/transition.mp3',
            glitch: 'audio/glitch.mp3',
            ambient: 'audio/ambient.mp3'
        };
        
        // Cargar cada sonido
        for (const [name, path] of Object.entries(soundsToLoad)) {
            const audio = document.createElement('audio');
            audio.id = `sound-${name}`;
            audio.src = path;
            audio.volume = this.config.audioVolume;
            
            if (name === 'ambient') {
                audio.loop = true;
            }
            
            this.audioPlayer.appendChild(audio);
            this.sounds[name] = audio;
        }
    }
    
    /**
     * Reproduce un sonido específico
     */
    playSound(sound) {
        if (!sound) return;
        
        // Si el sonido ya está reproduciéndose, reiniciarlo
        sound.pause();
        sound.currentTime = 0;
        
        // Reproducir sonido
        const playPromise = sound.play();
        
        // Manejar posibles errores de reproducción
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Error playing sound:', error);
            });
        }
    }
    
    /**
     * Alterna la reproducción de audio ambiente
     */
    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        
        const audioToggle = document.querySelector('.audio-toggle');
        if (audioToggle) {
            audioToggle.classList.toggle('audio-on', this.audioEnabled);
        }
        
        if (this.audioEnabled && this.sounds.ambient) {
            this.sounds.ambient.play();
        } else if (this.sounds.ambient) {
            this.sounds.ambient.pause();
        }
        
        console.log(`Audio ${this.audioEnabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Configura la detección de inactividad
     */
    setupIdleDetection() {
        if (!this.config.idleDetection) return;
        
        // Inicializar el temporizador de inactividad
        this.idleTimer = setTimeout(this.onIdle.bind(this), this.idleTimeout);
        
        // Crear video de fondo para modo inactivo
        this.setupIdleVideo();
        
        console.log('Idle detection initialized');
    }
    
    /**
     * Configura el video de fondo para modo inactivo
     */
    setupIdleVideo() {
        // Crear contenedor para el video
        const videoContainer = document.createElement('div');
        videoContainer.className = 'idle-video-container';
        videoContainer.style.position = 'fixed';
        videoContainer.style.top = '0';
        videoContainer.style.left = '0';
        videoContainer.style.width = '100%';
        videoContainer.style.height = '100%';
        videoContainer.style.zIndex = '9990';
        videoContainer.style.opacity = '0';
        videoContainer.style.visibility = 'hidden';
        videoContainer.style.transition = 'opacity 1s ease-in-out, visibility 1s ease-in-out';
        
        // Crear video
        this.idleVideo = document.createElement('video');
        this.idleVideo.className = 'idle-video';
        this.idleVideo.src = 'assets/videos/idle-loop.mp4';
        this.idleVideo.loop = true;
        this.idleVideo.muted = true;
        this.idleVideo.playsInline = true;
        this.idleVideo.style.width = '100%';
        this.idleVideo.style.height = '100%';
        this.idleVideo.style.objectFit = 'cover';
        
        videoContainer.appendChild(this.idleVideo);
        document.body.appendChild(videoContainer);
        
        // Cargar el video previamente
        this.idleVideo.load();
        
        // Guardar referencia al contenedor
        this.idleVideoContainer = videoContainer;
    }
    
    /**
     * Maneja el evento de inactividad
     */
    onIdle() {
        if (this.isPaused) return;
        
        this.isIdle = true;
        
        // Mostrar el video de inactividad
        if (this.idleVideoContainer && this.idleVideo) {
            this.idleVideoContainer.style.visibility = 'visible';
            this.idleVideoContainer.style.opacity = '1';
            
            // Iniciar reproducción después de una transición
            setTimeout(() => {
                this.idleVideo.play().catch(error => {
                    console.error('Error playing idle video:', error);
                });
            }, 100);
        }
        
        // Ocultar el cursor personalizado
        if (this.config.enableCustomCursor) {
            this.cursor.style.opacity = '0';
            this.cursorFollower.style.opacity = '0';
        }
        
        console.log('User is idle, showing ambient experience');
    }
    
    /**
     * Reinicia el temporizador de inactividad
     */
    resetIdleTimer() {
        clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(this.onIdle.bind(this), this.idleTimeout);
        
        // Si estábamos en modo inactivo, salir de él
        if (this.isIdle) {
            this.exitIdleMode();
        }
    }
    
    /**
     * Sale del modo inactivo
     */
    exitIdleMode() {
        this.isIdle = false;
        
        // Ocultar el video de inactividad
        if (this.idleVideoContainer && this.idleVideo) {
            this.idleVideoContainer.style.opacity = '0';
            this.idleVideoContainer.style.visibility = 'hidden';
            
            // Detener el video después de la transición
            setTimeout(() => {
                this.idleVideo.pause();
            }, 1000);
        }
        
        // Mostrar el cursor personalizado
        if (this.config.enableCustomCursor) {
            this.cursor.style.opacity = '1';
            this.cursorFollower.style.opacity = '1';
        }
        
        console.log('User activity detected, exiting idle mode');
    }
    
    /**
     * Maneja el evento de redimensión de ventana
     */
    onResize() {
        // Recalcular posiciones de elementos parallax
        if (this.config.enableParallaxEffects) {
            this.setupParallaxElements();
        }
    }
    
    /**
     * Alterna el modo de pantalla completa
     */
    toggleFullscreen() {
        if (!this.config.enableFullscreenMode) return;
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error al intentar entrar en modo pantalla completa: ${err.message}`);
            });
            this.isFullscreenEnabled = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                this.isFullscreenEnabled = false;
            }
        }
        
        console.log(`Fullscreen mode ${this.isFullscreenEnabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Pausa la experiencia interactiva
     */
    pause() {
        this.isPaused = true;
        
        // Detener animaciones en curso
        if (this.config.enableAudioFeedback && this.sounds.ambient) {
            this.sounds.ambient.pause();
        }
        
        console.log('Interactive experience paused');
    }
    
    /**
     * Reanuda la experiencia interactiva
     */
    resume() {
        this.isPaused = false;
        
        // Reanudar animaciones
        if (this.config.enableAudioFeedback && this.audioEnabled && this.sounds.ambient) {
            this.sounds.ambient.play();
        }
        
        console.log('Interactive experience resumed');
    }
    
    /**
     * Función throttle para limitar la frecuencia de ejecución
     */
    throttle(callback, delay) {
        let last;
        let timer;
        
        return function() {
            const context = this;
            const now = +new Date();
            const args = arguments;
            
            if (last && now < last + delay) {
                clearTimeout(timer);
                timer = setTimeout(function() {
                    last = now;
                    callback.apply(context, args);
                }, delay);
            } else {
                last = now;
                callback.apply(context, args);
            }
        };
    }
}

// Inicializar la experiencia interactiva
document.addEventListener('DOMContentLoaded', () => {
    window.futureExperience = new FutureExperience();
}); 