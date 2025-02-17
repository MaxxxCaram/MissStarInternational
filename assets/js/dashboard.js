import auth from './auth.js';
import { fetchAPI } from './api.js';
import analytics from './analytics.js';

class Dashboard {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadStats();
        this.setupCharts();
        this.setupEventListeners();
    }

    async loadStats() {
        const stats = await fetchAPI('/api/analytics/stats');
        this.updateDashboard(stats);
    }

    setupCharts() {
        // Implementar gráficos con Chart.js o similar
    }

    updateDashboard(stats) {
        // Actualizar UI con estadísticas
    }
}

export default new Dashboard(); 