class ReactionSystem {
    constructor() {
        this.reactions = new Map();
        this.setupReactionButtons();
    }

    setupReactionButtons() {
        const reactionBar = document.createElement('div');
        reactionBar.className = 'reaction-bar';
        reactionBar.innerHTML = `
            <button data-emoji="👏">👏</button>
            <button data-emoji="❤️">❤️</button>
            <button data-emoji="👍">👍</button>
            <button data-emoji="🌟">🌟</button>
        `;
        document.querySelector('.conference-container').appendChild(reactionBar);
    }

    addReaction(emoji, userId) {
        if (!this.reactions.has(emoji)) {
            this.reactions.set(emoji, new Set());
        }
        this.reactions.get(emoji).add(userId);
        this.updateDisplay();
    }
} 