module.exports = {
  apps: [{
    name: 'alsten-backend',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    // Restart automático em caso de crash
    restart_delay: 5000,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Health check interno
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true,
    
    // Logs
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    
    // Restart se consumo de CPU for muito alto por muito tempo
    max_cpu: 80,
    
    // Monitoramento de memória
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Estratégias de restart
    exp_backoff_restart_delay: 100,
    
    // Cron restart (opcional - restart diário às 3h da manhã)
    cron_restart: '0 3 * * *'
  }]
};

// Configurações adicionais para produção
if (process.env.NODE_ENV === 'production') {
  module.exports.apps[0].instances = 'max'; // Usar todos os CPUs
  module.exports.apps[0].exec_mode = 'cluster'; // Modo cluster
}