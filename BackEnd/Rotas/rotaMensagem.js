import { Router } from "express";
import MensagemCtrl from "../Controle/mensagemCtrl.js";
import { verificarRole } from "../Seguranca/autenticar.js";

const rotaMensagem = new Router();
const mensagemCtrl = new MensagemCtrl();

rotaMensagem.post('/', verificarRole(2, 3, 4), mensagemCtrl.gravar) // Criação de uma nova mensagem
            .delete('/:id', verificarRole(2), mensagemCtrl.excluir) // Exclusão de uma mensagem pelo ID
            .get('/', verificarRole(2), mensagemCtrl.consultar) // Consulta de todas as mensagens ou por termo
            .get('/:id', verificarRole(2), mensagemCtrl.consultarPorId) // Consulta de uma mensagem específica pelo ID
            .put('/:id', verificarRole(2), mensagemCtrl.atualizarStatus)
            .get('/files/:userId/:userName/:mesAno/:arquivo', verificarRole(2), mensagemCtrl.downloadMensagem)
            .get('/status/:status', verificarRole(2), mensagemCtrl.consultarPorStatus);

            
export default rotaMensagem;
