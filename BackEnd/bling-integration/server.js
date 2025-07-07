const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const BlingAuth = require('./middleware/blingAuth');
const TokenService = require('./services/tokenService');
const { router: blingRoutes, blingAuth } = require('./routes/blingRoutes');
const contatosRoutes = require('./routes/contatosRoutes');

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares básicos
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Middleware para disponibilizar blingAuth em todas as rotas
app.use((req, res, next) => {
    req.blingAuth = blingAuth;
    next();
});

// Inicialização do serviço de tokens
const tokenService = new TokenService();

// Inicializa o banco de dados se necessário
async function initializeDatabase() {
    try {
        await tokenService.initializeDatabase();
        console.log('Banco de dados inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        // Continua mesmo com erro, pois pode estar usando armazenamento em memória
    }
}

// Rotas principais
app.get('/', (req, res) => {
    res.json({
        message: 'API de Integração com Bling',
        version: '1.0.0',
        endpoints: {
            auth: '/bling/auth',
            callback: '/bling/callback',
            status: '/bling/status',
            contatos: '/bling/contatos',
            clientes: '/bling/contatos/clientes',
            fornecedores: '/bling/contatos/fornecedores'
        },
        documentation: 'Consulte o README.md para instruções de uso'
    });
});

// Rota de health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        blingAuth: {
            isAuthenticated: blingAuth.isAuthenticated(),
            tokenInfo: blingAuth.getTokenInfo()
        }
    });
});

// Rotas do Bling
app.use('/bling', blingRoutes);

// Rotas de contatos (com middleware de autenticação)
app.use('/bling/contatos', blingAuth.requireAuth(), contatosRoutes);

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
    console.error('Erro não tratado:', error);
    
    res.status(error.status || 500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado',
        timestamp: new Date().toISOString()
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: `A rota ${req.method} ${req.originalUrl} não existe`,
        availableRoutes: [
            'GET /',
            'GET /health',
            'GET /bling/auth',
            'GET /bling/callback',
            'GET /bling/status',
            'GET /bling/contatos',
            'GET /bling/contatos/clientes',
            'GET /bling/contatos/fornecedores'
        ]
    });
});

// Função para limpeza automática de tokens expirados
async function cleanupExpiredTokens() {
    try {
        const removed = await tokenService.cleanupExpiredTokens();
        if (removed > 0) {
            console.log(`Limpeza automática: ${removed} tokens expirados removidos`);
        }
    } catch (error) {
        console.error('Erro na limpeza automática de tokens:', error);
    }
}

// Inicia o servidor
async function startServer() {
    try {
        // Inicializa o banco de dados
        await initializeDatabase();
        
        // Configura limpeza automática de tokens (a cada hora)
        setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
        
        // Inicia o servidor
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
            console.log(`🔗 Bling Redirect URI: ${process.env.BLING_REDIRECT_URI}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`💾 Storage: ${process.env.NODE_ENV === 'production' ? 'Database' : 'Memory'}`);
            
            // Log de configuração do Bling
            if (process.env.BLING_CLIENT_ID) {
                console.log(`✅ Bling Client ID configurado`);
            } else {
                console.warn(`⚠️  Bling Client ID não configurado`);
            }
            
            if (process.env.BLING_CLIENT_SECRET) {
                console.log(`✅ Bling Client Secret configurado`);
            } else {
                console.warn(`⚠️  Bling Client Secret não configurado`);
            }
        });
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Tratamento de sinais para encerramento graceful
process.on('SIGTERM', () => {
    console.log('Recebido SIGTERM, encerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Recebido SIGINT, encerrando servidor...');
    process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
    console.error('Erro não capturado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promise rejeitada não tratada:', reason);
    process.exit(1);
});

// Inicia o servidor
startServer();

module.exports = app;

