import { Router } from "express";
import UsersCtrl from '../Controle/usersCtrl.js';
import { verificarAutenticacao} from '../Seguranca/autenticar.js';

const rotaUsers = new Router();
const usersCtrl = new UsersCtrl();

rotaUsers.post('/registrar', (req, res) => usersCtrl.gravar(req, res));
rotaUsers.put('/alterarSenha', verificarAutenticacao, (req, res) => usersCtrl.atualizar(req, res));
rotaUsers.delete('/:id', verificarAutenticacao, (req, res) => usersCtrl.excluir(req, res));
rotaUsers.get('/role', verificarAutenticacao, (req, res) => usersCtrl.consultarPorRole(req, res));
rotaUsers.put('/:id', verificarAutenticacao, (req, res) => usersCtrl.atualizarIdDados(req, res));


export default rotaUsers;
