import ClientePJ from '../Model/clientePJ.js';
import ClientePJDAO from '../Service/ClientePJDAO.js';

export default class ClientePJCtrl {
    async gravar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const { cnpj, nome, nome_fantasia, contato, endereco, cidade, bairro, estado, cep } = requisicao.body;

            if (nome && cnpj) { // Campos obrigatórios
                const clientePJ = new ClientePJ( cnpj, nome, nome_fantasia, contato, endereco, cidade, bairro, estado, cep);

                try {
                    const clientePJDAO = new ClientePJDAO();
                    await clientePJDAO.incluir(clientePJ);
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Cliente Pessoa Jurídica gravado com sucesso!"
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
                    mensagem: "Informe adequadamente todos os dados obrigatórios para Pessoa Jurídica."
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou dados inválidos."
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type("application/json");

        const cnpj = requisicao.params.cnpj;
        const { nome, nome_fantasia, contato, endereco, cidade, bairro, estado, cep } = requisicao.body;

        if (cnpj && nome) { // Campos obrigatórios
            const clientePJ = new ClientePJ(cnpj, nome, nome_fantasia, contato, endereco, cidade, bairro, estado, cep);

            try {
                const clientePJDAO = new ClientePJDAO();
                await clientePJDAO.alterar(clientePJ);
                resposta.status(200).json({
                    status: true,
                    mensagem: "Cliente Pessoa Jurídica atualizado com sucesso!"
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
                mensagem: "Dados obrigatórios ausentes ou inválidos."
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type("application/json");
        const cnpj = requisicao.params.cnpj;

        if (cnpj) {
            try {
                const clientePJDAO = new ClientePJDAO();
                await clientePJDAO.excluir(cnpj);
                resposta.status(200).json({
                    status: true,
                    mensagem: "Cliente Pessoa Jurídica excluído com sucesso!"
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
                mensagem: "CNPJ do cliente não fornecido."
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type("application/json");

        const termo = requisicao.query.termo || "";
        try {
            const clientePJDAO = new ClientePJDAO();
            const clientes = await clientePJDAO.consultar(termo);
            resposta.status(200).json({
                status: true,
                listaClientes: clientes
            });
        } catch (erro) {
            resposta.status(500).json({
                status: false,
                mensagem: erro.message
            });
        }
    }

    async consultarPorCnpj(requisicao, resposta) {
        resposta.type("application/json");
        const cnpj = requisicao.params.cnpj;

        if (cnpj) {
            try {
                const clientePJDAO = new ClientePJDAO();
                const cliente = await clientePJDAO.consultarPorCnpj(cnpj);
                if (cliente) {
                    resposta.status(200).json({
                        status: true,
                        cliente
                    });
                } else {
                    resposta.status(404).json({
                        status: false,
                        mensagem: "Cliente não encontrado."
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
                mensagem: "CNPJ do cliente não fornecido."
            });
        }
    }
}
