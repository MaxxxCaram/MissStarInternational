class Conference {
    constructor() {
        this.videoElement = document.getElementById('localVideo');
        this.startBtn = document.getElementById('startBtn');
        this.muteAudioBtn = document.getElementById('muteAudio');
        this.muteVideoBtn = document.getElementById('muteVideo');
        this.originalText = document.querySelector('.original-text');
        this.translatedText = document.querySelector('.translated-text');
        
        this.stream = null;
        this.recognition = null;
        
        this.init();
    }

    async init() {
        this.startBtn.onclick = () => this.startMeeting();
        this.muteAudioBtn.onclick = () => this.toggleAudio();
        this.muteVideoBtn.onclick = () => this.toggleVideo();
    }

    async startMeeting() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            
            this.videoElement.srcObject = this.stream;
            this.startBtn.textContent = 'Meeting in Progress';
            this.startBtn.disabled = true;
            
            this.startSpeechRecognition();
        } catch (err) {
            console.error('Error accessing media devices:', err);
        }
    }

    startSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            
            this.recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                
                this.originalText.textContent = transcript;
                this.translateText(transcript);
            };
            
            this.recognition.start();
        }
    }

    async translateText(text) {
        // Simulación de traducción
        const translations = {
            'hello': 'hola',
            'how are you': 'cómo estás',
            'good morning': 'buenos días'
            // Agregar más traducciones según sea necesario
        };

        const translated = translations[text.toLowerCase()] || text;
        this.translatedText.textContent = translated;
    }

    toggleAudio() {
        if (this.stream) {
            const audioTrack = this.stream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            this.muteAudioBtn.textContent = audioTrack.enabled ? '🎤' : '🔇';
        }
    }

    toggleVideo() {
        if (this.stream) {
            const videoTrack = this.stream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            this.muteVideoBtn.textContent = videoTrack.enabled ? '📹' : '🚫';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new Conference());

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