document.addEventListener('DOMContentLoaded', () => {
    const localVideo = document.getElementById('localVideo');
    const startVideoBtn = document.getElementById('startVideo');
    const muteAudioBtn = document.getElementById('muteAudio');
    const muteVideoBtn = document.getElementById('muteVideo');
    const captionsDiv = document.getElementById('captions');
    const languageSelect = document.getElementById('languageSelect');
    
    let stream = null;
    let isAudioMuted = false;
    let isVideoMuted = false;
    let recognition = null;

    // Hide control buttons initially
    muteAudioBtn.style.display = 'none';
    muteVideoBtn.style.display = 'none';

    startVideoBtn.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            localVideo.srcObject = stream;
            startVideoBtn.style.display = 'none';
            muteAudioBtn.style.display = 'inline-block';
            muteVideoBtn.style.display = 'inline-block';
            
            // Start speech recognition
            startSpeechRecognition();
            
        } catch (err) {
            console.error('Error:', err);
            captionsDiv.textContent = 'Error starting video. Please check permissions.';
        }
    });

    function startSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                captionsDiv.textContent = 'Listening...';
            };

            recognition.onresult = (event) => {
                const text = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                
                translateAndDisplay(text);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                captionsDiv.textContent = 'Speech recognition error. Please try again.';
            };

            recognition.start();
        } else {
            captionsDiv.textContent = 'Speech recognition not supported. Please use Chrome.';
        }
    }

    // Controls
    muteAudioBtn.addEventListener('click', () => {
        if (stream) {
            const audioTracks = stream.getAudioTracks();
            isAudioMuted = !isAudioMuted;
            audioTracks.forEach(track => track.enabled = !isAudioMuted);
            muteAudioBtn.textContent = isAudioMuted ? '🔇' : '🎤';
        }
    });

    muteVideoBtn.addEventListener('click', () => {
        if (stream) {
            const videoTracks = stream.getVideoTracks();
            isVideoMuted = !isVideoMuted;
            videoTracks.forEach(track => track.enabled = !isVideoMuted);
            muteVideoBtn.textContent = isVideoMuted ? '🚫' : '📹';
        }
    });

    // Language change handler
    languageSelect.addEventListener('change', () => {
        if (recognition) {
            recognition.stop();
            startSpeechRecognition();
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