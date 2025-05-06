import Networking from '../Modelo/networking.js';

export default class NetworkingCtrl {
    async gravar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { nome, categoria, contato, email, data_nascimento, observacoes } = dados;

            if (nome && categoria && contato && email) { // Campos obrigatórios
                const networking = new Networking(null, nome, categoria, contato, email, data_nascimento, observacoes, null, null);
                try {
                    await networking.gravar();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Networking gravado com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe adequadamente todos os dados obrigatórios do networking conforme documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou networking no formato JSON não fornecido! Consulte a documentação da API."
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "PUT" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { id, nome, categoria, contato, email, data_nascimento, observacoes } = dados;

            if (id && nome && contato && email) { // Campos obrigatórios
                const networking = new Networking(id, nome, categoria, contato, email, data_nascimento, observacoes, null, null);
                try {
                    await networking.atualizar();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Networking atualizado com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe adequadamente todos os dados obrigatórios do networking conforme documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou networking no formato JSON não fornecido! Consulte a documentação da API."
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "DELETE") {
            const { id } = requisicao.params;

            if (id) {
                const networking = new Networking(id);
                try {
                    await networking.removerDoBancoDados();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Networking excluído com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "ID do networking não fornecido! Consulte a documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido! Utilize DELETE para excluir um networking."
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "GET") {
            const termo = requisicao.query.termo || "";
            const networking = new Networking();
            try {
                const resultados = await networking.consultar(termo);
                resposta.status(200).json({
                    status: true,
                    listaNetworking: resultados
                });
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido! Utilize GET para consultar networking."
            });
        }
    }

    async consultarPorId(requisicao, resposta) {
        resposta.type("application/json");

        const { id } = requisicao.params;

        if (requisicao.method === "GET" && id) {
            const networking = new Networking();
            try {
                const resultado = await networking.consultarPorId(id);
                if (resultado) {
                    resposta.status(200).json({
                        status: true,
                        networking: resultado
                    });
                } else {
                    resposta.status(404).json({
                        status: false,
                        mensagem: "Networking não encontrado!"
                    });
                }
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "ID do networking não fornecido ou método inválido! Utilize GET para consultar por ID."
            });
        }
    }
}
