import express from 'express';
import UrgenciaController from '../Controle/urgenciaCtrl.js'; 

const router = express.Router();
const urgenciaController = new UrgenciaController();

router.get('/', urgenciaController.obterTodos.bind(urgenciaController));
router.get('/:id', urgenciaController.obterPorId.bind(urgenciaController));
router.post('/', urgenciaController.incluir.bind(urgenciaController));
router.put('/:id', urgenciaController.alterar.bind(urgenciaController));
router.delete('/:id', urgenciaController.excluir.bind(urgenciaController)); 
router.get('/filtrar/:termobusca', urgenciaController.filtrar.bind(urgenciaController));

export default router;
