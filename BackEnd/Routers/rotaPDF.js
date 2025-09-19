import express from 'express';
import pdfCtrl from '../Controller/pdfCtrl.js';
import { verificarToken } from '../Middleware/verificarToken.js';

const router = express.Router();

// Middleware de autenticação para todas as rotas de PDF
router.use(verificarToken);

// Rota para gerar e baixar PDF do orçamento
// GET /pdf/orcamento/:id?incluirVendedor=true&incluirTecnico=true&formato=download
router.get('/orcamento/:id', pdfCtrl.gerarOrcamentoPDF);

// Rota para visualizar PDF do orçamento no navegador
// GET /pdf/orcamento/:id/visualizar?incluirVendedor=true&incluirTecnico=true
router.get('/orcamento/:id/visualizar', pdfCtrl.visualizarOrcamentoPDF);

// Rota para salvar PDF do orçamento no servidor
// POST /pdf/orcamento/:id/salvar
router.post('/orcamento/:id/salvar', pdfCtrl.salvarOrcamentoPDF);

export default router;