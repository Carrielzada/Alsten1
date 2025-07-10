import express from 'express';
import checklistItemController from '../Controller/checklistItemCtrl.js';
import { verificarAutenticacao } from '../Security/autenticar.js';

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(verificarAutenticacao);

// GET - Listar todos os itens do checklist
router.get('/', checklistItemController.listarTodos);

// GET - Buscar item do checklist por ID
router.get('/:id', checklistItemController.buscarPorId);

// POST - Criar novo item do checklist
router.post('/', checklistItemController.gravar);

// PUT - Atualizar item do checklist
router.put('/:id', checklistItemController.atualizar);

// DELETE - Excluir item do checklist
router.delete('/:id', checklistItemController.excluir);

export default router; 