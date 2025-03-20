import { fetchAPI } from './api.js';
import auth from './auth.js';
import notifications from './notifications.js';
import analytics from './analytics.js';
import cache from './cache.js';

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
        
        // Multilingual translations
        this.translations = {
            en: {
                hello: "Hello",
                welcome: "Welcome to the meeting",
                thanks: "Thank you",
                goodbye: "Goodbye"
            },
            es: {
                hello: "Hola",
                welcome: "Welcome to the meeting",
                thanks: "Thank you", 
                goodbye: "Goodbye"
            },
            pt: {
                hello: "Hello",
                welcome: "Welcome to the meeting",
                thanks: "Thank you",
                goodbye: "Goodbye"
            },
            th: {
                hello: "Hello",
                welcome: "Welcome to the meeting",
                thanks: "Thank you",
                goodbye: "Goodbye"
            }
        };
        
        this.token = null;
        this.authenticate();
        
        this.init();
        this.logAction('conference_init');
        this.setupConnectionMonitoring();
        this.setupPerformanceMonitoring();
        this.setupErrorMonitoring();
        this.setupNotifications();
        this.setupAnalytics();
    }

    async init() {
        if (!await auth.validateToken()) {
            await auth.authenticate('api_key_secure');
        }
        this.startBtn.onclick = () => this.startMeeting();
        this.muteAudioBtn.onclick = () => this.toggleAudio();
        this.muteVideoBtn.onclick = () => this.toggleVideo();
    }

    async startMeeting() {
        analytics.trackEvent('conference', 'meeting_start');
        const startTime = performance.now();
        try {
            await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    this.stream = stream;
                    this.logAction('media_access_granted', {
                        video: true,
                        audio: true
                    });
                })
                .catch(err => {
                    this.logAction('media_access_denied', {
                        error: err.message
                    });
                    throw err;
                });
            
            this.videoElement.srcObject = this.stream;
            this.startBtn.textContent = 'Meeting in Progress';
            this.startBtn.disabled = true;
            
            this.startSpeechRecognition();
            this.logAction('meeting_started', {
                setupTime: performance.now() - startTime
            });
        } catch (err) {
            console.error('Error starting meeting:', err);
            this.logAction('meeting_error', { error: err.message });
        }
    }

    async startSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            
            this.recognition.onstart = () => {
                this.logAction('speech_recognition_started');
            };

            this.recognition.onend = () => {
                this.logAction('speech_recognition_ended');
            };

            this.recognition.onerror = (event) => {
                this.logAction('speech_recognition_error', { error: event.error });
            };
            
            this.recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                
                this.logAction('speech_recognized', { transcript });
                this.translateText(transcript);
            };
            
            this.recognition.start();
        }
    }

    async loadTranslations() {
        try {
            const response = await fetch('http://localhost:3000/api/translations');
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    async translateText(text) {
        const startTime = performance.now();
        const targetLang = document.getElementById('listenLanguage').value;
        
        const cacheKey = `translation_${text}_${targetLang}`;
        const cachedTranslation = cache.get(cacheKey);
        
        if (cachedTranslation) {
            this.updateTranslationDisplay(text, cachedTranslation, targetLang);
            return;
        }

        try {
            this.logAction('translation_requested', { 
                originalText: text, 
                targetLanguage: targetLang 
            });

            const response = await fetch('http://localhost:3000/api/translations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    originalText: text,
                    translations: [{
                        language: targetLang,
                        text: this.getTranslation(text, targetLang)
                    }]
                })
            });

            const result = await response.json();
            this.updateTranslationDisplay(text, result.translations[0].text, targetLang);
            this.logAction('translation_completed', {
                originalText: text,
                translatedText: result.translations[0].text,
                targetLanguage: targetLang,
                duration: performance.now() - startTime
            });
            this.logAction('translation_metrics', {
                textLength: text.length,
                processingTime: performance.now() - startTime
            });

            // Guardar en caché
            cache.set(cacheKey, result.translations[0].text);
        } catch (error) {
            this.logAction('translation_error', { 
                error: error.message,
                originalText: text,
                targetLanguage: targetLang
            });
            // Fallback to local translation if server fails
            const translated = this.getTranslation(text, targetLang);
            this.updateTranslationDisplay(text, translated, targetLang);
        }
    }

    getTranslation(text, targetLang) {
        const translations = {
            es: {
                'hello': 'hola',
                'how are you': 'cómo estás',
                'good morning': 'buenos días',
                'welcome to the meeting': 'bienvenidos a la reunión',
                'thank you': 'gracias',
                'goodbye': 'adiós'
            },
            th: {
                'hello': 'สวัสดี',
                'how are you': 'สบายดีไหม',
                'good morning': 'อรุณสวัสดิ์',
                'welcome to the meeting': 'ยินดีต้อนรับสู่การประชุม',
                'thank you': 'ขอบคุณ',
                'goodbye': 'ลาก่อน'
            },
            pt: {
                'hello': 'olá',
                'how are you': 'como está',
                'good morning': 'bom dia',
                'welcome to the meeting': 'bem-vindo à reunião',
                'thank you': 'obrigado',
                'goodbye': 'adeus'
            }
        };

        return translations[targetLang]?.[text.toLowerCase()] || text;
    }

    updateTranslationDisplay(original, translated, targetLang) {
        const langLabels = {
            'en': 'English',
            'es': 'Español',
            'th': 'ไทย',
            'pt': 'Português'
        };

        this.originalText.textContent = `[${langLabels['en']}] ${original}`;
        this.translatedText.textContent = `[${langLabels[targetLang]}] ${translated}`;
    }

    toggleAudio() {
        if (this.stream) {
            const audioTrack = this.stream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            this.muteAudioBtn.textContent = audioTrack.enabled ? '🎤' : '🔇';
            this.logAction('audio_toggled', { enabled: audioTrack.enabled });
        }
    }

    toggleVideo() {
        if (this.stream) {
            const videoTrack = this.stream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            this.muteVideoBtn.textContent = videoTrack.enabled ? '📹' : '🚫';
            this.logAction('video_toggled', { enabled: videoTrack.enabled });
        }
    }

    async authenticate() {
        try {
            const response = await fetch('http://localhost:3000/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    apiKey: 'api_key_secure'
                })
            });
            const data = await response.json();
            this.token = data.token;
        } catch (error) {
            console.error('Authentication error:', error);
        }
    }

    async logAction(action, details = {}) {
        try {
            await fetchAPI('/api/history', {
                method: 'POST',
                body: JSON.stringify({
                    action,
                    details,
                    metadata: this.getMetadata()
                })
            });
        } catch (error) {
            console.error('Error logging action:', error);
        }
    }

    setupConnectionMonitoring() {
        window.addEventListener('online', () => {
            this.logAction('connection_restored');
        });
        
        window.addEventListener('offline', () => {
            this.logAction('connection_lost');
        });
    }

    setupPerformanceMonitoring() {
        // Monitorear rendimiento de la red
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                this.logAction('network_change', {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt
                });
            });
        }

        // Monitorear uso de memoria
        if ('memory' in performance) {
            setInterval(() => {
                this.logAction('memory_usage', {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize
                });
            }, 30000);
        }
    }

    setupErrorMonitoring() {
        window.addEventListener('error', (event) => {
            this.logAction('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineNumber: event.lineno,
                columnNumber: event.colno
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logAction('promise_rejection', {
                reason: event.reason?.message || 'Unknown reason'
            });
        });
    }

    monitorStreamQuality() {
        if (this.stream) {
            this.stream.getVideoTracks().forEach(track => {
                track.getStats().then(stats => {
                    this.logAction('video_quality', {
                        frameRate: stats.frameRate,
                        width: stats.width,
                        height: stats.height,
                        bitrate: stats.bitrate
                    });
                });
            });
        }
    }

    getMetadata() {
        return {
            browser: navigator.userAgent,
            os: navigator.platform,
            language: navigator.language,
            screenResolution: `${window.screen.width}x${window.screen.height}`
        };
    }

    async setupNotifications() {
        // Notificar cuando alguien se une
        notifications.notify('Conference Started', {
            body: 'Welcome to the conference!'
        });
    }

    setupAnalytics() {
        analytics.trackEvent('conference', 'init');
    }

    // Monitor performance
    monitorPerformance() {
        // Performance monitoring implementation
    }

    // Monitor memory
    monitorMemory() {
        // Memory monitoring implementation
    }

    // Notify when someone joins
    notifyOnJoin() {
        notifications.notify('Conference Started', {
            body: 'Welcome to the conference!'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new Conference()); 