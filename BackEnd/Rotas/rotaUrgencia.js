const UrgenciaController = require('../Controle/urgenciaCtrl.js');
const urgenciaController = new UrgenciaController();
const express = require('express');
const router = express.Router();

router.get('/urgencia', urgenciaController.obterTodos);
router.post('/urgencia', urgenciaController.adicionar);
router.get('/urgencia/:id', urgenciaController.obterPorId);
router.put('/urgencia/:id', urgenciaController.atualizar);
router.delete('/urgencia/:id', urgenciaController.excluir);
router.get('/urgencia/filtrar/:termobusca', urgenciaController.filtrar);

module.exports = router;