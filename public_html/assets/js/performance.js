// Defer non-critical resources
document.addEventListener('DOMContentLoaded', () => {
    // Load non-critical CSS
    const deferredStyles = document.querySelectorAll('link[data-defer]');
    deferredStyles.forEach(style => {
        style.setAttribute('rel', 'stylesheet');
    });

    // Initialize WebGL effects
    initWebGL();
});

// WebGL initialization
function initWebGL() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    // ... configuración WebGL
} 