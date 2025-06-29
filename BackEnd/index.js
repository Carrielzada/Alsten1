import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path'; // Importar o módulo path
import { fileURLToPath } from 'url'; // Para __dirname em ES modules

// Routes do novo sistema Alsten (MVP)
import rotaAutenticacao from './Routers/rotaAutenticacao.js';
import rotaUpload from './Routers/rotaUpload.js';
import rotaModelo from './Routers/rotaModelo.js';
import rotaPagamento from './Routers/rotaPagamento.js';
import rotaUrgencia from './Routers/rotaUrgencia.js';
import rotaOrdemServico from './Routers/rotaOrdemServico.js'; // Importar a nova rota
import rotaTipoLacre from './Routers/rotaTipoLacre.js'; // Importar rota para Tipo de Lacre
import rotaTipoAnalise from './Routers/rotaTipoAnalise.js'; // Importar rota para Tipo de Análise
import rotaTipoLimpeza from './Routers/rotaTipoLimpeza.js'; // Importar rota para Tipo de Limpeza
import rotaTipoTransporte from './Routers/rotaTransporte.js';
import rotaFabricante from './Routers/rotaFabricante.js'; // Importar rota para Fabricante
import rotaDefeitoAlegado from './Routers/rotaDefeitoAlegado.js'; // Importar rota para Defeito Alegado
import rotaClientePJ from './Routers/rotaClientePJ.js';
import rotaUsers from './Routers/rotaUsers.js'; 


// Middleware de autenticação
import { verificarAutenticacao } from './Security/autenticar.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = '0.0.0.0';
const porta = 4000;

const app = express();

// Configuração da sessão
app.use(
    session({
        secret: process.env.CHAVE_SECRETA || 'sua_chave_secreta_padrao',
        resave: true,
        saveUninitialized: true,
        cookie: {
            httpOnly: false, // Em produção, considere true se o frontend não precisar ler o cookie via JS
            secure: false, // Em produção, use true com HTTPS
            sameSite: false, // Em produção, considere 'lax' ou 'strict'
            maxAge: 1000 * 60 * 60 * 2, // 2 horas (ajuste conforme necessário)
        },
    })
);

// Configuração do CORS
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000"], // Ajuste para o seu ambiente de desenvolvimento/produção
    })
);

// Configuração do body-parser (já embutido no Express >= 4.16)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos da pasta 'uploads'
// Isso permite que o frontend acesse os arquivos via http://localhost:4000/uploads/nome-do-arquivo.ext
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes do MVP Alsten
app.use('/users', rotaUsers);
app.use('/autenticacao', rotaAutenticacao);
app.use('/upload', verificarAutenticacao, rotaUpload);
app.use('/modelo', verificarAutenticacao, rotaModelo);
app.use('/pagamento', verificarAutenticacao, rotaPagamento);
app.use("/urgencia", verificarAutenticacao, rotaUrgencia);
app.use("/ordem-servico", verificarAutenticacao, rotaOrdemServico); // Ativar a rota OS
app.use("/tipo-lacre", verificarAutenticacao, rotaTipoLacre); // Ativar a rota Tipo Lacre
app.use("/tipo-analise", verificarAutenticacao, rotaTipoAnalise); // Ativar a rota Tipo Análise
app.use("/tipo-limpeza", verificarAutenticacao, rotaTipoLimpeza); // Ativar a rota Tipo Limpeza
app.use("/tipo-transporte", verificarAutenticacao, rotaTipoTransporte); // Ativar a rota Tipo Transporte
app.use("/fabricante", verificarAutenticacao, rotaFabricante); // Ativar a rota Fabricante
app.use("/defeito-alegado", verificarAutenticacao, rotaDefeitoAlegado); // Ativar a rota Defeito Alegado
app.use("/clientepj", verificarAutenticacao, rotaClientePJ); // Ativar a rota ClientePJ


app.get('/', (_req, res) => {
    res.send('Servidor Alsten MVP rodando!');
});

// Iniciar o servidor
app.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`);
    console.log(`Uploads sendo servidos de: ${path.join(__dirname, '..', 'uploads')}`);
});

