// Configurações de Produção para VPS
export const config = {
    database: {
        host: 'localhost',
        port: 3306,
        user: 'admin',
        password: 'Alsten@321',
        database: 'alsten_os',
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
        idleTimeout: 60000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    },
    server: {
        port: 3001,
        host: '0.0.0.0',
        nodeEnv: 'production'
    },
    security: {
        sessionSecret: 'Alsten@2024#SessionSecret#Production',
        jwtSecret: 'Alsten@2024#JWTSecret#Production',
        sessionMaxAge: 7200000
    },
    cors: {
        origin: ['http://31.97.151.181:3000', 'http://localhost:3000'],
        credentials: true
    }
};

export default config;
