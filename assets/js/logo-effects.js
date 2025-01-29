document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo-3d');
    
    // Efecto de movimiento con el mouse
    logo.addEventListener('mousemove', (e) => {
        const rect = logo.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const multiplier = 20;
        const rotateX = (y / rect.height) * multiplier;
        const rotateY = -(x / rect.width) * multiplier;
        
        logo.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            scale(1.05)
        `;
    });
    
    // Reset al salir del logo
    logo.addEventListener('mouseleave', () => {
        logo.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
    
    // Efecto de brillo al scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.05;
        
        logo.style.setProperty('--scroll-glow', `${rate}px`);
    });
}); 