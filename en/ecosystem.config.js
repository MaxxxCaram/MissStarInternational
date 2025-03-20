module.exports = {
    apps: [{
        name: 'missstar',
        script: 'server.js',
        env_production: {
            NODE_ENV: 'production',
            PORT: 443
        },
        instances: 'max',
        exec_mode: 'cluster',
        watch: false,
        max_memory_restart: '500M',
        error_file: 'logs/error.log',
        out_file: 'logs/output.log',
        merge_logs: true,
        log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }]
}; 