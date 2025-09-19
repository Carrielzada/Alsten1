import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Carregar variáveis de ambiente
dotenv.config();

// Validar variáveis críticas
const requiredEnvVars = ['CHAVE_SECRETA', 'DB_HOST', 'DB_USER', 'DB_SENHA', 'DB_NOME'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ ERRO CRÍTICO: Variáveis de ambiente obrigatórias não configuradas:');
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error('Configure essas variáveis no arquivo .env antes de iniciar o servidor');
  process.exit(1);
}

// Criação do app Express
const app = express();

// Segurança HTTP com Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // ajuste se React der erro em dev
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting global
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: { error: 'Muitas requisições deste IP, tente novamente mais tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Configuração de sessão
app.use(
  session({
    secret: process.env.CHAVE_SECRETA,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 2, // 2 horas
    },
  })
);

// Resolver path absoluto (__dirname em ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista padrão de origens permitidas
const defaultWhiteList = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://31.97.151.181:3000',
  'http://31.97.151.181:3001',
  'http://s044wssc4wow4cs8s48ok48o.31.97.151.181.sslip.io:3000',
  'http://s044wssc4wow4cs8s48ok48o.31.97.151.181.sslip.io:3001',
  'http://s044wssc4wow4cs8s48ok48o.31.97.151.181.sslip.io',
  'http://og4o08cscgos0kgkkogk0k84.31.97.151.181.sslip.io',
  'http://alsten.online',
  'https://alsten.online',
  'https://api.alsten.online',
];

// Usar variável de ambiente CORS_ORIGIN se existir
const whiteList = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((url) => url.trim())
  : defaultWhiteList;

// Configuração do CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    } // permitir mobile/postman
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origem não permitida: ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Parsers padrão
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ==== Importar Rotas ==== //
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
// Novos recursos
import rotaDiasPagamento from './Routers/rotaDiasPagamento.js';
import rotaChecklistItem from './Routers/rotaChecklistItem.js';
import rotaEtapaOS from './Routers/rotaEtapaOS.js';
import rotaServicoPadrao from './Routers/rotaServicoPadrao.js';
// Bling
import blingRoutes from './Routers/blingRoutes.js';
import contatosRoutes from './Routers/contatosRoutes.js';

// Middleware de autenticação
import { verificarAutenticacao } from './Security/autenticar.js';

// ==== Rotas protegidas ====
app.use('/users', rotaUsers);
app.use('/autenticacao', rotaAutenticacao);
app.use('/upload', verificarAutenticacao, rotaUpload);
app.use('/modelo', verificarAutenticacao, rotaModelo);
app.use('/pagamento', verificarAutenticacao, rotaPagamento);
app.use('/urgencia', verificarAutenticacao, rotaUrgencia);
app.use('/ordem-servico', verificarAutenticacao, rotaOrdemServico);
app.use('/tipo-lacre', verificarAutenticacao, rotaTipoLacre);
app.use('/tipo-analise', verificarAutenticacao, rotaTipoAnalise);
app.use('/tipo-limpeza', verificarAutenticacao, rotaTipoLimpeza);
app.use('/tipo-transporte', verificarAutenticacao, rotaTipoTransporte);
app.use('/fabricante', verificarAutenticacao, rotaFabricante);
app.use('/defeito-alegado', verificarAutenticacao, rotaDefeitoAlegado);
app.use('/clientepj', verificarAutenticacao, rotaClientePJ);
app.use('/logs', verificarAutenticacao, rotaLogs);

app.use('/dias-pagamento', verificarAutenticacao, rotaDiasPagamento);
app.use('/checklist-item', verificarAutenticacao, rotaChecklistItem);
app.use('/etapa-os', verificarAutenticacao, rotaEtapaOS);
app.use('/servico-padrao', verificarAutenticacao, rotaServicoPadrao);

// Bling Routes
app.use('/bling', blingRoutes);
app.use('/bling/contatos', contatosRoutes);

// ==== Rotas auxiliares ====
app.get('/', (_req, res) => {
  res.send('Servidor Alsten MVP rodando!');
});

// Health check
app.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
    },
    checks: {
      database: 'checking',
      server: 'healthy',
    },
  };

  try {
    const { default: conectar } = await import('./Service/conexao.js');
    const conexao = await conectar();
    await conexao.query('SELECT 1');
    conexao.release();
    healthStatus.checks.database = 'healthy';
  } catch (error) {
    healthStatus.checks.database = 'unhealthy';
    healthStatus.status = 'unhealthy';
    console.error('Health check - Database error:', error.message);
    return res.status(503).json(healthStatus);
  }

  res.status(200).json(healthStatus);
});


/**
 * ==== Middleware global de tratamento de erros ====
 * Retorna JSON padronizado, sem vazar stack trace ou detalhes sensíveis.
 */
app.use((err, req, res, next) => {
  // Loga o erro no servidor (sem enviar stack trace ao cliente)
  console.error('Erro não tratado:', err);

  // Monta resposta padronizada
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const message =
    status === 500
      ? 'Erro interno do servidor'
      : err.message || 'Erro inesperado';

  res.status(status).json({
    success: false,
    error: {
      message,
      code: status,
    },
  });
});

// ==== Inicializar servidor ====
const host = '0.0.0.0';
const porta = process.env.PORT || 4000;

app.listen(porta, host, () => {
  console.log(`✅ Servidor escutando em http://${host}:${porta}`);
  console.log(`💓 Health check disponível em: http://${host}:${porta}/health`);
});