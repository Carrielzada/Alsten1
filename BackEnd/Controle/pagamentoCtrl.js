import Pagamento from "../Modelo/pagamento.js";

export default class PagamentoCtrl {
    async gravar(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const pagamento= dados.pagamento;

            if (pagamento) {
                const novoPagamento = new Pagamento(0, pagamento);
                try {
                    await novoPagamento.gravar();
                    resposta.status(201).json({
                        status: true,
                        mensagem: "Forma de pagamento cadastrado com sucesso!",
                        id_pagamento: novoPagamento.id
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao registrar a forma de pagamento: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe a forma de pagamento!"
                });
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou forma de pagamento no formato JSON não fornecido!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type("application/json");
        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const id = dados.id;
            const pagamento = dados.pagamento;

            if (id && pagamento) {
                const pagamentoParaAtualizar = new Pagamento(id, pagamento);
                try {
                    await pagamentoParaAtualizar.atualizar();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "forma de pagamento atualizada com sucesso!"
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao atualizar a forma de pagamento: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o ID e a forma de pagamento!"
                });
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou dados no formato JSON não fornecidos!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method === "DELETE" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const id = dados.id;

            if (id) {
                const pagamentoParaExcluir = new Pagamento(id, "");
                try {
                    await pagamentoParaExcluir.excluir();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "forma de pagamento excluída com sucesso!"
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao excluir a forma de pagamento: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o ID da forma de pagamento a ser excluído!"
                });
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou ID no formato JSON não fornecido!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type("application/json");
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = "";
        }
        if (requisicao.method === "GET") {
            const pagamentoDAO = new Pagamento(0, ""); 
            try {
                const listaPagamentos = await pagamentoDAO.consultar(termo);
                resposta.json({
                    status: true,
                    listaPagamentos: listaPagamentos
                });
            }
            catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar tipos de análise: " + erro.message
                });
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido! Consulte utilizando GET."
            });
        }
    }
}

