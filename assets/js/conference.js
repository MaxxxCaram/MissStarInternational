document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const localVideo = document.getElementById('localVideo');
    const startVideoBtn = document.getElementById('startVideo');
    const muteAudioBtn = document.getElementById('muteAudio');
    const muteVideoBtn = document.getElementById('muteVideo');
    const captionsDiv = document.getElementById('captions');
    
    // State
    let stream = null;
    let isAudioMuted = false;
    let isVideoMuted = false;

    // Initially hide mute buttons
    muteAudioBtn.style.display = 'none';
    muteVideoBtn.style.display = 'none';

    // Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        startVideoBtn.disabled = true;
        captionsDiv.textContent = 'Your browser does not support video. Please use Chrome.';
        return;
    }

    // Start Video Button
    startVideoBtn.addEventListener('click', async () => {
        try {
            // Request camera access
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480
                },
                audio: true
            });

            // Set video source
            localVideo.srcObject = stream;
            await localVideo.play();

            // Show controls
            startVideoBtn.style.display = 'none';
            muteAudioBtn.style.display = 'inline-block';
            muteVideoBtn.style.display = 'inline-block';
            
            captionsDiv.textContent = 'Video started successfully';

        } catch (err) {
            console.error('Error:', err);
            if (err.name === 'NotAllowedError') {
                captionsDiv.textContent = 'Please allow camera access and try again';
            } else {
                captionsDiv.textContent = 'Error starting video: ' + err.message;
            }
        }
    });

    // Mute Audio Button
    muteAudioBtn.addEventListener('click', () => {
        if (stream) {
            const audioTracks = stream.getAudioTracks();
            isAudioMuted = !isAudioMuted;
            audioTracks.forEach(track => track.enabled = !isAudioMuted);
            muteAudioBtn.textContent = isAudioMuted ? '🔇' : '🎤';
        }
    });

    // Mute Video Button
    muteVideoBtn.addEventListener('click', () => {
        if (stream) {
            const videoTracks = stream.getVideoTracks();
            isVideoMuted = !isVideoMuted;
            videoTracks.forEach(track => track.enabled = !isVideoMuted);
            muteVideoBtn.textContent = isVideoMuted ? '🚫' : '📹';
        }
    });
});

async function translateAndDisplay(text) {
    const targetLang = document.getElementById('languageSelect').value;
    const captionsDiv = document.getElementById('captions');
    
    try {
        // Using simulated translation for testing
        // In production we would use Google Cloud Translation API
        const translatedText = await simulateTranslation(text, targetLang);
        
        captionsDiv.innerHTML = `
            <p class="original-text">${text}</p>
            <p class="translated-text">${translatedText}</p>
        `;
    } catch (err) {
        console.error('Translation error:', err);
        captionsDiv.textContent = text; // Show original text if translation fails
    }
}

// Translation simulation for testing
function simulateTranslation(text, targetLang) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Basic translation examples
            const translations = {
                es: {
                    'hello': 'hola',
                    'how are you': 'cómo estás',
                    'welcome': 'bienvenido'
                },
                pt: {
                    'hello': 'olá',
                    'how are you': 'como vai você',
                    'welcome': 'bem-vindo'
                },
                fr: {
                    'hello': 'bonjour',
                    'how are you': 'comment allez-vous',
                    'welcome': 'bienvenue'
                }
            };

            const lowerText = text.toLowerCase();
            resolve(translations[targetLang]?.[lowerText] || text);
        }, 100);
    });
} 