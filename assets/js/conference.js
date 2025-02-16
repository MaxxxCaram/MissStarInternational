document.addEventListener('DOMContentLoaded', () => {
    const localVideo = document.getElementById('localVideo');
    const startBtn = document.getElementById('startVideo');
    const muteAudioBtn = document.getElementById('muteAudio');
    const muteVideoBtn = document.getElementById('muteVideo');
    const status = document.getElementById('status');

    // Hide controls initially
    muteAudioBtn.style.display = 'none';
    muteVideoBtn.style.display = 'none';

    let stream = null;

    startBtn.onclick = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            localVideo.srcObject = stream;
            
            startBtn.style.display = 'none';
            muteAudioBtn.style.display = 'inline';
            muteVideoBtn.style.display = 'inline';
            
            status.textContent = 'Connected!';
        } catch (err) {
            status.textContent = 'Error: ' + err.message;
        }
    };

    muteAudioBtn.onclick = () => {
        const tracks = stream.getAudioTracks();
        tracks.forEach(track => {
            track.enabled = !track.enabled;
            muteAudioBtn.textContent = track.enabled ? '🎤' : '🔇';
        });
    };

    muteVideoBtn.onclick = () => {
        const tracks = stream.getVideoTracks();
        tracks.forEach(track => {
            track.enabled = !track.enabled;
            muteVideoBtn.textContent = track.enabled ? '📹' : '🚫';
        });
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