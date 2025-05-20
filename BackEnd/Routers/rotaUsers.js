import { Router } from "express";
import UsersCtrl from '../Controller/usersCtrl.js';
import { verificarAutenticacao, verificarRole } from '../Security/autenticar.js';

const rotaUsers = new Router();
const usersCtrl = new UsersCtrl();

// Rotas públicas
rotaUsers.post('/registrar', (req, res) => usersCtrl.gravar(req, res));

// Rotas protegidas que requerem autenticação
rotaUsers.put('/alterarSenha', verificarAutenticacao, (req, res) => usersCtrl.atualizar(req, res)); // altera senha de usuario
rotaUsers.get('/role', verificarAutenticacao, (req, res) => usersCtrl.consultarPorRole(req, res)); // consulta user por role
rotaUsers.get('/', verificarAutenticacao, (req, res) => usersCtrl.consultar(req, res)); //consulta todos os usuários

// Rotas que requerem autenticação e role específico
rotaUsers.delete('/:id', verificarAutenticacao, verificarRole(1), (req, res) => usersCtrl.excluir(req, res)); //deleta por id

// Nova rota para atualizar dados do usuário
rotaUsers.put('/:id', verificarAutenticacao, (req, res) => usersCtrl.atualizarDadosUsuario(req, res));

// Rota para o usuário atualizar seus próprios dados
rotaUsers.put('/meuPerfil', verificarAutenticacao, (req, res) => {
    // Obtém o ID do usuário a partir do token JWT
    const usuarioId = req.user.id;
    // Configura o ID no corpo da requisição
    req.params.id = usuarioId;
    // Chama o método de atualização
    usersCtrl.atualizarDadosUsuario(req, res);
});

export default rotaUsers;