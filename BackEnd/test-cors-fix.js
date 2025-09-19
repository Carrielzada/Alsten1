import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

// Lista padrão de origens permitidas (mesma configuração do index.js)
const defaultWhiteList = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://31.97.151.181:3000',
  'http://31.97.151.181:3001',
  'http://alsten.online',
  'https://alsten.online',
  'https://api.alsten.online',
];

// Configuração do CORS (mesma do index.js)
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (defaultWhiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origem não permitida: ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// CORS ANTES do rate limiting (correção aplicada)
app.use(cors(corsOptions));

// Rate limiting DEPOIS do CORS
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: { error: 'Muitas requisições deste IP, tente novamente mais tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(express.json());

// Rota de teste
app.get('/test', (req, res) => {
  res.json({ 
    message: 'CORS funcionando!', 
    origin: req.get('Origin'),
    timestamp: new Date().toISOString()
  });
});

// Rota para teste OPTIONS (preflight)
app.options('/test', (req, res) => {
  res.json({ message: 'Preflight OPTIONS funcionando!' });
});

const port = 4001;
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor de teste rodando na porta ${port}`);
  console.log(`🧪 Teste: curl -X OPTIONS http://localhost:${port}/test -H "Origin: https://alsten.online"`);
  console.log(`🧪 Teste: curl -X GET http://localhost:${port}/test -H "Origin: https://alsten.online"`);
});