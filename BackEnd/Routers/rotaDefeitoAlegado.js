import { Router } from "express";
import DefeitoAlegadoCtrl from "../Controller/defeitoAlegadoCtrl.js";
import { verificarAutenticacao } from "../Security/autenticar.js";

const rotaDefeitoAlegado = new Router();
const defeitoAlegadoCtrl = new DefeitoAlegadoCtrl();

rotaDefeitoAlegado.post("/", verificarAutenticacao, defeitoAlegadoCtrl.gravar)
                  .put("/", verificarAutenticacao, defeitoAlegadoCtrl.atualizar)
                  .delete("/", verificarAutenticacao, defeitoAlegadoCtrl.excluir)
                  .get("/", verificarAutenticacao, defeitoAlegadoCtrl.consultar)
                  .get("/:termo", verificarAutenticacao, defeitoAlegadoCtrl.consultar);

export default rotaDefeitoAlegado;
