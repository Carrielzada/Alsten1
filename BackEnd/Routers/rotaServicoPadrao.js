import express from 'express';
import servicoPadraoController from '../Controller/servicoPadraoCtrl.js';
import { verificarAutenticacao } from '../Security/autenticar.js';

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(verificarAutenticacao);

// GET - Listar todos os serviços padrão
router.get('/', servicoPadraoController.listarTodos);

// GET - Buscar serviço padrão por ID
router.get('/:id', servicoPadraoController.buscarPorId);

// POST - Criar novo serviço padrão
router.post('/', servicoPadraoController.gravar);

// PUT - Atualizar serviço padrão
router.put('/:id', servicoPadraoController.atualizar);

// DELETE - Excluir serviço padrão
router.delete('/:id', servicoPadraoController.excluir);

export default router; 