import { Router } from "express";
import TipoLimpezaCtrl from "../Controller/tipoLimpezaCtrl.js";
import { verificarAutenticacao } from "../Security/autenticar.js";

const rotaTipoLimpeza = new Router();
const tipoLimpezaCtrl = new TipoLimpezaCtrl();

rotaTipoLimpeza.post("/", verificarAutenticacao, tipoLimpezaCtrl.gravar)
               .put("/", verificarAutenticacao, tipoLimpezaCtrl.atualizar)
               .delete("/", verificarAutenticacao, tipoLimpezaCtrl.excluir)
               .get("/", verificarAutenticacao, tipoLimpezaCtrl.consultar)
               .get("/:termo", verificarAutenticacao, tipoLimpezaCtrl.consultar);

export default rotaTipoLimpeza;
