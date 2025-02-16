document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('localVideo');
    const startBtn = document.getElementById('startVideo');
    const muteAudioBtn = document.getElementById('muteAudio');
    const muteVideoBtn = document.getElementById('muteVideo');
    const status = document.getElementById('status');

    // Hide controls initially
    muteAudioBtn.style.display = 'none';
    muteVideoBtn.style.display = 'none';

    let stream = null;

    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        status.textContent = 'Error: Your browser does not support camera/microphone access';
        startBtn.disabled = true;
        return;
    }

    startBtn.onclick = async () => {
        status.textContent = 'Requesting camera and microphone access...';
        
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
            console.error('Error:', err);
            if (err.name === 'NotAllowedError') {
                status.textContent = 'Error: Please allow camera and microphone access in your browser';
            } else if (err.name === 'NotFoundError') {
                status.textContent = 'Error: No camera or microphone found';
            } else {
                status.textContent = 'Error: ' + err.message;
            }
        }
    };
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