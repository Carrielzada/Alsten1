import { Router } from "express";
import { verificarAutenticacao } from "../Seguranca/autenticar.js";
import ModeloController from "../Controle/modeloCtrl.js";

const rotaModelo = new Router();
const modeloController = new ModeloController();

rotaModelo.post("/", verificarAutenticacao, modeloController.incluir)
          .put("/:id", verificarAutenticacao, modeloController.alterar)
          .delete("/:id", verificarAutenticacao, modeloController.excluir)
          .get("/filtro/:termobusca", verificarAutenticacao, modeloController.filtrar)
          .get("/id/:id", verificarAutenticacao, modeloController.obterPorId)
          .get("/", verificarAutenticacao, modeloController.obterTodos);

export default rotaModelo;
