class ChatSystem {
    constructor() {
        this.socket = null;
        this.messages = [];
        this.init();
    }

    init() {
        this.socket = new WebSocket('wss://your-domain.com/ws/chat');
        
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.messages.push(message);
            this.displayMessage(message);
        };
    }

    sendMessage(text, type = 'text') {
        const message = {
            text,
            type,
            sender: auth.user?.username || 'Anonymous',
            timestamp: new Date().toISOString()
        };

        this.socket.send(JSON.stringify(message));
    }

    displayMessage(message) {
        const chatContainer = document.querySelector('.chat-container');
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${message.type}`;
        messageEl.innerHTML = `
            <span class="sender">${message.sender}</span>
            <span class="text">${message.text}</span>
            <span class="time">${new Date(message.timestamp).toLocaleTimeString()}</span>
        `;
        chatContainer.appendChild(messageEl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

export default new ChatSystem(); 