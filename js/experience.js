// Animación de timeline
document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.5
    });

    timelineItems.forEach(item => observer.observe(item));
});

// Parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelector('.experience-content').style.transform = 
        `translateY(${scrolled * 0.5}px)`;
}); 