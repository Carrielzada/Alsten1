import express from 'express';
import ModeloController from '../Controle/modeloCtrl.js'; // Alterado para import ES Module

const router = express.Router();
const modeloController = new ModeloController();

router.get('/', modeloController.obterTodos.bind(modeloController));
router.post('/', modeloController.adicionar.bind(modeloController));
router.get('/:id', modeloController.obterPorId.bind(modeloController));
router.put('/:id', modeloController.atualizar.bind(modeloController));
router.delete('/:id', modeloController.delete.bind(modeloController)); // Corrigido de 'excluir' para 'delete'
router.get('/filtrar/:termobusca', modeloController.filtrar.bind(modeloController));

export default router;

