document.addEventListener('DOMContentLoaded', () => {
    // Initialize video background
    const video = document.getElementById('heroVideo');
    if (video) {
        video.play().catch(function(error) {
            console.log("Video autoplay failed:", error);
        });
    }

    // Language selection
    const languageLinks = document.querySelectorAll('.language-link');
    languageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('data-href');
            window.location.href = href;
        });
    });

    // Welcome messages animation
    const welcomeMessages = document.querySelectorAll('.welcome-messages h1');
    welcomeMessages.forEach((message, index) => {
        message.style.animationDelay = `${0.5 + (index * 0.5)}s`;
    });

    // Check if flag images load correctly
    const flagImages = document.querySelectorAll('.language-flags img');
    flagImages.forEach(img => {
        img.onerror = function() {
            console.error('Error loading flag:', img.src);
        };
    });

    // Check image loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.error('Error loading image:', this.src);
            this.style.border = '1px solid red';
            this.style.padding = '10px';
            this.style.width = '80px';
            this.style.height = '80px';
        });
    });
});