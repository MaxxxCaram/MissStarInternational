module.exports = {
  apps: [
    {
      name: "missstar",
      script: "server.js",
      env_production: {
        NODE_ENV: "production",
        PORT: 10000,
      },
      instances: 1,
      exec_mode: "fork",
      watch: true,
      watch_delay: 1000,
      ignore_watch: ["node_modules", "logs", ".git"],
      max_memory_restart: "1G",
      error_file: "logs/error.log",
      out_file: "logs/output.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      autorestart: true,
      restart_delay: 4000,
      min_uptime: "5s",
      max_restarts: 5,
      listen_timeout: 10000,
      kill_timeout: 5000,
    },
  ],
};
