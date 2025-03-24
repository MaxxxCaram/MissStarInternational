class ModerationSystem {
    constructor() {
        this.bannedWords = new Set();
        this.loadBannedWords();
    }

    async loadBannedWords() {
        try {
            const response = await fetchAPI('/api/moderation/banned-words');
            const words = await response.json();
            this.bannedWords = new Set(words);
        } catch (error) {
            console.error('Error loading banned words:', error);
        }
    }

    checkMessage(text) {
        const words = text.toLowerCase().split(/\s+/);
        const foundBannedWords = words.filter(word => this.bannedWords.has(word));
        
        return {
            isClean: foundBannedWords.length === 0,
            bannedWords: foundBannedWords
        };
    }

    async moderateContent(content, type = 'text') {
        try {
            const response = await fetchAPI('/api/moderation/check', {
                method: 'POST',
                body: JSON.stringify({ content, type })
            });
            return await response.json();
        } catch (error) {
            console.error('Moderation error:', error);
            return { isClean: true }; // Fallback seguro
        }
    }
}

export default new ModerationSystem(); 