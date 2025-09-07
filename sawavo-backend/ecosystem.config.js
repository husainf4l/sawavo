module.exports = {
  apps: [
    {
      name: 'skinior-backend-v2',
      script: 'dist/src/main.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 4008
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4008
      },
      // Restart settings
      max_memory_restart: '1G',
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Advanced settings
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 3000,
      
      // Auto restart on crash
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Environment variables from .env file
      env_file: '.env'
    }
  ]
};
