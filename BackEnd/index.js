import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Ação mais importante: Carregar as variáveis de ambiente ANTES de tudo.
dotenv.config();

// Importações de rotas existentes
import rotaAutenticacao from './Routers/rotaAutenticacao.js';
import rotaUpload from './Routers/rotaUpload.js';
import rotaModelo from './Routers/rotaModelo.js';
import rotaPagamento from './Routers/rotaPagamento.js';
import rotaUrgencia from './Routers/rotaUrgencia.js';
import rotaOrdemServico from './Routers/rotaOrdemServico.js';
import rotaTipoLacre from './Routers/rotaTipoLacre.js';
import rotaTipoAnalise from './Routers/rotaTipoAnalise.js';
import rotaTipoLimpeza from './Routers/rotaTipoLimpeza.js';
import rotaTipoTransporte from './Routers/rotaTransporte.js';
import rotaFabricante from './Routers/rotaFabricante.js';
import rotaDefeitoAlegado from './Routers/rotaDefeitoAlegado.js';
import rotaClientePJ from './Routers/rotaClientePJ.js';
import rotaUsers from './Routers/rotaUsers.js';
import rotaLogs from './Routers/rotaLogs.js';

// Novas rotas para os novos recursos
import rotaDiasPagamento from './Routers/rotaDiasPagamento.js';
import rotaChecklistItem from './Routers/rotaChecklistItem.js';
import rotaEtapaOS from './Routers/rotaEtapaOS.js';
import rotaServicoPadrao from './Routers/rotaServicoPadrao.js';

// Importações das novas rotas do Bling
import blingRoutes from './Routers/blingRoutes.js';
import contatosRoutes from './Routers/contatosRoutes.js';

import { verificarAutenticacao } from './Security/autenticar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = '0.0.0.0';
const porta = process.env.PORT || 4000;

const app = express();

// Configuração de sessão otimizada para produção
app.use(
    session({
        secret: process.env.CHAVE_SECRETA || 'sua_chave_secreta_padrao',
        resave: false, // Otimizado para produção
        saveUninitialized: false, // Otimizado para produção
        cookie: {
            httpOnly: true, // Mais seguro
            secure: process.env.NODE_ENV === 'production', // HTTPS em produção
            sameSite: 'lax', // Mais seguro
            maxAge: 1000 * 60 * 60 * 2, // 2 horas
        },
        // Em produção, considere usar Redis ou outro store
        // store: new RedisStore({...}) 
    })
);

const whiteList = ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://og4o08cscgos0kgkkogk0k84.31.97.151.181.sslip.io"];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whiteList.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Log para verificar o caminho dos uploads
const uploadsPath = path.join(__dirname, '..', 'uploads');
console.log(`Servindo uploads de: ${uploadsPath}`);
console.log(`Diretório existe: ${fs.existsSync(uploadsPath)}`);

// Suas rotas continuam aqui...
app.use('/users', rotaUsers);
app.use('/autenticacao', rotaAutenticacao);
app.use('/upload', verificarAutenticacao, rotaUpload);
app.use('/modelo', verificarAutenticacao, rotaModelo);
app.use('/pagamento', verificarAutenticacao, rotaPagamento);
app.use("/urgencia", verificarAutenticacao, rotaUrgencia);
app.use("/ordem-servico", verificarAutenticacao, rotaOrdemServico);
app.use("/tipo-lacre", verificarAutenticacao, rotaTipoLacre);
app.use("/tipo-analise", verificarAutenticacao, rotaTipoAnalise);
app.use("/tipo-limpeza", verificarAutenticacao, rotaTipoLimpeza);
app.use("/tipo-transporte", verificarAutenticacao, rotaTipoTransporte);
app.use("/fabricante", verificarAutenticacao, rotaFabricante);
app.use("/defeito-alegado", verificarAutenticacao, rotaDefeitoAlegado);
app.use("/clientepj", verificarAutenticacao, rotaClientePJ);
app.use("/logs", verificarAutenticacao, rotaLogs);

// Novas rotas para os novos recursos
app.use("/dias-pagamento", verificarAutenticacao, rotaDiasPagamento);
app.use("/checklist-item", verificarAutenticacao, rotaChecklistItem);
app.use("/etapa-os", verificarAutenticacao, rotaEtapaOS);
app.use("/servico-padrao", verificarAutenticacao, rotaServicoPadrao);

// Rotas do Bling (já corrigidas no passo anterior)
app.use("/bling", blingRoutes);
app.use("/bling/contatos", contatosRoutes);

app.get('/', (_req, res) => {
    res.send('Servidor Alsten MVP rodando!');
});

// Rota de teste para verificar uploads
app.get('/test-uploads', (req, res) => {
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    
    try {
        const files = fs.readdirSync(uploadsPath);
        res.json({
            uploadsPath,
            exists: fs.existsSync(uploadsPath),
            files: files.slice(0, 10), // Mostra apenas os primeiros 10 arquivos
            totalFiles: files.length
        });
    } catch (error) {
        res.json({
            error: error.message,
            uploadsPath,
            exists: fs.existsSync(uploadsPath)
        });
    }
});

// Health check endpoint para o Coolify
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

// Endpoint de status mais detalhado
app.get('/status', (req, res) => {
    res.json({
        status: 'running',
        server: 'Alsten Backend API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

app.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`);
    console.log(`Uploads sendo servidos de: ${path.join(__dirname, '..', 'uploads')}`);
    console.log(`Health check disponível em: http://${host}:${porta}/health`);
});