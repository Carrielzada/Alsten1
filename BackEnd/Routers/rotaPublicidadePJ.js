import { Router } from "express";
import PublicidadePJCtrl from "../Controller/publicidadePJCtrl.js";
import { verificarRole } from "../Security/autenticar.js";

const rotaPublicidadePJ = new Router();
const publicidadePJCtrl = new PublicidadePJCtrl();

// Rotas configuradas para publicidadePJ
rotaPublicidadePJ.post('/', verificarRole(2, 4), publicidadePJCtrl.gravar);      
rotaPublicidadePJ.put('/:id', verificarRole(2, 4), publicidadePJCtrl.atualizar);  
rotaPublicidadePJ.put('/arquivos-adicionais/:id', verificarRole(2, 4), publicidadePJCtrl.atualizarArquivosAdicionais)  
rotaPublicidadePJ.put('/comprovante/:id', verificarRole(2, 4), publicidadePJCtrl.atualizarComprovantes);
rotaPublicidadePJ.delete('/:id', verificarRole(2, 4), publicidadePJCtrl.excluir); 
rotaPublicidadePJ.get('/', verificarRole(2, 4), publicidadePJCtrl.consultar);
rotaPublicidadePJ.get('/:id', verificarRole(2, 4), publicidadePJCtrl.consultarPorId); 

// Rota para download de arquivos
rotaPublicidadePJ.get('/files/:cnpj/:filename', verificarRole(2, 4), publicidadePJCtrl.downloadArquivo);

// Rota para download de comprovantes
rotaPublicidadePJ.get('/comprovantes/:id/:ano/:mes/:filename',verificarRole(2, 4), publicidadePJCtrl.downloadComprovante);

rotaPublicidadePJ.get('/:id/comprovantes', verificarRole(2, 4), publicidadePJCtrl.consultarComprovantesPorPublicidade);


export default rotaPublicidadePJ;
