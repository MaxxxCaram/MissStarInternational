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

    // Initially hide controls
    muteAudioBtn.style.display = 'none';
    muteVideoBtn.style.display = 'none';

    // Specialized dictionary for business meetings
    const translations = {
        // Meetings and presentations (Spanish translations)
        'good morning everyone': 'buenos dias a todos',
        'welcome to the meeting': 'bienvenidos a la reunion',
        'let me introduce myself': 'permítanme presentarme',
        'let us begin': 'comencemos',
        'thank you for coming': 'gracias por venir',
        'thank you for your time': 'gracias por su tiempo',      // thanks for your time
        'let me share my screen': 'permitanme compartir mi pantalla',  // without accent for linter
        'can everyone hear me': 'pueden todos oirme',            // without accents for linter
        'can you hear me': 'pueden oirme',

        // Business and Finance
        'profit': 'beneficio',
        'revenue': 'ingresos',
        'costs': 'costos',
        'expenses': 'gastos',
        'investment': 'inversión',
        'market': 'mercado',
        'business plan': 'plan de negocios',
        'strategy': 'estrategia',
        'budget': 'presupuesto',
        'forecast': 'pronóstico',
        'growth': 'crecimiento',
        'sales': 'ventas',
        'marketing': 'marketing',
        'target': 'objetivo',
        'deadline': 'fecha límite',

        // Negotiation
        'proposal': 'propuesta',
        'offer': 'oferta',
        'agreement': 'acuerdo',
        'contract': 'contrato',
        'terms and conditions': 'términos y condiciones',
        'deal': 'trato',
        'partnership': 'asociación',
        'collaboration': 'colaboración',
        'negotiation': 'negociación',
        'let us discuss': 'discutamos',
        'what do you think': 'qué opina',
        'i agree': 'estoy de acuerdo',
        'i disagree': 'no estoy de acuerdo',
        'we need to consider': 'necesitamos considerar',

        // Data Presentation
        'report': 'informe',
        'analysis': 'análisis',
        'results': 'resultados',
        'performance': 'rendimiento',
        'statistics': 'estadísticas',
        'data': 'datos',
        'chart': 'gráfico',
        'graph': 'gráfica',
        'increase': 'aumento',
        'decrease': 'disminución',
        'percentage': 'porcentaje',
        'quarter': 'trimestre',
        'fiscal year': 'año fiscal',

        // Decision Making
        'decision': 'decision',
        'option': 'opción',
        'alternative': 'alternativa',
        'solution': 'solución',
        'problem': 'problema',
        'challenge': 'desafío',
        'opportunity': 'oportunidad',
        'risk': 'riesgo',
        'advantage': 'ventaja',
        'disadvantage': 'desventaja',
        'priority': 'prioridad',

        // Conclusion
        'in conclusion': 'en conclusion',
        'to summarize': 'para resumir',
        'next steps': 'proximos pasos',
        'action items': 'puntos de acción',
        'follow up': 'seguimiento',
        'any questions': 'alguna pregunta',
        'meeting adjourned': 'reunión terminada',
        'thank you for your attention': 'gracias por su atención',
        'see you next time': 'hasta la próxima'
    };

    startBtn.onclick = () => {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                originalText.textContent = 'Listening...';
                startBtn.disabled = true;
                startBtn.textContent = 'Meeting in Progress...';
            };

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join(' ');

                originalText.textContent = `[EN] ${transcript}`;

                // Enhanced translation for business phrases
                const words = transcript.toLowerCase().split(' ');
                let translatedText = '';
                let buffer = '';

                for (let i = 0; i < words.length; i++) {
                    buffer += (buffer ? ' ' : '') + words[i];
                    
                    if (translations[buffer]) {
                        translatedText += (translatedText ? ' ' : '') + translations[buffer];
                        buffer = '';
                    } else {
                        if (i === words.length - 1 || !translations[buffer + ' ' + words[i + 1]]) {
                            if (translations[words[i]]) {
                                translatedText += (translatedText ? ' ' : '') + translations[words[i]];
                            } else {
                                translatedText += (translatedText ? ' ' : '') + words[i];
                            }
                            buffer = '';
                        }
                    }
                }

                document.getElementById('translatedText').textContent = `[ES] ${translatedText}`;
            };

            recognition.onerror = (event) => {
                console.error('Error:', event.error);
                originalText.textContent = 'Speech recognition error';
                startBtn.disabled = false;
                startBtn.textContent = 'Restart Meeting';
            };

            recognition.onend = () => {
                recognition.start(); // Keep meeting active
            };

            recognition.start();
        } else {
            originalText.textContent = 'Speech recognition not supported';
        }
    };

    // Basic controls
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

    // Cleanup on close
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