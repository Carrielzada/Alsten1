import { Router } from "express";
import TipoLacreCtrl from "../Controller/tipoLacreCtrl.js";
import { verificarAutenticacao } from "../Security/autenticar.js";

const rotaTipoLacre = new Router();
const tipoLacreCtrl = new TipoLacreCtrl();

rotaTipoLacre.post("/", verificarAutenticacao, tipoLacreCtrl.gravar)
             .put("/", verificarAutenticacao, tipoLacreCtrl.atualizar)
             .delete("/", verificarAutenticacao, tipoLacreCtrl.excluir)
             .get("/", verificarAutenticacao, tipoLacreCtrl.consultar)
             .get("/:termo", verificarAutenticacao, tipoLacreCtrl.consultar);

export default rotaTipoLacre;
