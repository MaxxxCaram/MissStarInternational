document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('localVideo');
    const startBtn = document.getElementById('startVideo');
    const muteAudioBtn = document.getElementById('muteAudio');
    const muteVideoBtn = document.getElementById('muteVideo');
    const originalText = document.querySelector('.original-text');
    const translatedText = document.querySelector('.translated-text');
    const listenLanguage = document.getElementById('listenLanguage');

    let recognition = null;
    let stream = null;

    // Ocultar controles inicialmente
    muteAudioBtn.style.display = 'none';
    muteVideoBtn.style.display = 'none';

    // Diccionario simple de traducciones
    const translations = {
        'en': {
            'es': {
                'hello': 'hola',
                'how are you': 'cómo estás',
                'welcome': 'bienvenido',
                'good morning': 'buenos días',
                'thank you': 'gracias'
            }
        }
    };

    startBtn.onclick = () => {
        startRealtimeTranslation();
        startBtn.disabled = true;
        startBtn.textContent = 'Listening...';
    };

    function startRealtimeTranslation() {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US'; // Fijo en inglés para pruebas

            recognition.onstart = () => {
                originalText.textContent = 'Listening...';
            };

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join(' ');

                // Mostrar texto original
                originalText.textContent = `[EN] ${transcript}`;

                // Traducir al español
                const words = transcript.toLowerCase().split(' ');
                const translatedWords = words.map(word => {
                    return translations['en']['es'][word] || word;
                });

                // Mostrar traducción
                translatedText.textContent = `[ES] ${translatedWords.join(' ')}`;
            };

            recognition.onerror = (event) => {
                console.error('Error:', event.error);
                originalText.textContent = 'Error en reconocimiento de voz';
            };

            recognition.onend = () => {
                recognition.start(); // Mantener escuchando
            };

            recognition.start();
        } else {
            originalText.textContent = 'Su navegador no soporta reconocimiento de voz';
        }
    }

    // Controles básicos
    muteAudioBtn.onclick = () => {
        if (stream) {
            const tracks = stream.getAudioTracks();
            tracks.forEach(track => {
                track.enabled = !track.enabled;
                muteAudioBtn.textContent = track.enabled ? '🎤' : '🔇';
            });
        }
    };

    muteVideoBtn.onclick = () => {
        if (stream) {
            const tracks = stream.getVideoTracks();
            tracks.forEach(track => {
                track.enabled = !track.enabled;
                muteVideoBtn.textContent = track.enabled ? '📹' : '🚫';
            });
        }
    };

    // Limpiar al cerrar
    window.onbeforeunload = () => {
        if (recognition) recognition.stop();
        if (stream) stream.getTracks().forEach(track => track.stop());
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