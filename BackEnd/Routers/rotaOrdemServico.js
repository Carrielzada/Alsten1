import { Router } from "express";
import OrdemServicoCtrl from "../Controller/ordemServicoCtrl.js";
import { verificarAutenticacao } from '../Security/autenticar.js';

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
// Use um middleware de upload antes do controlador para processar o arquivo
// A rota precisa ter o ID da OS na URL
rotaOrdemServico.post('/anexar-arquivo/:id', ordemServicoCtrl.anexarArquivo);

// Rota para remover um arquivo de uma OS
// Use DELETE e passe o nome do arquivo na URL
rotaOrdemServico.delete('/:id/arquivo/:nomeArquivo', ordemServicoCtrl.removerArquivo);

// Rota de exclusão de OS
rotaOrdemServico.delete("/:id", ordemServicoCtrl.excluir);

// Rota para consultar logs de uma OS
rotaOrdemServico.get("/:id/logs", ordemServicoCtrl.consultarLogs);

// --- LOCK DE EDIÇÃO CONCORRENTE ---
rotaOrdemServico.post('/:id/lock', verificarAutenticacao, ordemServicoCtrl.criarLock);
rotaOrdemServico.get('/:id/lock', verificarAutenticacao, ordemServicoCtrl.verificarLock);
rotaOrdemServico.delete('/:id/lock', verificarAutenticacao, ordemServicoCtrl.removerLock);

export default rotaOrdemServico;