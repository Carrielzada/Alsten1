const PagamentoController = require('../Controle/PagamentoCtrl.js');
const pagamentoController = new PagamentoController();
const express = require('express');
const router = express.Router();

router.get('/pagamento', pagamentoController.obterTodos);
router.post('/pagamento', pagamentoController.adicionar);
router.get('/pagamento/:id', pagamentoController.obterPorId);
router.put('/pagamento/:id', pagamentoController.atualizar);
router.delete('/pagamento/:id', pagamentoController.excluir);
router.get('/pagamento/filtrar/:termobusca', pagamentoController.filtrar);

module.exports = router;