document.addEventListener('DOMContentLoaded', async () => {
    const localVideo = document.getElementById('localVideo');
    const muteAudioBtn = document.getElementById('muteAudio');
    const muteVideoBtn = document.getElementById('muteVideo');
    const captionsDiv = document.getElementById('captions');
    
    let isAudioMuted = false;
    let isVideoMuted = false;
    let recognition = null;

    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support video/audio features. Please use Chrome.');
        return;
    }

    // Initialize speech recognition
    function initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                console.log('Speech recognition started');
                captionsDiv.textContent = 'Listening...';
            };

            recognition.onresult = (event) => {
                const text = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                console.log('Recognized text:', text);
                translateAndDisplay(text);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                captionsDiv.textContent = 'Speech recognition error. Please try again.';
            };

            recognition.onend = () => {
                console.log('Speech recognition ended');
                // Wait a bit before restarting
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (e) {
                        console.error('Could not restart recognition:', e);
                    }
                }, 1000);
            };

            return true;
        }
        return false;
    }

    try {
        // Request permissions first
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: true
        });
        
        localVideo.srcObject = stream;
        await localVideo.play();

        // Audio/Video controls
        muteAudioBtn.addEventListener('click', () => {
            const audioTracks = stream.getAudioTracks();
            isAudioMuted = !isAudioMuted;
            audioTracks.forEach(track => track.enabled = !isAudioMuted);
            muteAudioBtn.textContent = isAudioMuted ? '🔇' : '🎤';
        });

        muteVideoBtn.addEventListener('click', () => {
            const videoTracks = stream.getVideoTracks();
            isVideoMuted = !isVideoMuted;
            videoTracks.forEach(track => track.enabled = !isVideoMuted);
            muteVideoBtn.textContent = isVideoMuted ? '🚫' : '📹';
        });

        // Initialize speech recognition after media setup
        if (initSpeechRecognition()) {
            try {
                recognition.start();
            } catch (e) {
                console.error('Could not start recognition:', e);
                captionsDiv.textContent = 'Could not start speech recognition.';
            }
        } else {
            console.warn('Speech recognition not supported');
            captionsDiv.textContent = 'Speech recognition is not supported in this browser. Please use Chrome.';
        }

    } catch (err) {
        console.error('Error:', err);
        if (err.name === 'NotAllowedError') {
            alert('Please allow camera and microphone access to use this feature.');
        } else if (err.name === 'NotFoundError') {
            alert('No camera/microphone found. Please connect a device and try again.');
        } else {
            alert('Error accessing camera/microphone. Please check your settings.');
        }
    }
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