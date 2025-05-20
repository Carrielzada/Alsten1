import { Router } from "express";
import TipoAnaliseCtrl from "../Controller/tipoAnaliseCtrl.js";
import { verificarAutenticacao } from "../Security/autenticar.js";

const rotaTipoAnalise = new Router();
const tipoAnaliseCtrl = new TipoAnaliseCtrl();

rotaTipoAnalise.post("/", verificarAutenticacao, tipoAnaliseCtrl.gravar)
               .put("/", verificarAutenticacao, tipoAnaliseCtrl.atualizar)
               .delete("/", verificarAutenticacao, tipoAnaliseCtrl.excluir)
               .get("/", verificarAutenticacao, tipoAnaliseCtrl.consultar)
               .get("/:termo", verificarAutenticacao, tipoAnaliseCtrl.consultar);

export default rotaTipoAnalise;
