import { Router } from "express";
import NetworkingCtrl from "../Controller/networkingCtrl.js";

const rotaNetworking = new Router();
const networkingCtrl = new NetworkingCtrl();

rotaNetworking.post('/', networkingCtrl.gravar)  
              .put('/:id', networkingCtrl.atualizar)
              .delete('/:id', networkingCtrl.excluir)  
              .get('/', networkingCtrl.consultar)  
              .get('/:id', networkingCtrl.consultarPorId); 

export default rotaNetworking;
