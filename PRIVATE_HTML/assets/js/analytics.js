class Analytics {
    constructor() {
        this.events = [];
        this.startTime = Date.now();
    }

    trackEvent(category, action, label = null) {
        const event = {
            category,
            action,
            label,
            timestamp: Date.now(),
            sessionDuration: Date.now() - this.startTime
        };
        this.events.push(event);
        this.sendToServer(event);
    }

    async sendToServer(event) {
        try {
            await fetchAPI('/api/analytics', {
                method: 'POST',
                body: JSON.stringify(event)
            });
        } catch (error) {
            console.error('Error sending analytics:', error);
        }
    }
}

export default new Analytics(); 