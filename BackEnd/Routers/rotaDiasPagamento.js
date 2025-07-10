import express from 'express';
import diasPagamentoController from '../Controller/diasPagamentoCtrl.js';
import { verificarAutenticacao } from '../Security/autenticar.js';

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(verificarAutenticacao);

// GET - Listar todos os dias de pagamento
router.get('/', diasPagamentoController.listarTodos);

// GET - Buscar dias de pagamento por ID
router.get('/:id', diasPagamentoController.buscarPorId);

// POST - Criar novo dias de pagamento
router.post('/', diasPagamentoController.gravar);

// PUT - Atualizar dias de pagamento
router.put('/:id', diasPagamentoController.atualizar);

// DELETE - Excluir dias de pagamento
router.delete('/:id', diasPagamentoController.excluir);

export default router; 