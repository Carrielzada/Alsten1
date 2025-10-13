import { Router } from "express";
import OrdemServicoCtrl from "../Controller/ordemServicoCtrl.js";
import { verificarAutenticacao, verificarRole } from '../Security/autenticar.js';
import upload from '../Service/uploadService.js';

const rotaOrdemServico = new Router();
const ordemServicoCtrl = new OrdemServicoCtrl();

// Rota de cadastro/atualização de OS
rotaOrdemServico.post('/', ordemServicoCtrl.gravar);

// Rota de atualização de OS (PUT)
rotaOrdemServico.put('/:id', ordemServicoCtrl.gravar);

// Rota de consulta de todas as OS
rotaOrdemServico.get('/', ordemServicoCtrl.consultar);

// Rota de consulta de OS por ID
rotaOrdemServico.get('/:id', ordemServicoCtrl.consultarPorId);

// Rota para anexar um arquivo a uma OS
// Aplica o middleware de upload antes do controlador
rotaOrdemServico.post('/anexar-arquivo/:id', upload.single('arquivo'), ordemServicoCtrl.anexarArquivo);

// Rota específica para anexar comprovante de aprovação/reprovação (apenas imagens)
rotaOrdemServico.post('/:id/comprovante', upload.single('arquivo'), ordemServicoCtrl.anexarComprovante);

// Rota para remover um arquivo de uma OS
rotaOrdemServico.delete('/:id/arquivo/:nomeArquivo', ordemServicoCtrl.removerArquivo);

// Rota para transição de etapas com validações de negócio (gate de anexos/campos)
rotaOrdemServico.post('/:id/transition', ordemServicoCtrl.transicionarEtapa);

// Rota de exclusão de OS
rotaOrdemServico.delete("/:id", ordemServicoCtrl.excluir);

// Rota para consultar logs de uma OS
rotaOrdemServico.get("/:id/logs", ordemServicoCtrl.consultarLogs);

// --- LOCK DE EDIÇÃO CONCORRENTE ---
rotaOrdemServico.post('/:id/lock', verificarAutenticacao, ordemServicoCtrl.criarLock);
rotaOrdemServico.post('/:id/lock/refresh', verificarAutenticacao, ordemServicoCtrl.refrescarLock);
rotaOrdemServico.get('/:id/lock', verificarAutenticacao, ordemServicoCtrl.verificarLock);
rotaOrdemServico.delete('/:id/lock', verificarAutenticacao, ordemServicoCtrl.removerLock);
rotaOrdemServico.get('/locks', verificarAutenticacao, ordemServicoCtrl.listarLocks);

export default rotaOrdemServico;
