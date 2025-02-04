document.addEventListener('DOMContentLoaded', () => {
    // Keep only essential video functionality
    const video = document.getElementById('heroVideo');
    if (video) {
        video.play().catch(function(error) {
            console.log("Video autoplay failed:", error);
        });
    }
});