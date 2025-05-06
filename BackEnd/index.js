import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import rotaClientePF from './Rotas/rotaClientePF.js';
import rotaClientePJ from './Rotas/rotaClientePJ.js';
import rotaNetworking from './Rotas/rotaNetworking.js';
import rotaPublicidadePJ from './Rotas/rotaPublicidadePJ.js';
import rotaPropagandaPF from './Rotas/rotaPropagandaPF.js';
import rotaPropagandaPJ from './Rotas/rotaPropagandaPJ.js';
import rotaLogs from './Rotas/rotaLogs.js';
import rotaAutenticacao from './Rotas/rotaAutenticacao.js'; // Rota de autenticação
import rotaClientes from "./Rotas/rotaClientes.js";
import rotaUsers from './Rotas/rotaUsers.js';
import rotaMensagem from './Rotas/rotaMensagem.js';
import { verificarAutenticacao } from './Seguranca/autenticar.js';

dotenv.config();

const host = '0.0.0.0';
const porta = 4000;

const app = express();

// Configuração da sessão
app.use(
    session({
        secret: process.env.CHAVE_SECRETA,
        resave: true,
        saveUninitialized: true,
        cookie: {
            httpOnly: false,
            secure: false,
            sameSite: false,
            maxAge: 1000 * 60 * 15, // 15 minutos
        },
    })
);

// Configuração do CORS
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000"],
    })
);

// Configuração do body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração do middleware fileUpload
app.use(
    fileUpload({
        createParentPath: true, // Cria diretórios automaticamente, se necessário
        limits: { fileSize: 50 * 1024 * 1024 }, // Limite de tamanho para os arquivos (50 MB)
        abortOnLimit: true, // Retorna erro caso o arquivo ultrapasse o limite
    })
);

// Rotas
app.use('/autenticacao', rotaAutenticacao); // Autenticação
app.use('/clientes/pf', verificarAutenticacao, rotaClientePF); // Cliente Pessoa Física
app.use('/clientes/pj', verificarAutenticacao, rotaClientePJ); // Cliente Pessoa Jurídica
app.use('/networking', verificarAutenticacao, rotaNetworking); // Networking
app.use('/publicidade_pj', verificarAutenticacao, rotaPublicidadePJ); // Publicidade
app.use('/propaganda_pf', verificarAutenticacao, rotaPropagandaPF); // Propaganda PF
app.use('/propaganda_pj', verificarAutenticacao, rotaPropagandaPJ); // Propaganda PJ
app.use('/logs', verificarAutenticacao, rotaLogs); // Logs
app.use('/api/cliente', rotaClientes);
app.use('/users', rotaUsers);
app.use('/mensagem', verificarAutenticacao, rotaMensagem);


app.get('/', (_req, res) => {
    res.send('Hello from STD server!');
});

// Iniciar o servidor
app.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`);
});
