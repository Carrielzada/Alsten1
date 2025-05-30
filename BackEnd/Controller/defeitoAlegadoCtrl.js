import DefeitoAlegado from "../Model/DefeitoAlegado.js";

export default class DefeitoAlegadoCtrl {
    async gravar(requisicao, resposta) {
        resposta.type("application/json");
        if (requisicao.method === "POST" && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const titulo = dados.titulo; // Adicionado
            const defeito = dados.defeito;

            if (titulo && defeito) { // Adicionada verificação de título
                const novoDefeitoAlegado = new DefeitoAlegado(0, titulo, defeito); // Adicionado título
                try {
                    await novoDefeitoAlegado.gravar();
                    resposta.status(201).json({
                        status: true,
                        mensagem: "Defeito alegado cadastrado com sucesso!",
                        id_defeito_alegado: novoDefeitoAlegado.id
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao registrar o defeito alegado: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o título e a descrição do defeito alegado!" // Mensagem atualizada
                });
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou descrição do defeito alegado no formato JSON não fornecida!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type("application/json");
        if ((requisicao.method === "PUT" || requisicao.method === "PATCH") && requisicao.is("application/json")) {
            const dados = requisicao.body;
            const id = dados.id;
            const titulo = dados.titulo; // Adicionado
            const defeito = dados.defeito;

            if (id && titulo && defeito) { // Adicionada verificação de título
                const defeitoAlegadoParaAtualizar = new DefeitoAlegado(id, titulo, defeito); // Adicionado título
                try {
                    await defeitoAlegadoParaAtualizar.atualizar();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Defeito alegado atualizado com sucesso!"
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao atualizar o defeito alegado: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o ID, o título e a descrição do defeito alegado!" // Mensagem atualizada
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
                const defeitoAlegadoParaExcluir = new DefeitoAlegado(id, "");
                try {
                    await defeitoAlegadoParaExcluir.excluir();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Defeito alegado excluído com sucesso!"
                    });
                }
                catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao excluir o defeito alegado: " + erro.message
                    });
                }
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o ID do defeito alegado a ser excluído!"
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
            const defeitoAlegadoDAO = new DefeitoAlegado(0, ""); 
            try {
                const listaDefeitosAlegados = await defeitoAlegadoDAO.consultar(termo);
                resposta.json({
                    status: true,
                    listaDefeitosAlegados: listaDefeitosAlegados
                });
            }
            catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar defeitos alegados: " + erro.message
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

