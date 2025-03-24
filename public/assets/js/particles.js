/**
 * Miss Star International - Sistema de Partículas
 * Crea un efecto visual futurista e interactivo para fondos
 */

class ParticlesSystem {
    constructor(selector, options = {}) {
        // Elemento del canvas
        this.containerSelector = selector || '#particles-container';
        this.container = document.querySelector(this.containerSelector);
        
        if (!this.container) {
            console.warn(`Container ${this.containerSelector} not found`);
            return;
        }
        
        // Crear canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        // Dimensiones
        this.width = 0;
        this.height = 0;
        
        // Opciones configurables
        this.options = {
            // Densidad de partículas (por 1000px²)
            density: 100,
            // Color base de las partículas (formato rgba)
            color: {
                r: 212,
                g: 175,
                b: 55,
                a: 0.5
            },
            // Color secundario para gradientes (formato rgba)
            secondaryColor: {
                r: 255,
                g: 255,
                b: 255,
                a: 0.2
            },
            // Tamaño de partículas
            particleSize: {
                min: 1,
                max: 3
            },
            // Velocidad de partículas
            speed: {
                min: 0.2,
                max: 0.8
            },
            // Distancia para conectar partículas
            connectDistance: 150,
            // Grosor máximo de líneas de conexión
            lineWidth: 0.5,
            // Reaccionar al mouse
            interactive: true,
            // Radio de interacción del mouse
            mouseRadius: 150,
            // Fuerza de la interacción
            mouseForce: 20,
            // Modo de renderizado: 'circle', 'square', 'glow'
            renderMode: 'glow',
            // Modo de conexión: 'line', 'triangle', 'none'
            connectionMode: 'line',
            // Permitir que las partículas se muevan en profundidad (efecto 3D)
            enable3D: true,
            // Densidad responsiva (ajustar según tamaño de pantalla)
            responsiveDensity: true,
            // Umbral de responsive
            responsiveThreshold: {
                mobile: 768,
                tablet: 1024
            },
            // Factor de reducción en dispositivos móviles
            mobileDensityFactor: 0.5,
            // Usar degradados
            useGradients: true,
            // Opacidad del fondo (0-1)
            backgroundOpacity: 0,
            // Color de fondo
            backgroundColor: {
                r: 0,
                g: 0,
                b: 0,
                a: 0
            },
            // Opciones personalizadas
            ...options
        };
        
        // Partículas
        this.particles = [];
        
        // Mouse
        this.mouse = {
            x: 0,
            y: 0,
            active: false
        };
        
        // Contador de frames para animación
        this.frameCount = 0;
        
        // Inicializar
        this.init();
    }
    
    /**
     * Inicializar sistema de partículas
     */
    init() {
        // Configurar tamaño de canvas
        this.setupSize();
        
        // Crear partículas
        this.createParticles();
        
        // Configurar eventos
        this.setupEvents();
        
        // Iniciar loop de animación
        this.animate();
        
        console.log('Particles system initialized');
    }
    
