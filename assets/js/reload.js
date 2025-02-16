// Simple reload functionality
document.addEventListener('DOMContentLoaded', () => {
    const reloadBtn = document.createElement('button');
    reloadBtn.className = 'reload-button';
    reloadBtn.textContent = '🔄 Reload';
    document.body.appendChild(reloadBtn);

    reloadBtn.addEventListener('click', () => {
        // Stop all media tracks before reloading
        const video = document.getElementById('localVideo');
        if (video && video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        
        // Reload the page
        window.location.reload();
    });
}); 