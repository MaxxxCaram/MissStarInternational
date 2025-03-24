/**
 * PARTICLES.JS - Sistema de partículas para Miss Star International
 * Crea un fondo interactivo con partículas futuristas
 */

document.addEventListener('DOMContentLoaded', () => {
  // Verificar si particlesJS está disponible
  if (typeof particlesJS === 'undefined') {
    // Cargar particlesJS dinámicamente si no está disponible
    loadParticlesJS().then(() => {
      initParticles();
    }).catch(error => {
      console.error('Error al cargar particlesJS:', error);
    });
  } else {
    // Inicializar particlesJS si ya está disponible
    initParticles();
  }
});

/**
 * Carga dinámicamente la biblioteca particlesJS
 * @returns {Promise} Promesa que se resuelve cuando se carga la biblioteca
 */
function loadParticlesJS() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Inicializa la configuración de partículas
 */
function initParticles() {
  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#0ff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        }
      },
      "opacity": {
        "value": 0.6,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 2,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#0ff",
        "opacity": 0.2,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": true,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 0.6
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });

  // Configuración secundaria para efectos adicionales
  createStarsEffect();
}

/**
 * Crea un efecto de estrellas distantes en el fondo
 */
function createStarsEffect() {
  // Crear un canvas secundario para estrellas de fondo
  const starsCanvas = document.createElement('canvas');
  starsCanvas.id = 'stars-canvas';
  starsCanvas.style.position = 'fixed';
  starsCanvas.style.top = '0';
  starsCanvas.style.left = '0';
  starsCanvas.style.width = '100%';
  starsCanvas.style.height = '100%';
  starsCanvas.style.pointerEvents = 'none';
  starsCanvas.style.zIndex = '-1';
  
  // Insertar el canvas antes del canvas de particlesJS
  const particlesCanvas = document.querySelector('#particles-js');
  if (particlesCanvas && particlesCanvas.parentNode) {
    particlesCanvas.parentNode.insertBefore(starsCanvas, particlesCanvas);
  } else {
    document.body.appendChild(starsCanvas);
  }
  
  // Configurar canvas
  const ctx = starsCanvas.getContext('2d');
  
  // Ajustar tamaño del canvas al tamaño de la ventana
  function resizeCanvas() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
    
    // Volver a dibujar estrellas después de redimensionar
    drawStars();
  }
  
  // Inicializar estrellas
  const stars = [];
  const starColors = ['#fff', '#0ff', '#f0f', '#ff0', '#D4AF37'];
  
  function initStars() {
    stars.length = 0; // Limpiar array
    
    // Crear estrellas aleatorias
    const starCount = Math.floor(window.innerWidth * window.innerHeight / 2000);
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * starsCanvas.width,
        y: Math.random() * starsCanvas.height,
        radius: Math.random() * 1.5,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        blinkSpeed: 0.005 + Math.random() * 0.01,
        blinkOffset: Math.random() * Math.PI * 2,
        opacity: 0.1 + Math.random() * 0.4
      });
    }
  }
  
  // Dibujar estrellas
  function drawStars() {
    // Limpiar canvas
    ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    
    // Dibujar cada estrella
    const time = Date.now() * 0.001;
    
    stars.forEach(star => {
      // Parpadeo basado en seno con offset
      const blink = Math.sin(time * star.blinkSpeed + star.blinkOffset);
      const opacity = star.opacity * (0.5 + blink * 0.5);
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = opacity;
      ctx.fill();
    });
    
    // Solicitar siguiente frame para animación
    requestAnimationFrame(drawStars);
  }
  
  // Inicializar
  resizeCanvas();
  initStars();
  drawStars();
  
  // Manejar cambios de tamaño de ventana
  window.addEventListener('resize', () => {
    resizeCanvas();
    initStars();
  });
}

/**
 * Crea un efecto de vórtice en el fondo
 * Se activa cuando el usuario hace scroll más allá de cierto punto
 */
function createVortexEffect() {
  // Verificar si particlesJS está disponible
  if (typeof particlesJS === 'undefined') return;
  
  // El efecto de vórtice solo se activa en secciones específicas
  const sectionsWithVortex = document.querySelectorAll('.competition-section, .about-section');
  
  // Verificar cuando una sección entra en el viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Modifica la configuración de partículas para crear un efecto de vórtice
        particlesJS('particles-js', {
          "particles": {
            "number": {
              "value": 120,
              "density": {
                "enable": true,
                "value_area": 800
              }
            },
            "color": {
              "value": ["#0ff", "#f0f", "#D4AF37"]
            },
            "shape": {
              "type": "circle",
              "stroke": {
                "width": 0,
                "color": "#000000"
              }
            },
            "opacity": {
              "value": 0.5,
              "random": true,
              "anim": {
                "enable": true,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
              }
            },
            "size": {
              "value": 3,
              "random": true,
              "anim": {
                "enable": true,
                "speed": 2,
                "size_min": 0.1,
                "sync": false
              }
            },
            "line_linked": {
              "enable": true,
              "distance": 150,
              "color": "#0ff",
              "opacity": 0.2,
              "width": 1
            },
            "move": {
              "enable": true,
              "speed": 3,
              "direction": "none",
              "random": false,
              "straight": false,
              "out_mode": "out",
              "bounce": false,
              "attract": {
                "enable": true,
                "rotateX": 1200,
                "rotateY": 1200
              }
            }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": {
                "enable": true,
                "mode": "repulse"
              },
              "onclick": {
                "enable": true,
                "mode": "push"
              },
              "resize": true
            },
            "modes": {
              "grab": {
                "distance": 140,
                "line_linked": {
                  "opacity": 0.6
                }
              },
              "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
              },
              "repulse": {
                "distance": 200,
                "duration": 0.4
              },
              "push": {
                "particles_nb": 4
              },
              "remove": {
                "particles_nb": 2
              }
            }
          },
          "retina_detect": true
        });
      } else {
        // Volver a la configuración normal cuando la sección sale del viewport
        initParticles();
      }
    });
  }, {
    threshold: 0.3 // Se activa cuando al menos el 30% de la sección es visible
  });
  
  // Observar secciones
  sectionsWithVortex.forEach(section => {
    observer.observe(section);
  });
}