    /**
     * Configurar tamaño de canvas
     */
    setupSize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        
        // Escalar para dispositivos de alta densidad
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        
        this.ctx.scale(dpr, dpr);
    }
    
    /**
     * Crear partículas
     */
    createParticles() {
        // Limpiar partículas existentes
        this.particles = [];
        
        // Calcular el número total de partículas basado en el área y densidad
        let totalParticles = Math.floor((this.width * this.height) / 10000 * this.options.density);
        
        // Ajuste responsivo
        if (this.options.responsiveDensity) {
            if (this.width < this.options.responsiveThreshold.mobile) {
                totalParticles *= this.options.mobileDensityFactor;
            } else if (this.width < this.options.responsiveThreshold.tablet) {
                totalParticles *= (this.options.mobileDensityFactor + 0.3);
            }
        }
        
        // Crear partículas
        for (let i = 0; i < totalParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    /**
     * Crear una partícula individual
     * @returns {Object} Objeto partícula
     */
    createParticle() {
        // Posición aleatoria
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;
        
        // Tamaño aleatorio
        const size = Math.random() * (this.options.particleSize.max - this.options.particleSize.min) + this.options.particleSize.min;
        
        // Velocidad aleatoria
        const speed = Math.random() * (this.options.speed.max - this.options.speed.min) + this.options.speed.min;
        const angle = Math.random() * Math.PI * 2;
        
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        // Profundidad para efecto 3D
        const z = this.options.enable3D ? Math.random() * 0.5 + 0.5 : 1;
        
        // Color personalizado
        const color = {...this.options.color};
        const secondaryColor = {...this.options.secondaryColor};
        
        // Variación aleatoria del color
        if (this.options.useGradients) {
            color.r += Math.random() * 20 - 10;
            color.g += Math.random() * 20 - 10;
            color.b += Math.random() * 20 - 10;
            color.a = Math.random() * 0.3 + 0.2;
        }
        
        return {
            x,
            y,
            z,
            size,
            halfSize: size / 2,
            originalSize: size,
            vx,
            vy,
            color,
            secondaryColor,
            originalColor: {...color},
            // Para animación
            phase: Math.random() * Math.PI * 2
        };
    }
    
    /**
     * Configurar eventos
     */
    setupEvents() {
        // Resize
        window.addEventListener('resize', () => {
            this.resize();
        });
        
        // Mouse move
        if (this.options.interactive) {
            this.container.addEventListener('mousemove', (e) => {
                this.handleMouseMove(e);
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.mouse.active = false;
            });
            
            this.container.addEventListener('mouseenter', () => {
                this.mouse.active = true;
            });
            
            // Touch events para móvil
            this.container.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                this.handleMouseMove(touch);
            }, { passive: false });
            
            this.container.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                this.mouse.active = true;
                this.handleMouseMove(touch);
            });
            
            this.container.addEventListener('touchend', () => {
                this.mouse.active = false;
            });
        }
    }
    
    /**
     * Manejar evento de movimiento del mouse
     * @param {Event} e Evento del mouse o touch
     */
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        this.mouse.active = true;
    }
    
    /**
     * Manejar resize
     */
    resize() {
        this.setupSize();
        this.createParticles();
    }
    
    /**
     * Loop de animación
     */
    animate() {
        this.update();
        this.draw();
        
        this.frameCount++;
        
        requestAnimationFrame(() => this.animate());
    }
    
    /**
     * Actualizar estado de partículas
     */
    update() {
        // Actualizar cada partícula
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Mover partícula
            p.x += p.vx;
            p.y += p.vy;
            
            // Rebotar en los bordes
            if (p.x < 0 || p.x > this.width) {
                p.vx *= -1;
                
                // Ajustar posición para evitar escape
                if (p.x < 0) p.x = p.size;
                if (p.x > this.width) p.x = this.width - p.size;
            }
            
            if (p.y < 0 || p.y > this.height) {
                p.vy *= -1;
                
                // Ajustar posición para evitar escape
                if (p.y < 0) p.y = p.size;
                if (p.y > this.height) p.y = this.height - p.size;
            }
            
            // Efecto de pulso
            p.size = p.originalSize + Math.sin(this.frameCount * 0.03 + p.phase) * 0.5;
            p.halfSize = p.size / 2;
            
            // Interacción con el mouse
            if (this.options.interactive && this.mouse.active) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.options.mouseRadius) {
                    // Calcular fuerza (más fuerte en el centro)
                    const force = (this.options.mouseRadius - dist) / this.options.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    
                    // Aplicar fuerza repulsiva
                    p.vx -= Math.cos(angle) * force * 0.01 * this.options.mouseForce;
                    p.vy -= Math.sin(angle) * force * 0.01 * this.options.mouseForce;
                    
                    // Incrementar tamaño temporalmente
                    p.size = p.originalSize * (1 + force * 0.5);
                    p.halfSize = p.size / 2;
                    
                    // Ajustar color
                    p.color.a = p.originalColor.a * (1 + force * 0.5);
                }
            }
            
            // Limitar velocidad
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > this.options.speed.max) {
                const ratio = this.options.speed.max / speed;
                p.vx *= ratio;
                p.vy *= ratio;
            }
        }
    }
    
    /**
     * Dibujar partículas
     */
    draw() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Dibujar fondo si es necesario
        if (this.options.backgroundOpacity > 0) {
            this.ctx.globalAlpha = this.options.backgroundOpacity;
            this.ctx.fillStyle = `rgba(${this.options.backgroundColor.r}, ${this.options.backgroundColor.g}, ${this.options.backgroundColor.b}, ${this.options.backgroundColor.a})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.globalAlpha = 1;
        }
        
        // Ordenar partículas por profundidad (z) para el efecto 3D
        if (this.options.enable3D) {
            this.particles.sort((a, b) => a.z - b.z);
        }
        
        // Dibujar conexiones primero (detrás de las partículas)
        if (this.options.connectionMode !== 'none') {
            this.drawConnections();
        }
        
        // Dibujar partículas
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            this.drawParticle(p);
        }
    }
    
    /**
     * Dibujar una partícula
     * @param {Object} p Partícula a dibujar
     */
    drawParticle(p) {
        // Ajustar opacidad basada en profundidad
        const alpha = this.options.enable3D ? p.color.a * p.z : p.color.a;
        const size = this.options.enable3D ? p.size * p.z : p.size;
        
        switch (this.options.renderMode) {
            case 'square':
                this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
                this.ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
                break;
                
            case 'glow':
                // Crear gradiente radial para efecto de brillo
                const gradient = this.ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, size * 2
                );
                
                gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`);
                gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Añadir punto central más brillante
                this.ctx.fillStyle = `rgba(${p.secondaryColor.r}, ${p.secondaryColor.g}, ${p.secondaryColor.b}, ${alpha * 1.5})`;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, size * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'circle':
            default:
                this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
        }
    }
    
    /**
     * Dibujar conexiones entre partículas
     */
    drawConnections() {
        switch (this.options.connectionMode) {
            case 'triangle':
                this.drawTriangleConnections();
                break;
                
            case 'line':
            default:
                this.drawLineConnections();
                break;
        }
    }
    
    /**
     * Dibujar conexiones como líneas
     */
    drawLineConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                
                // Calcular distancia
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Solo conectar si están cerca
                if (distance < this.options.connectDistance) {
                    // Calcular opacidad basada en distancia
                    const opacity = (1 - distance / this.options.connectDistance) * 0.5;
                    
                    // Ajustar grosor de línea basado en distancia
                    const lineWidth = this.options.lineWidth * (1 - distance / this.options.connectDistance);
                    
                    // Calcular color mezclado
                    const r = Math.floor((p1.color.r + p2.color.r) / 2);
                    const g = Math.floor((p1.color.g + p2.color.g) / 2);
                    const b = Math.floor((p1.color.b + p2.color.b) / 2);
                    
                    // Dibujar línea
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                    this.ctx.lineWidth = lineWidth;
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    /**
     * Dibujar conexiones como triángulos
     */
    drawTriangleConnections() {
        for (let i = 0; i < this.particles.length - 2; i++) {
            const p1 = this.particles[i];
            
            for (let j = i + 1; j < this.particles.length - 1; j++) {
                const p2 = this.particles[j];
                
                // Calcular distancia 1-2
                const dx12 = p1.x - p2.x;
                const dy12 = p1.y - p2.y;
                const distance12 = Math.sqrt(dx12 * dx12 + dy12 * dy12);
                
                if (distance12 < this.options.connectDistance) {
                    for (let k = j + 1; k < this.particles.length; k++) {
                        const p3 = this.particles[k];
                        
                        // Calcular las otras distancias
                        const dx13 = p1.x - p3.x;
                        const dy13 = p1.y - p3.y;
                        const distance13 = Math.sqrt(dx13 * dx13 + dy13 * dy13);
                        
                        const dx23 = p2.x - p3.x;
                        const dy23 = p2.y - p3.y;
                        const distance23 = Math.sqrt(dx23 * dx23 + dy23 * dy23);
                        
                        // Solo dibujar si todas las distancias son cortas
                        if (distance13 < this.options.connectDistance && distance23 < this.options.connectDistance) {
                            // Calcular opacidad media basada en distancias
                            const opacity = (3 - distance12 / this.options.connectDistance - 
                                        distance13 / this.options.connectDistance - 
                                        distance23 / this.options.connectDistance) / 6;
                            
                            // Calcular color mezclado
                            const r = Math.floor((p1.color.r + p2.color.r + p3.color.r) / 3);
                            const g = Math.floor((p1.color.g + p2.color.g + p3.color.g) / 3);
                            const b = Math.floor((p1.color.b + p2.color.b + p3.color.b) / 3);
                            
                            // Dibujar triángulo
                            this.ctx.beginPath();
                            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`;
                            this.ctx.moveTo(p1.x, p1.y);
                            this.ctx.lineTo(p2.x, p2.y);
                            this.ctx.lineTo(p3.x, p3.y);
                            this.ctx.closePath();
                            this.ctx.fill();
                            
                            // Limitar a un número máximo de triángulos por frame
                            if (k > i + 10) break;
                        }
                    }
                }
            }
        }
    }
}

// Inicializar al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    // Detectar contenedor de partículas
    const particlesContainer = document.querySelector('#particles-container') || 
                              document.querySelector('.particles-container');
    
    if (particlesContainer) {
        // Opciones personalizadas para Miss Star
        const options = {
            density: 80,
            color: {
                r: 212, // Dorado
                g: 175,
                b: 55,
                a: 0.6
            },
            secondaryColor: {
                r: 255, // Blanco
                g: 255,
                b: 255,
                a: 0.8
            },
            particleSize: {
                min: 1,
                max: 3
            },
            connectDistance: 120,
            lineWidth: 0.4,
            renderMode: 'glow',
            useGradients: true,
            enable3D: true,
            // Ajustes móviles
            responsiveDensity: true,
            mobileDensityFactor: 0.4
        };
        
        // Crear instancia
        const particlesSystem = new ParticlesSystem(particlesContainer, options);
        
        // Exponer a window si es necesario
        window.particlesSystem = particlesSystem;
    }
}); 