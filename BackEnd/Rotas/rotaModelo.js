const ModeloController = require('../Controle/modeloCtrl.js');
const modeloController = new ModeloController();
const express = require('express');
const router = express.Router();

router.get('/modelo', modeloController.obterTodos);
router.post('/modelo', modeloController.adicionar);
router.get('/modelo/:id', modeloController.obterPorId);
router.put('/modelo/:id', modeloController.atualizar);
router.delete('/modelo/:id', modeloController.excluir);
router.get('/modelo/filtrar/:termobusca', modeloController.filtrar);

module.exports = router;