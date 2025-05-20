import { Router } from "express";
import { verificarAutenticacao } from "../Seguranca/autenticar.js";
import PagamentoCtrl from "../Controle/pagamentoCtrl.js";

const rotaPagamento = new Router();
const pagamentoCtrl = new PagamentoCtrl();

rotaPagamento.post("/", verificarAutenticacao, pagamentoCtrl.gravar)
               .put("/", verificarAutenticacao, pagamentoCtrl.atualizar)
               .delete("/", verificarAutenticacao, pagamentoCtrl.excluir)
               .get("/", verificarAutenticacao, pagamentoCtrl.consultar)
               .get("/:termo", verificarAutenticacao, pagamentoCtrl.consultar);

export default rotaPagamento;
