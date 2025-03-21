class StarField {
    constructor() {
        if (!this.checkWebGLSupport()) {
            console.warn('WebGL no soportado - StarField desactivado');
            return;
        }
        
        this.init();
    }

    checkWebGLSupport() {
        try {
            return !!window.WebGLRenderingContext && 
                   !!document.createElement('canvas').getContext('webgl');
        } catch(e) {
            return false;
        }
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true
        });
        
        this.setupScene();
        this.animate();
        this.handleResize();
    }

    setupScene() {
        const container = document.querySelector('.hero-cyber');
        if (!container) {
            console.error('Container .hero-cyber no encontrado');
            return;
        }

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);
        
        // Optimizar la creación de estrellas
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffd700,
            size: 0.25
        });

        const starVertices = [];
        for(let i = 0; i < 1000; i++) {
            const x = THREE.MathUtils.randFloatSpread(100);
            const y = THREE.MathUtils.randFloatSpread(100);
            const z = THREE.MathUtils.randFloatSpread(100);
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', 
            new THREE.Float32BufferAttribute(starVertices, 3));
        
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
        this.camera.position.z = 30;
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        if (!this.renderer) return;
        
        requestAnimationFrame(() => this.animate());
        this.stars.rotation.x += 0.0001;
        this.stars.rotation.y += 0.0002;
        this.renderer.render(this.scene, this.camera);
    }
} 