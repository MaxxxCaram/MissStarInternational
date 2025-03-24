class PollSystem {
    constructor() {
        this.activePoll = null;
    }

    createPoll(question, options) {
        const poll = {
            id: Date.now(),
            question,
            options: options.map(text => ({ text, votes: 0 })),
            voters: new Set()
        };
        this.activePoll = poll;
        this.displayPoll();
    }

    vote(optionIndex, userId) {
        if (this.activePoll && !this.activePoll.voters.has(userId)) {
            this.activePoll.options[optionIndex].votes++;
            this.activePoll.voters.add(userId);
            this.updateResults();
        }
    }
} 