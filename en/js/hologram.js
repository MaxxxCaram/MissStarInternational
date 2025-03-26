/**
 * Miss Star International - Efectos Holográficos
 * Implementa visualizaciones 3D holográficas usando Three.js
 */

class HologramSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        // Propiedades
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        this.mixers = [];
        this.models = {};
        this.lights = [];
        this.isInitialized = false;
        this.animationId = null;
        this.particleSystem = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.isActive = true;
        this.glowIntensity = 0.8;
        this.glowColor = new THREE.Color(0x00ffff);
        this.autoRotate = true;
        
        // Inicializar el sistema
        this.init();
        
        // Agregar listeners de eventos
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.addEventListener('click', this.onMouseClick.bind(this));
    }
    
    /**
     * Inicializa el sistema holográfico
     */
    init() {
        // Crear la escena
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparente para mezclarse con el CSS
        
        // Configurar la cámara
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const aspect = width / height;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 10);
        
        // Configurar el renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.container.appendChild(this.renderer.domElement);
        
        // Agregar luces
        this.addLights();
        
        // Configurar efectos de postprocesamiento
        this.setupPostprocessing();
        
        // Iniciar la animación
        this.animate();
        
        this.isInitialized = true;
        console.log('Hologram system initialized');
    }
    
    /**
     * Agrega luces a la escena
     */
    addLights() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x2233ff, 0.3);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        
        // Luz principal
        const mainLight = new THREE.DirectionalLight(0x00ffff, 0.7);
        mainLight.position.set(0, 10, 10);
        this.scene.add(mainLight);
        this.lights.push(mainLight);
        
        // Luz de relleno
        const fillLight = new THREE.PointLight(0xff00ff, 0.5);
        fillLight.position.set(-10, 0, -10);
        this.scene.add(fillLight);
        this.lights.push(fillLight);
        
        // Luz de acento
        const accentLight = new THREE.PointLight(0x00ffaa, 1);
        accentLight.position.set(10, -5, 0);
        this.scene.add(accentLight);
        this.lights.push(accentLight);
        
        // Efecto pulsante para las luces
        this.pulseLights();
    }
    
    /**
     * Crea efecto pulsante para las luces
     */
    pulseLights() {
        // Animar luces con efecto pulsante
        const pulsate = () => {
            const time = this.clock.getElapsedTime();
            
            // Variar la intensidad de forma sinusoidal
            this.lights[1].intensity = 0.7 + Math.sin(time * 2) * 0.3;
            this.lights[2].intensity = 0.5 + Math.sin(time * 1.5 + 1) * 0.2;
            this.lights[3].intensity = 1 + Math.sin(time * 3 + 2) * 0.4;
            
            // Recalcular las luces
            requestAnimationFrame(pulsate);
        };
        
        pulsate();
    }
    
    /**
     * Configura efectos de postprocesamiento
     */
    setupPostprocessing() {
        // Se implementará en versiones futuras
        // Incluirá bloom, glow, aberración cromática, etc.
    }
    
    /**
     * Crea un globo terráqueo holográfico 3D
     */
    createHolographicGlobe(options = {}) {
        const radius = options.radius || 5;
        const detail = options.detail || 64;
        const glowColor = options.glowColor || 0x00ffff;
        const pointColor = options.pointColor || 0xffffff;
        const markerLocations = options.markerLocations || [];
        
        // Grupo para contener los elementos del globo
        const globeGroup = new THREE.Group();
        this.scene.add(globeGroup);
        
        // Geometría esférica
        const geometry = new THREE.SphereGeometry(radius, detail, detail);
        
        // Material holográfico semitransparente
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x0088ff,
            metalness: 0.2,
            roughness: 0.1,
            opacity: 0.2,
            transparent: true,
            side: THREE.DoubleSide,
            envMapIntensity: 1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            wireframe: true
        });
        
        // Esfera central
        const globe = new THREE.Mesh(geometry, material);
        globeGroup.add(globe);
        
        // Añadir líneas de latitud y longitud
        this.addGlobeGrid(globe, radius);
        
        // Añadir marcadores de puntos para las ubicaciones de franquicias
        this.addLocationMarkers(globeGroup, radius, markerLocations, pointColor);
        
        // Añadir efecto de glow atmosférico
        this.addGlowEffect(globeGroup, radius * 1.05, glowColor);
        
        // Almacenar referencia
        this.models.globe = globeGroup;
        
        // Aplicar rotación automática
        if (this.autoRotate) {
            this.rotateGlobe(globeGroup);
        }
        
        return globeGroup;
    }
    
    /**
     * Agrega una cuadrícula de líneas al globo
     */
    addGlobeGrid(globe, radius) {
        // Líneas de longitud
        for (let i = 0; i < 24; i++) {
            const phi = (i / 24) * Math.PI * 2;
            const points = [];
            
            for (let j = 0; j <= 180; j++) {
                const theta = (j / 180) * Math.PI;
                const x = radius * Math.sin(theta) * Math.cos(phi);
                const y = radius * Math.cos(theta);
                const z = radius * Math.sin(theta) * Math.sin(phi);
                
                points.push(new THREE.Vector3(x, y, z));
            }
            
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x0088ff,
                transparent: true,
                opacity: 0.3
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            globe.add(line);
        }
        
        // Líneas de latitud
        for (let i = 0; i < 12; i++) {
            const theta = (i / 12) * Math.PI;
            const points = [];
            
            for (let j = 0; j <= 64; j++) {
                const phi = (j / 64) * Math.PI * 2;
                const x = radius * Math.sin(theta) * Math.cos(phi);
                const y = radius * Math.cos(theta);
                const z = radius * Math.sin(theta) * Math.sin(phi);
                
                points.push(new THREE.Vector3(x, y, z));
            }
            
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x0088ff,
                transparent: true,
                opacity: 0.3
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            globe.add(line);
        }
    }
    
    /**
     * Añade marcadores para ubicaciones en el globo
     */
    addLocationMarkers(globeGroup, radius, locations, color) {
        const pointsMaterial = new THREE.PointsMaterial({
            color: color || 0xffffff,
            size: 0.2,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const pointsGeometry = new THREE.BufferGeometry();
        const positions = [];
        
        // Convertir coordenadas a posiciones 3D
        locations.forEach(location => {
            const lat = location.lat * (Math.PI / 180);
            const lng = location.lng * (Math.PI / 180);
            
            const x = radius * Math.cos(lat) * Math.cos(lng);
            const y = radius * Math.sin(lat);
            const z = radius * Math.cos(lat) * Math.sin(lng);
            
            positions.push(x, y, z);
        });
        
        pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        globeGroup.add(points);
        
        // Añadir efectos de brillo para cada punto
        locations.forEach((location, index) => {
            const lat = location.lat * (Math.PI / 180);
            const lng = location.lng * (Math.PI / 180);
            
            const x = radius * Math.cos(lat) * Math.cos(lng);
            const y = radius * Math.sin(lat);
            const z = radius * Math.cos(lat) * Math.sin(lng);
            
            const pointLight = new THREE.PointLight(0xffaa00, 0.5, 2);
            pointLight.position.set(x, y, z);
            globeGroup.add(pointLight);
            
            // Pulsar aleatoriamente
            const speed = 0.5 + Math.random() * 2;
            const offset = Math.random() * Math.PI * 2;
            
            const animate = () => {
                const time = this.clock.getElapsedTime();
                pointLight.intensity = 0.2 + Math.sin(time * speed + offset) * 0.3;
                requestAnimationFrame(animate);
            };
            
            animate();
        });
    }
    
    /**
     * Añade un efecto de brillo atmosférico al globo
     */
    addGlowEffect(globeGroup, radius, color) {
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                'c': { value: 0.2 },
                'p': { value: 4.0 },
                glowColor: { value: new THREE.Color(color) },
                viewVector: { value: new THREE.Vector3(0, 0, 0) }
            },
            vertexShader: `
                uniform vec3 viewVector;
                uniform float c;
                uniform float p;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normal);
                    vec3 vNormel = normalize(viewVector);
                    intensity = pow(c - dot(vNormal, vNormel), p);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, intensity);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        const glowGeometry = new THREE.SphereGeometry(radius, 32, 32);
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        globeGroup.add(glowMesh);
        
        // Actualizar el vector de vista para el shader
        const updateViewVector = () => {
            const viewVector = new THREE.Vector3().subVectors(
                this.camera.position,
                glowMesh.position
            );
            glowMaterial.uniforms.viewVector.value = viewVector;
            requestAnimationFrame(updateViewVector);
        };
        
        updateViewVector();
    }
    
    /**
     * Aplica rotación automática a un objeto
     */
    rotateGlobe(object) {
        const rotationAnimation = () => {
            const time = this.clock.getElapsedTime();
            object.rotation.y = time * 0.1;
            requestAnimationFrame(rotationAnimation);
        };
        
        rotationAnimation();
    }
    
    /**
     * Crea un modelo de corona holográfica
     */
    createHolographicCrown(options = {}) {
        const size = options.size || 2;
        const detail = options.detail || 32;
        const color = options.color || 0xffcc00;
        
        const crownGroup = new THREE.Group();
        this.scene.add(crownGroup);
        
        // Base de la corona
        const baseGeometry = new THREE.CylinderGeometry(size, size * 1.2, size * 0.4, detail);
        const baseMaterial = new THREE.MeshPhysicalMaterial({
            color: color,
            metalness: 1.0,
            roughness: 0.2,
            opacity: 0.5,
            transparent: true,
            side: THREE.DoubleSide,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -size * 0.2;
        crownGroup.add(base);
        
        // Añadir puntas
        const spikes = 5;
        const spikeHeight = size * 1.5;
        
        for (let i = 0; i < spikes; i++) {
            const angle = (i / spikes) * Math.PI * 2;
            const x = Math.cos(angle) * size * 0.6;
            const z = Math.sin(angle) * size * 0.6;
            
            const spikeGeometry = new THREE.ConeGeometry(size * 0.15, spikeHeight, 8);
            const spike = new THREE.Mesh(spikeGeometry, baseMaterial);
            
            spike.position.set(x, spikeHeight * 0.4, z);
            spike.rotation.x = Math.PI / 2;
            
            crownGroup.add(spike);
        }
        
        // Añadir joyas
        const gemColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
        
        for (let i = 0; i < spikes; i++) {
            const angle = (i / spikes) * Math.PI * 2;
            const x = Math.cos(angle) * size * 0.8;
            const z = Math.sin(angle) * size * 0.8;
            
            const gemGeometry = new THREE.SphereGeometry(size * 0.2, 16, 16);
            const gemMaterial = new THREE.MeshPhysicalMaterial({
                color: gemColors[i % gemColors.length],
                metalness: 0.0,
                roughness: 0.1,
                opacity: 0.8,
                transparent: true,
                clearcoat: 1.0,
                clearcoatRoughness: 0.0
            });
            
            const gem = new THREE.Mesh(gemGeometry, gemMaterial);
            gem.position.set(x, 0, z);
            crownGroup.add(gem);
            
            // Añadir luz a cada gema
            const gemLight = new THREE.PointLight(gemColors[i % gemColors.length], 0.5, 2);
            gemLight.position.set(x, 0, z);
            crownGroup.add(gemLight);
        }
        
        // Añadir reflexión central
        const centerLight = new THREE.PointLight(0xffffff, 0.8, 5);
        centerLight.position.set(0, 0, 0);
        crownGroup.add(centerLight);
        
        // Efecto flotante
        this.floatObject(crownGroup);
        
        // Almacenar referencia
        this.models.crown = crownGroup;
        
        return crownGroup;
    }
    
    /**
     * Añade efecto de flotación a un objeto
     */
    floatObject(object) {
        const initialY = object.position.y;
        
        const floatAnimation = () => {
            const time = this.clock.getElapsedTime();
            
            // Movimiento suave arriba y abajo
            object.position.y = initialY + Math.sin(time * 1.5) * 0.2;
            
            // Rotación lenta
            object.rotation.y = time * 0.2;
            
            requestAnimationFrame(floatAnimation);
        };
        
        floatAnimation();
    }
    
    /**
     * Crea un holograma proyectado hacia arriba
     */
    createProjectedHologram(options = {}) {
        const width = options.width || 4;
        const height = options.height || 6;
        const image = options.image;
        const animate = options.animate !== undefined ? options.animate : true;
        
        // Grupo contenedor
        const hologramGroup = new THREE.Group();
        this.scene.add(hologramGroup);
        
        // Base circular
        const baseGeometry = new THREE.CylinderGeometry(width * 0.7, width * 0.9, 0.2, 32);
        const baseMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00ffff,
            metalness: 1.0,
            roughness: 0.2,
            opacity: 0.5,
            transparent: true
        });
        
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -height / 2 - 0.1;
        hologramGroup.add(base);
        
        // Haz de luz proyectado
        const beamGeometry = new THREE.CylinderGeometry(width * 0.1, width * 0.6, height, 32, 1, true);
        const beamMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffff) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                void main() {
                    float intensity = 0.3 + 0.7 * sin(vUv.y * 30.0 + time * 5.0);
                    vec3 glow = color * intensity;
                    float alpha = clamp(intensity * (1.0 - vUv.y), 0.0, 0.5);
                    gl_FragColor = vec4(glow, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.y = 0;
        hologramGroup.add(beam);
        
        // Contenido del holograma
        let hologramContent;
        
        if (image) {
            // Si hay una imagen, crear un plano con la textura
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(image);
            const contentMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            
            const contentGeometry = new THREE.PlaneGeometry(width, height);
            hologramContent = new THREE.Mesh(contentGeometry, contentMaterial);
        } else {
            // Si no hay imagen, crear un cubo wireframe
            const contentGeometry = new THREE.BoxGeometry(width * 0.7, height * 0.7, width * 0.7);
            const contentMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });
            
            hologramContent = new THREE.Mesh(contentGeometry, contentMaterial);
        }
        
        hologramContent.position.y = 0;
        hologramGroup.add(hologramContent);
        
        // Efecto de parpadeo y fluctuación
        if (animate) {
            const flickerAnimation = () => {
                const time = this.clock.getElapsedTime();
                
                // Actualizar tiempo para el shader del haz
                beamMaterial.uniforms.time.value = time;
                
                // Fluctuación de opacidad para el contenido
                if (hologramContent.material instanceof Array) {
                    hologramContent.material.forEach(mat => {
                        mat.opacity = 0.6 + Math.sin(time * 3) * 0.2 + Math.random() * 0.1;
                    });
                } else {
                    hologramContent.material.opacity = 0.6 + Math.sin(time * 3) * 0.2 + Math.random() * 0.1;
                }
                
                // Pequeñas fluctuaciones de posición
                hologramContent.position.y = Math.sin(time * 2) * 0.1;
                
                // Rotación lenta
                hologramContent.rotation.y = time * 0.5;
                
                requestAnimationFrame(flickerAnimation);
            };
            
            flickerAnimation();
        }
        
        // Añadir líneas de escaneo
        this.addScanLines(hologramContent, width, height);
        
        // Almacenar referencia
        this.models.hologram = hologramGroup;
        
        return hologramGroup;
    }
    
    /**
     * Añade líneas de escaneo a un objeto
     */
    addScanLines(object, width, height) {
        const scanLineGeometry = new THREE.PlaneGeometry(width * 2, 0.05);
        const scanLineMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const scanLine = new THREE.Mesh(scanLineGeometry, scanLineMaterial);
        object.add(scanLine);
        
        // Animación de línea de escaneo
        const scanAnimation = () => {
            const time = this.clock.getElapsedTime();
            
            // Mover la línea de abajo hacia arriba
            scanLine.position.y = -height/2 + (time % 2) * height;
            
            // Oscilar opacidad
            scanLine.material.opacity = 0.4 + Math.sin(time * 10) * 0.2;
            
            requestAnimationFrame(scanAnimation);
        };
        
        scanAnimation();
    }
    
    /**
     * Ajusta el tamaño del renderer cuando cambia la ventana
     */
    onWindowResize() {
        if (!this.camera || !this.renderer || !this.container) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    /**
     * Maneja el movimiento del ratón
     */
    onMouseMove(event) {
        // Calcular coordenadas del ratón normalizadas (-1 a +1)
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    }
    
    /**
     * Maneja el clic del ratón
     */
    onMouseClick(event) {
        // Implementar interacción con objetos
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Verificar intersecciones con objetos interactivos
        const objects = [];
        this.scene.traverse(object => {
            if (object.userData && object.userData.interactive) {
                objects.push(object);
            }
        });
        
        const intersects = this.raycaster.intersectObjects(objects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            
            // Disparar evento de clic en el objeto
            if (object.userData && object.userData.onClick) {
                object.userData.onClick(object);
            }
        }
    }
    
    /**
     * Bucle de animación principal
     */
    animate() {
        if (!this.isActive) return;
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        
        const delta = this.clock.getDelta();
        
        // Actualizar mezcladores de animación
        this.mixers.forEach(mixer => mixer.update(delta));
        
        // Renderizar la escena
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    /**
     * Detiene la animación y libera recursos
     */
    dispose() {
        this.isActive = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Quitar event listeners
        window.removeEventListener('resize', this.onWindowResize);
        if (this.container) {
            this.container.removeEventListener('mousemove', this.onMouseMove);
            this.container.removeEventListener('click', this.onMouseClick);
        }
        
        // Limpiar escena
        if (this.scene) {
            this.scene.traverse(object => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
        
        // Limpiar renderer
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
        
        console.log('Hologram system disposed');
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si Three.js está disponible
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded. Make sure to include it before this script.');
        return;
    }
    
    // No inicializar automáticamente, será inicializado por el sistema principal cuando esté listo
}); 