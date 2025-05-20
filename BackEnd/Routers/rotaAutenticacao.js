import { Router } from "express";
import { login, logout } from '../Security/autenticar.js';
import { verificarAutenticacao } from '../Security/autenticar.js';

const rotaAutenticacao = new Router();

rotaAutenticacao.post('/login', login);
rotaAutenticacao.get('/logout', verificarAutenticacao, logout);

export default rotaAutenticacao;
