import { Router } from "express";
import ClientePFCtrl from "../Controller/clientePFCtrl.js";

const rotaClientePF = new Router();
const clientePFCtrl = new ClientePFCtrl();

rotaClientePF.post('/', (req, res) => clientePFCtrl.gravar(req, res));  
rotaClientePF.put('/:cpf', (req, res) => clientePFCtrl.atualizar(req, res));
rotaClientePF.delete('/:cpf', clientePFCtrl.excluir);
rotaClientePF.get('/', (req, res) => clientePFCtrl.consultar(req, res));  
rotaClientePF.get('/:cpf', (req, res) => clientePFCtrl.consultarPorId(req, res)); 

export default rotaClientePF;
