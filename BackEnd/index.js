import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Importações das novas rotas do Bling
import blingRoutes from './Routers/blingRoutes.js';
import contatosRoutes from './Routers/contatosRoutes.js';

import { verificarAutenticacao } from './Security/autenticar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = '0.0.0.0';
const porta = 4000;

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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

// Rotas do Bling (já corrigidas no passo anterior)
app.use("/bling", blingRoutes);
app.use("/bling/contatos", contatosRoutes);

app.get('/', (_req, res) => {
    res.send('Servidor Alsten MVP rodando!');
});

app.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`);
    console.log(`Uploads sendo servidos de: ${path.join(__dirname, '..', 'uploads')}`);
});