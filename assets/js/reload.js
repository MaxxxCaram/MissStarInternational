// Simple reload functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create reload button
    const reloadBtn = document.createElement('button');
    reloadBtn.className = 'reload-button';
    reloadBtn.textContent = '🔄 Reload';
    document.querySelector('.conference-container').appendChild(reloadBtn);

    // Handle reload
    reloadBtn.addEventListener('click', () => {
        // Stop all media tracks
        const video = document.getElementById('localVideo');
        if (video && video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => {
                track.stop();
                console.log('Stopped track:', track.kind);
            });
            video.srcObject = null;
        }

        // Reset UI
        const startBtn = document.getElementById('startVideo');
        const muteAudioBtn = document.getElementById('muteAudio');
        const muteVideoBtn = document.getElementById('muteVideo');
        const captionsDiv = document.getElementById('captions');

        startBtn.style.display = 'inline-block';
        muteAudioBtn.style.display = 'none';
        muteVideoBtn.style.display = 'none';
        captionsDiv.textContent = 'Click "Start Video" to begin';

        console.log('Conference reset successfully');
    });
}); 