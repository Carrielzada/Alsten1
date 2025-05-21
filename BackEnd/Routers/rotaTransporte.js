import { Router } from "express";
import TipoTransporteCtrl from "../Controller/tipoTransporteCtrl.js";
import { verificarAutenticacao } from "../Security/autenticar.js";

const rotaTipoTransporte = new Router();
const tipoTransporteCtrl = new TipoTransporteCtrl();

rotaTipoTransporte.post("/", verificarAutenticacao, tipoTransporteCtrl.gravar)
               .put("/", verificarAutenticacao, tipoTransporteCtrl.atualizar)
               .delete("/", verificarAutenticacao, tipoTransporteCtrl.excluir)
               .get("/", verificarAutenticacao, tipoTransporteCtrl.consultar)
               .get("/:termo", verificarAutenticacao, tipoTransporteCtrl.consultar);

export default rotaTipoTransporte;
