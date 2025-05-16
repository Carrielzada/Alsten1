import Fabricante from "../Modelo/Fabricante.js";

export default class FabricanteCtrl {
    async gravar(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const nome_fabricante = dados.nome_fabricante;

            if (nome_fabricante) {
                const novoFabricante = new Fabricante(0, nome_fabricante);
                try {
                    await novoFabricante.gravar();
                    resposta.status(201).json({
                        status: true,
                        mensagem: "Fabricante cadastrado com sucesso!",
                        id_fabricante: novoFabricante.id
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao registrar o fabricante: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o nome do fabricante!"
                });
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou nome do fabricante no formato JSON não fornecido!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type("application/json");
        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const id = dados.id;
            const nome_fabricante = dados.nome_fabricante;

            if (id && nome_fabricante) {
                const fabricanteParaAtualizar = new Fabricante(id, nome_fabricante);
                try {
                    await fabricanteParaAtualizar.atualizar();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Fabricante atualizado com sucesso!"
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao atualizar o fabricante: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o ID e o nome do fabricante!"
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
                const fabricanteParaExcluir = new Fabricante(id, "");
                try {
                    await fabricanteParaExcluir.excluir();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Fabricante excluído com sucesso!"
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao excluir o fabricante: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o ID do fabricante a ser excluído!"
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
            const fabricanteDAO = new Fabricante(0, ""); 
            try {
                const listaFabricantes = await fabricanteDAO.consultar(termo);
                resposta.json({
                    status: true,
                    listaFabricantes: listaFabricantes
                });
            }
            catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar fabricantes: " + erro.message
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

