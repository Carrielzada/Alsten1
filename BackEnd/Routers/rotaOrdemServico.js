import { Router } from "express";
import OrdemServicoCtrl from "../Controller/ordemServicoCtrl.js";

const rotaOrdemServico = new Router();
const ordemServicoCtrl = new OrdemServicoCtrl();

// Rota de cadastro/atualização de OS
rotaOrdemServico.post('/', ordemServicoCtrl.gravar);

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
rotaOrdemServico.delete('/:id', ordemServicoCtrl.excluir);


export default rotaOrdemServico;