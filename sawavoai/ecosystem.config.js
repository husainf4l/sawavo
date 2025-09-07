module.exports = {
  apps: [
    {
      name: 'Sawavoai',
      cwd: '/home/husain/Sawavo/Sawavoai',
      script: 'npm',
      args: 'run start',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3007,
      },
    },
    {
      // PM2 entry for local development (runs `npm run dev`)
      name: 'Sawavoai-dev',
      cwd: '/home/husain/Sawavo/Sawavoai',
      script: 'npm',
      args: 'run dev',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
    },
  ],
};