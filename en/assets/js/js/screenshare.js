class ScreenShare {
    constructor() {
        this.stream = null;
    }

    async startSharing() {
        try {
            this.stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });
            return this.stream;
        } catch (error) {
            console.error('Error sharing screen:', error);
            return null;
        }
    }

    stopSharing() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
}

export default new ScreenShare(); 