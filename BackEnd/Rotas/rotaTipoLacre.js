import { Router } from "express";
import TipoLacreCtrl from "../Controle/tipoLacreCtrl.js";
import { verificarAutenticacao } from "../Seguranca/autenticar.js";

const rotaTipoLacre = new Router();
const tipoLacreCtrl = new TipoLacreCtrl();

rotaTipoLacre.post("/", verificarAutenticacao, tipoLacreCtrl.gravar)
             .put("/", verificarAutenticacao, tipoLacreCtrl.atualizar)
             .delete("/", verificarAutenticacao, tipoLacreCtrl.excluir)
             .get("/", verificarAutenticacao, tipoLacreCtrl.consultar)
             .get("/:termo", verificarAutenticacao, tipoLacreCtrl.consultar);

export default rotaTipoLacre;
