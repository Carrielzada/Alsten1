import { Router } from "express";
import { login, logout } from '../Seguranca/autenticar.js';
import { verificarAutenticacao } from '../Seguranca/autenticar.js';

const rotaAutenticacao = new Router();

rotaAutenticacao.post('/login', login);
rotaAutenticacao.get('/logout', verificarAutenticacao, logout);

export default rotaAutenticacao;
