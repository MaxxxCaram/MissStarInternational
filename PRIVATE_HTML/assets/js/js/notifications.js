class NotificationSystem {
    constructor() {
        this.permission = Notification.permission;
        this.init();
    }

    async init() {
        if (this.permission === "default") {
            this.permission = await Notification.requestPermission();
        }
    }

    async notify(title, options = {}) {
        if (this.permission === "granted") {
            return new Notification(title, {
                icon: '/assets/images/logo.png',
                ...options
            });
        }
    }

    async scheduleNotification(title, options = {}, delay) {
        setTimeout(() => this.notify(title, options), delay);
    }
}

export default new NotificationSystem(); 