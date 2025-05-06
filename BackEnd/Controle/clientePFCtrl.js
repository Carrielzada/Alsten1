import ClientePF from '../Modelo/clientePF.js';
import ClientePFDAO from '../Persistencia/ClientePFDAO.js';


export default class ClientePFCtrl {

    gravar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { cpf, nome, data_nascimento, contato, endereco, cidade, bairro, estado, cep } = dados;

            if (cpf && nome && data_nascimento) { // Campos obrigatórios
                const clientePF = new ClientePF(cpf, nome, data_nascimento, contato, endereco, cidade, bairro, estado, cep);
                clientePF.gravar().then(() => {
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Cliente Pessoa Física gravado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe adequadamente todos os dados obrigatórios do cliente conforme documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou cliente no formato JSON não fornecido! Consulte a documentação da API."
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "PUT" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { cpf, nome, data_nascimento, contato, endereco, cidade, bairro, estado, cep } = dados;

            if (cpf && nome && data_nascimento) { // Campos obrigatórios
                const clientePF = new ClientePF(cpf, nome, data_nascimento, contato, endereco, cidade, bairro, estado, cep);
                clientePF.atualizar().then(() => {
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Cliente Pessoa Física atualizado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe adequadamente todos os dados obrigatórios do cliente conforme documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou cliente no formato JSON não fornecido! Consulte a documentação da API."
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type("application/json");
    
        const cpf = requisicao.params.cpf; // Pegando o CPF da URL
        
        if (cpf) {
            const clientePF = new ClientePF(cpf);
            clientePF.removerDoBancoDados(cpf).then(() => {
                resposta.status(200).json({
                    status: true,
                    mensagem: "Cliente Pessoa Física excluído com sucesso!"
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message
                });
            });
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "CPF não fornecido! Verifique a documentação da API."
            });
        }
    }
    
    

    consultar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "GET") {
            const termo = requisicao.query.termo || "";
            const clientePF = new ClientePF();
            clientePF.consultar(termo).then((clientes) => {
                resposta.status(200).json({
                    status: true,
                    listaClientes: clientes
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message
                });
            });
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido! Consulte a documentação da API."
            });
        }
    }

    consultarPeloCPF(requisicao, resposta) {
        resposta.type("application/json");

        const { cpf } = requisicao.params;

        if (requisicao.method === "GET") {
            const clientePF = new ClientePF();
            clientePF.consultarPorId(cpf).then((cliente) => {
                if (cliente) {
                    resposta.status(200).json({
                        status: true,
                        cliente: cliente
                    });
                } else {
                    resposta.status(404).json({
                        status: false,
                        mensagem: "Cliente não encontrado."
                    });
                }
            }).catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message
                });
            });
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido! Consulte a documentação da API."
            });
        }
    }
}
