import { Router } from "express";
import PropagandaPJCtrl from "../Controller/PropagandaPJCtrl.js";
import { verificarRole } from "../Security/autenticar.js";

const rotaPropagandaPJ = new Router();
const propagandaPJCtrl = new PropagandaPJCtrl();

// Rotas configuradas para PropagandaPJ
rotaPropagandaPJ.post('/', verificarRole(2), propagandaPJCtrl.gravar); 
rotaPropagandaPJ.put('/:id', verificarRole(2), propagandaPJCtrl.atualizar);
rotaPropagandaPJ.put('/arquivos-adicionais/:id', verificarRole(2), propagandaPJCtrl.atualizarArquivosAdicionais)  
rotaPropagandaPJ.delete('/:id', verificarRole(2), propagandaPJCtrl.excluir);
rotaPropagandaPJ.get('/', verificarRole(2, 3), propagandaPJCtrl.consultar); 
rotaPropagandaPJ.get('/:id', verificarRole(2, 3), propagandaPJCtrl.consultarPorId); 

// Rota para download de arquivos
rotaPropagandaPJ.get('/files/:cnpj/:filename', verificarRole(2), propagandaPJCtrl.downloadArquivo);

export default rotaPropagandaPJ;
