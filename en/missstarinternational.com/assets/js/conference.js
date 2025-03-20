class Conference {
    constructor() {
        this.videoElement = document.getElementById('localVideo');
        this.startBtn = document.getElementById('startBtn');
        this.muteAudioBtn = document.getElementById('muteAudio');
        this.muteVideoBtn = document.getElementById('muteVideo');
        
        this.stream = null;
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
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    }

    toggleAudio() {
        if (this.stream) {
            const audioTrack = this.stream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            this.muteAudioBtn.textContent = audioTrack.enabled ? 'Mute Audio' : 'Unmute Audio';
        }
    }

    toggleVideo() {
        if (this.stream) {
            const videoTrack = this.stream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            this.muteVideoBtn.textContent = videoTrack.enabled ? 'Mute Video' : 'Unmute Video';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new Conference()); 