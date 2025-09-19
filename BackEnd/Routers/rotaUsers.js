import { Router } from "express";
import UsersCtrl from '../Controller/usersCtrl.js';
import { verificarAutenticacao, verificarRole } from '../Security/autenticar.js';

const rotaUsers = new Router();
const usersCtrl = new UsersCtrl();

// Rotas públicas
rotaUsers.post('/registrar', (req, res) => usersCtrl.gravar(req, res));

// Rotas protegidas que requerem autenticação
rotaUsers.put('/alterarSenha', verificarAutenticacao, (req, res) => usersCtrl.atualizar(req, res)); // altera senha de usuario

// 🔒 ROTAS ADMINISTRATIVAS - Admin para gestão, outros roles para consulta OS
rotaUsers.get('/role', verificarAutenticacao, verificarRole(1), (req, res) => usersCtrl.consultarPorRole(req, res)); // consulta user por role - apenas Admin
rotaUsers.get('/', verificarAutenticacao, verificarRole([1, 2, 3, 4, 5, 6]), (req, res) => usersCtrl.consultar(req, res)); // consulta usuários - todos podem (para OS)
rotaUsers.delete('/:id', verificarAutenticacao, verificarRole(1), (req, res) => usersCtrl.excluir(req, res)); //deleta por id
rotaUsers.put('/:id', verificarAutenticacao, verificarRole(1), (req, res) => usersCtrl.atualizarDadosUsuario(req, res)); // atualizar qualquer usuario

// Rota para o usuário atualizar seus próprios dados
rotaUsers.put('/meuPerfil', verificarAutenticacao, (req, res) => {
    // Obtém o ID do usuário a partir do token JWT
    const usuarioId = req.user.id;
    // Configura o ID no corpo da requisição
    req.params.id = usuarioId;
    // Chama o método de atualização
    usersCtrl.atualizarDadosUsuario(req, res);
});

// Endpoint /vendedores removido - usando /users diretamente com permissões adequadas

export default rotaUsers;