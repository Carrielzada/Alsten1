import TipoAnalise from "../Modelo/TipoAnalise.js";

export default class TipoAnaliseCtrl {
    async gravar(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const tipo_analise = dados.tipo_analise;

            if (tipo_analise) {
                const novoTipoAnalise = new TipoAnalise(0, tipo_analise);
                try {
                    await novoTipoAnalise.gravar();
                    resposta.status(201).json({
                        status: true,
                        mensagem: "Tipo de análise cadastrado com sucesso!",
                        id_tipo_analise: novoTipoAnalise.id
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao registrar o tipo de análise: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o tipo de análise!"
                });
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou tipo de análise no formato JSON não fornecido!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type("application/json");
        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const id = dados.id;
            const tipo_analise = dados.tipo_analise;

            if (id && tipo_analise) {
                const tipoAnaliseParaAtualizar = new TipoAnalise(id, tipo_analise);
                try {
                    await tipoAnaliseParaAtualizar.atualizar();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Tipo de análise atualizado com sucesso!"
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao atualizar o tipo de análise: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o ID e o tipo de análise!"
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
                const tipoAnaliseParaExcluir = new TipoAnalise(id, "");
                try {
                    await tipoAnaliseParaExcluir.excluir();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Tipo de análise excluído com sucesso!"
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao excluir o tipo de análise: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o ID do tipo de análise a ser excluído!"
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
            const tipoAnaliseDAO = new TipoAnalise(0, ""); 
            try {
                const listaTiposAnalise = await tipoAnaliseDAO.consultar(termo);
                resposta.json({
                    status: true,
                    listaTiposAnalise: listaTiposAnalise
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

