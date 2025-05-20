import { Router } from "express";
import PropagandaPFCtrl from "../Controller/PropagandaPFCtrl.js";
import { verificarRole } from "../Security/autenticar.js";

const rotaPropagandaPF = new Router();
const propagandaPFCtrl = new PropagandaPFCtrl();

// Rotas principais
rotaPropagandaPF.post('/', verificarRole(2), propagandaPFCtrl.gravar)  
                .put('/:id', verificarRole(2), propagandaPFCtrl.atualizar)
                .put('/arquivos-adicionais/:id', verificarRole(2), propagandaPFCtrl.atualizarArquivosAdicionais) 
                .delete('/:id', verificarRole(2), propagandaPFCtrl.excluir)  
                .get('/', verificarRole(2, 3), propagandaPFCtrl.consultar)  
                .get('/:id', verificarRole(2, 3), propagandaPFCtrl.consultarPorId);

// Rota para download de arquivos
rotaPropagandaPF.get('/files/:cpf/:filename', verificarRole(2), propagandaPFCtrl.downloadArquivo);


export default rotaPropagandaPF;