// Inicializar efecto de vórtice cuando la página está lista
document.addEventListener('DOMContentLoaded', () => {
  // Esperar a que las partículas estén inicializadas
  setTimeout(() => {
    createVortexEffect();
  }, 2000);
});

// Exportar funciones para uso en otros scripts
window.MissStarParticles = {
  initParticles,
  createStarsEffect,
  createVortexEffect
};

class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Container with ID "${containerId}" not found.`);
            return;
        }
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.particles = [];
        this.connections = [];
        this.mouse = {
            x: null,
            y: null,
            radius: 150
        };
        
        this.colors = {
            primary: '#00e5ff',
            secondary: '#ff0080',
            tertiary: '#6a1b9a'
        };
        
        this.particleCount = this.calculateParticleCount();
        this.lastTime = 0;
        this.initialized = false;
        
        // Inicializar el sistema
        this.init();
    }
    
    /**
     * Calcula el número de partículas según el tamaño de la pantalla
     */
    calculateParticleCount() {
        const width = window.innerWidth;
        if (width <= 768) {
            return 75; // Móviles
        } else if (width <= 1200) {
            return 100; // Tabletas
        } else {
            return 150; // Escritorio
        }
    }
    
    /**
     * Inicializa el sistema de partículas
     */
    init() {
        // Configurar canvas a pantalla completa
        this.setCanvasSize();
        
        // Crear partículas iniciales
        this.createParticles();
        
        // Agregar eventos
        window.addEventListener('resize', () => this.setCanvasSize());
        window.addEventListener('mousemove', (e) => this.trackMouse(e));
        window.addEventListener('touchmove', (e) => this.trackTouch(e));
        window.addEventListener('mouseout', () => this.resetMouse());
        
        // Iniciar animación
        this.animate(0);
        this.initialized = true;
        
        console.log('Particle system initialized with', this.particleCount, 'particles');
    }
    
    /**
     * Establece el tamaño del canvas al tamaño de la ventana
     */
    setCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Recalcular partículas si cambia significativamente el tamaño
        const newCount = this.calculateParticleCount();
        if (Math.abs(newCount - this.particleCount) > 20) {
            this.particleCount = newCount;
            this.createParticles();
        }
    }
    
    /**
     * Crea las partículas iniciales
     */
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: this.getRandomColor(),
                blink: Math.random() > 0.9,
                blinkSpeed: 0.01 + Math.random() * 0.02,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    /**
     * Obtiene un color aleatorio del esquema
     */
    getRandomColor() {
        const colors = [this.colors.primary, this.colors.secondary, this.colors.tertiary];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    /**
     * Rastrea la posición del mouse
     */
    trackMouse(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
    
    /**
     * Rastrea la posición del toque
     */
    trackTouch(e) {
        if (e.touches.length > 0) {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }
    }
    
    /**
     * Resetea la posición del mouse cuando sale del canvas
     */
    resetMouse() {
        this.mouse.x = null;
        this.mouse.y = null;
    }
    
    /**
     * Actualiza las partículas (posición, tamaño, etc.)
     */
    updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Mover partículas
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Hacer parpadear algunas partículas
            if (p.blink) {
                p.opacity += p.blinkSpeed;
                if (p.opacity >= 0.8 || p.opacity <= 0.2) {
                    p.blinkSpeed *= -1;
                }
            }
            
            // Comprobación de límites
            if (p.x > this.canvas.width) {
                p.x = 0;
            } else if (p.x < 0) {
                p.x = this.canvas.width;
            }
            
            if (p.y > this.canvas.height) {
                p.y = 0;
            } else if (p.y < 0) {
                p.y = this.canvas.height;
            }
            
            // Interacción con el ratón
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    // Calcular fuerza de repulsión
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const dirX = dx / distance;
                    const dirY = dy / distance;
                    
                    // Repeler partículas
                    p.x -= dirX * force * 2;
                    p.y -= dirY * force * 2;
                    p.opacity = Math.min(0.8, p.opacity + 0.1); // Aumentar opacidad durante interacción
                }
            }
        }
    }
    
    /**
     * Dibuja las partículas en el canvas
     */
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar conexiones primero
        this.drawConnections();
        
        // Dibujar partículas
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }
    }
    
    /**
     * Dibuja conexiones entre partículas cercanas
     */
    drawConnections() {
        const maxDistance = 150;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // Calcular opacidad basada en la distancia
                    const opacity = 1 - (distance / maxDistance);
                    
                    // Dibujar línea
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = p1.color; // Usar color de primera partícula
                    this.ctx.globalAlpha = opacity * 0.2; // Reducir opacidad
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    /**
     * Anima el sistema de partículas
     */
    animate(timestamp) {
        // Calcular delta time para animación suave
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Actualizar y dibujar partículas
        if (deltaTime < 100) { // Evitar saltos grandes
            this.updateParticles();
        }
        this.drawParticles();
        
        // Continuar el bucle de animación
        requestAnimationFrame((timestamp) => this.animate(timestamp));
    }
}

// Inicializar el sistema de partículas cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    const particles = new ParticleSystem('particles-js');
});

// Exportar la clase para uso en otros scripts
window.ParticleSystem = ParticleSystem; 