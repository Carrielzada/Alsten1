import TipoTransporte from "../Model/TipoTransporte.js";

export default class TipoTransporteCtrl {
    async gravar(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const tipo_transporte = dados.tipo_transporte;

            if (tipo_transporte) {
                const novoTipoTransporte = new TipoTransporte(0, tipo_transporte);
                try {
                    await novoTipoTransporte.gravar();
                    resposta.status(201).json({
                        status: true,
                        mensagem: "Tipo de análise cadastrado com sucesso!",
                        id_tipo_transporte: novoTipoTransporte.id
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
            const tipo_transporte = dados.tipo_transporte;

            if (id && tipo_transporte) {
                const tipoLimpezaParaAtualizar = new TipoTransporte(id, tipo_transporte);
                try {
                    await tipoLimpezaParaAtualizar.atualizar();
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
                const tipoTransporteParaExcluir = new TipoTransporte(id, "");
                try {
                    await tipoTransporteParaExcluir.excluir();
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
            const tipoTransporteDAO = new TipoTransporte(0, ""); 
            try {
                const listaTiposTransporte = await tipoTransporteDAO.consultar(termo);
                resposta.json({
                    status: true,
                    listaTiposTransporte: listaTiposTransporte
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

