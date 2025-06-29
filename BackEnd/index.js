import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Suas rotas...
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

import { verificarAutenticacao } from './Security/autenticar.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = '0.0.0.0';
const porta = 4000; // O backend continua na porta 4000

const app = express();

app.use(
    session({
        secret: process.env.CHAVE_SECRETA || 'sua_chave_secreta_padrao',
        resave: true,
        saveUninitialized: true,
        cookie: {
            httpOnly: false,
            secure: false, 
            sameSite: false,
            maxAge: 1000 * 60 * 60 * 2,
        },
    })
);

// ===================================================================
//               1. CORREÇÃO PRINCIPAL NO CORS
// ===================================================================
// Esta configuração é mais flexível para o ambiente de desenvolvimento.
// Ela aceitará requisições de múltiplas portas comuns (3000, 3001, 5173, etc.)
const whiteList = ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"];
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
// ===================================================================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===================================================================
//           2. CORREÇÃO DEFINITIVA NO CAMINHO DO UPLOAD
// ===================================================================
// Adicionando '..' para subir um nível e encontrar a pasta 'uploads' na raiz.
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// ===================================================================


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

app.get('/', (_req, res) => {
    res.send('Servidor Alsten MVP rodando!');
});

app.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`);
    console.log(`Uploads sendo servidos de: ${path.join(__dirname, '..', 'uploads')}`);
});