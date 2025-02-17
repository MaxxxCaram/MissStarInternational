class Auth {
    constructor() {
        this.token = null;
        this.user = null;
        this.init();
    }

    async init() {
        this.token = localStorage.getItem('auth_token');
        if (this.token) {
            try {
                await this.validateToken();
            } catch (error) {
                this.logout();
            }
        }
    }

    async authenticate(apiKey) {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ apiKey })
            });

            if (!response.ok) throw new Error('Authentication failed');

            const data = await response.json();
            this.token = data.token;
            localStorage.setItem('auth_token', this.token);
            return true;
        } catch (error) {
            console.error('Authentication error:', error);
            return false;
        }
    }

    async validateToken() {
        if (!this.token) return false;

        try {
            const response = await fetch('/api/auth/validate', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            return response.ok;
        } catch (error) {
            return false;
        }
    }

    getAuthHeaders() {
        return this.token ? {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        };
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('auth_token');
    }
}

const auth = new Auth();
export default auth; 