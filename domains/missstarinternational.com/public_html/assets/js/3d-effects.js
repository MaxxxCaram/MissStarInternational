class StarField {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        
        this.init();
        this.animate();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector('.hero-cyber').appendChild(this.renderer.domElement);

        // Crear estrellas
        const geometry = new THREE.SphereGeometry(0.25, 24, 24);
        const material = new THREE.MeshBasicMaterial({ color: 0xffd700 });

        for(let i = 0; i < 1000; i++) {
            const star = new THREE.Mesh(geometry, material);
            const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
            star.position.set(x, y, z);
            this.scene.add(star);
        }

        this.camera.position.z = 30;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.scene.rotation.x += 0.001;
        this.scene.rotation.y += 0.002;
        this.renderer.render(this.scene, this.camera);
    }
} 