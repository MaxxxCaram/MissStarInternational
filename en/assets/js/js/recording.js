class RecordingSystem {
    constructor() {
        this.mediaRecorder = null;
        this.recordedChunks = [];
    }

    async startRecording(stream) {
        try {
            this.recordedChunks = [];
            this.mediaRecorder = new MediaRecorder(stream);

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, {
                    type: 'video/webm'
                });
                this.saveRecording(blob);
            };

            this.mediaRecorder.start();
            return true;
        } catch (error) {
            console.error('Error starting recording:', error);
            return false;
        }
    }

    stopRecording() {
        if (this.mediaRecorder?.state === 'recording') {
            this.mediaRecorder.stop();
        }
    }

    async saveRecording(blob) {
        const formData = new FormData();
        formData.append('recording', blob);
        
        try {
            await fetchAPI('/api/recordings', {
                method: 'POST',
                body: formData
            });
        } catch (error) {
            console.error('Error saving recording:', error);
        }
    }
}

export default new RecordingSystem(); 