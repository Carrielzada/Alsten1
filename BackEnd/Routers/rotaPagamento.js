import { Router } from "express";
import { verificarAutenticacao } from "../Security/autenticar.js";
import PagamentoCtrl from "../Controller/pagamentoCtrl.js";

const rotaPagamento = new Router();
const pagamentoCtrl = new PagamentoCtrl();

rotaPagamento.post("/", verificarAutenticacao, pagamentoCtrl.gravar)
               .put("/", verificarAutenticacao, pagamentoCtrl.atualizar)
               .delete("/", verificarAutenticacao, pagamentoCtrl.excluir)
               .get("/", verificarAutenticacao, pagamentoCtrl.consultar)
               .get("/:termo", verificarAutenticacao, pagamentoCtrl.consultar);

export default rotaPagamento;
