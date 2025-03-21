const particlesConfig = {
    particles: {
        number: { value: 80 },
        color: { value: "#ffd700" },
        shape: { type: "star" },
        opacity: { value: 0.5 },
        size: { value: 3 },
        line_linked: {
            enable: true,
            color: "#ffd700"
        }
    }
};

// Inicializar partículas
document.addEventListener('DOMContentLoaded', () => {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', particlesConfig);
    }
}); 