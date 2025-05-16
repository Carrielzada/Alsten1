import express from 'express';
import PagamentoController from '../Controle/pagamentoCtrl.js'; // Alterado para import ES Module

const router = express.Router();
const pagamentoController = new PagamentoController();

router.get('/', pagamentoController.obterTodos.bind(pagamentoController));
router.post('/', pagamentoController.adicionar.bind(pagamentoController));
router.get('/:id', pagamentoController.obterPorId.bind(pagamentoController));
router.put('/:id', pagamentoController.atualizar.bind(pagamentoController));
router.delete('/:id', pagamentoController.delete.bind(pagamentoController)); // 'delete' é método do controller
router.get('/filtrar/:termobusca', pagamentoController.filtrar.bind(pagamentoController));

export default router;

