import TipoLacre from "../Model/TipoLacre.js";
import TipoLacreDAO from "../Service/TipoLacreDAO.js";

export default class TipoLacreCtrl {
    // Método para gravar um novo tipo de lacre
    async gravar(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const tipo_lacre = dados.tipo_lacre;

            if (tipo_lacre) {
                const novoTipoLacre = new TipoLacre(0, tipo_lacre);
                try {
                    await novoTipoLacre.gravar(); // Utiliza o método gravar da classe Modelo
                    resposta.status(201).json({
                        status: true,
                        mensagem: "Tipo de lacre cadastrado com sucesso!",
                        id_tipo_lacre: novoTipoLacre.id
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao registrar o tipo de lacre: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o tipo de lacre! (Ex: Alsten, Neutro)"
                });
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou tipo de lacre no formato JSON não fornecido!"
            });
        }
    }

    // Método para atualizar um tipo de lacre existente
    async atualizar(requisicao, resposta) {
        resposta.type("application/json");
        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const id = dados.id;
            const tipo_lacre = dados.tipo_lacre;

            if (id && tipo_lacre) {
                const tipoLacreParaAtualizar = new TipoLacre(id, tipo_lacre);
                try {
                    await tipoLacreParaAtualizar.atualizar(); // Utiliza o método atualizar da classe Modelo
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Tipo de lacre atualizado com sucesso!"
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao atualizar o tipo de lacre: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o ID e o tipo de lacre!"
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

    // Método para excluir um tipo de lacre
    async excluir(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method === "DELETE" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const id = dados.id;

            if (id) {
                const tipoLacreParaExcluir = new TipoLacre(id, ""); // O tipo não é necessário para exclusão, apenas o ID
                try {
                    await tipoLacreParaExcluir.excluir(); // Utiliza o método excluir da classe Modelo
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Tipo de lacre excluído com sucesso!"
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao excluir o tipo de lacre: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o ID do tipo de lacre a ser excluído!"
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

    // Método para consultar tipos de lacre
 async consultar(requisicao, resposta) {
        resposta.type("application/json");
        let termo = requisicao.params.termo;
        if (!termo) termo = "";

        if (requisicao.method === "GET") {
            const tipoLacreDAO = new TipoLacreDAO();  // instancia da DAO, não do modelo
            try {
                const listaTiposLacre = await tipoLacreDAO.consultar(termo);
                resposta.json({
                    status: true,
                    listaTiposLacre: listaTiposLacre
                });
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar tipos de lacre: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido! Consulte utilizando GET."
            });
        }
    }
}

