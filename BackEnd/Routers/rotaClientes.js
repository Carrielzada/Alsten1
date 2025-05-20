import { Router } from "express";
import ClienteCtrl from "../Controller/clienteCtrl.js";
import { verificarAutenticacao} from '../Security/autenticar.js';

const rotaCliente = new Router();
const clienteCtrl = new ClienteCtrl();

// Rota para obter os dados do cliente
rotaCliente.get("/publicidade", verificarAutenticacao, (req, res) =>
    clienteCtrl.obterPublicidadesCliente(req, res)
);

rotaCliente.get("/propaganda_pj", verificarAutenticacao, (req, res) =>
    clienteCtrl.obterPropagandasCliente(req, res)
);

rotaCliente.get("/propaganda_pf", verificarAutenticacao, (req, res) =>
    clienteCtrl.obterPropagandasPFCliente(req, res)
);

export default rotaCliente;

