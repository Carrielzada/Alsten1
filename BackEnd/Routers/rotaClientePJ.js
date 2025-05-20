import { Router } from "express";
import ClientePJCtrl from "../Controller/clientePJCtrl.js";

const rotaClientePJ = new Router();
const clientePJCtrl = new ClientePJCtrl();

rotaClientePJ.post('/', clientePJCtrl.gravar)
             .put('/:cnpj', clientePJCtrl.atualizar)
             .delete('/:cnpj', clientePJCtrl.excluir)
             .get('/', clientePJCtrl.consultar)
             .get('/:cnpj', clientePJCtrl.consultarPorCnpj);

export default rotaClientePJ;
