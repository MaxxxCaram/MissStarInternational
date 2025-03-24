document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('localVideo');
    const startBtn = document.getElementById('startVideo');
    const muteAudioBtn = document.getElementById('muteAudio');
    const muteVideoBtn = document.getElementById('muteVideo');
    const status = document.getElementById('status');

    muteAudioBtn.style.display = 'none';
    muteVideoBtn.style.display = 'none';

    startBtn.onclick = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            video.srcObject = stream;
            startBtn.style.display = 'none';
            muteAudioBtn.style.display = 'inline';
            muteVideoBtn.style.display = 'inline';
            status.textContent = 'Connected!';

            muteAudioBtn.onclick = () => {
                stream.getAudioTracks().forEach(track => {
                    track.enabled = !track.enabled;
                    muteAudioBtn.textContent = track.enabled ? '🎤' : '🔇';
                });
            };

            muteVideoBtn.onclick = () => {
                stream.getVideoTracks().forEach(track => {
                    track.enabled = !track.enabled;
                    muteVideoBtn.textContent = track.enabled ? '📹' : '🚫';
                });
            };

        } catch (err) {
            status.textContent = 'Error: ' + err.message;
        }
    };
});