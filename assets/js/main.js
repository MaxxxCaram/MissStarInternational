document.addEventListener('DOMContentLoaded', () => {
    // Initialize video background
    const video = document.getElementById('heroVideo');
    if (video) {
        video.play().catch(function(error) {
            console.log("Video autoplay failed:", error);
        });
    }

    // Setup language selection
    const languageLinks = document.querySelectorAll('.language-link');
    languageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('data-href');
            window.location.href = href;
        });
    });

    // Setup welcome messages animation
    const welcomeMessages = document.querySelectorAll('.welcome-messages h1');
    welcomeMessages.forEach((message, index) => {
        message.style.animationDelay = `${0.5 + (index * 0.5)}s`;
    });
});