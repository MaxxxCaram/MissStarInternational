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

    // Diccionario de traducciones en tiempo real
    const translations = {
        'en': {
            'es': {
                'hello': 'hola',
                'how are you': 'cómo estás',
                'welcome': 'bienvenido',
                'good morning': 'buenos días',
                'thank you': 'gracias',
                'goodbye': 'adiós',
                'please': 'por favor',
                'nice to meet you': 'encantado de conocerte'
            },
            'pt': {
                'hello': 'olá',
                'how are you': 'como vai você',
                'welcome': 'bem-vindo',
                'good morning': 'bom dia',
                'thank you': 'obrigado',
                'goodbye': 'tchau',
                'please': 'por favor',
                'nice to meet you': 'prazer em conhecê-lo'
            },
            'th': {
                'hello': 'สวัสดี',
                'how are you': 'สบายดีไหม',
                'welcome': 'ยินดีต้อนรับ',
                'good morning': 'อรุณสวัสดิ์',
                'thank you': 'ขอบคุณ',
                'goodbye': 'ลาก่อน',
                'please': 'กรุณา',
                'nice to meet you': 'ยินดีที่ได้รู้จัก'
            }
        }
    };

    startBtn.onclick = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: true
            });

            video.srcObject = stream;
            startBtn.style.display = 'none';
            muteAudioBtn.style.display = 'inline';
            muteVideoBtn.style.display = 'inline';
            
            startRealtimeTranslation();

        } catch (err) {
            console.error('Error:', err);
            translatedText.textContent = 'Error: ' + err.message;
        }
    };

    function startRealtimeTranslation() {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'auto';

            recognition.onstart = () => {
                translatedText.textContent = 'Escuchando...';
            };

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join(' ');

                const detectedLang = event.results[0][0].lang.split('-')[0];
                const targetLang = listenLanguage.value.split('-')[0];

                // Mostrar texto original
                originalText.textContent = `[${detectedLang}] ${transcript}`;

                // Traducir en tiempo real
                const words = transcript.toLowerCase().split(' ');
                const translatedWords = words.map(word => {
                    return translations[detectedLang]?.[targetLang]?.[word] || word;
                });

                // Mostrar traducción
                translatedText.textContent = `[${targetLang}] ${translatedWords.join(' ')}`;
            };

            recognition.onerror = (event) => {
                console.error('Error:', event.error);
                translatedText.textContent = 'Error en reconocimiento de voz';
            };

            recognition.onend = () => {
                recognition.start();
            };

            recognition.start();
        } else {
            translatedText.textContent = 'Su navegador no soporta reconocimiento de voz';
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