import { Router } from "express";
import FabricanteCtrl from "../Controle/fabricanteCtrl.js";
import { verificarAutenticacao } from "../Seguranca/autenticar.js";

const rotaFabricante = new Router();
const fabricanteCtrl = new FabricanteCtrl();

rotaFabricante.post("/", verificarAutenticacao, fabricanteCtrl.gravar)
              .put("/", verificarAutenticacao, fabricanteCtrl.atualizar)
              .delete("/", verificarAutenticacao, fabricanteCtrl.excluir)
              .get("/", verificarAutenticacao, fabricanteCtrl.consultar)
              .get("/:termo", verificarAutenticacao, fabricanteCtrl.consultar);

export default rotaFabricante;
