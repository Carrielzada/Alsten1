import React, { useContext } from "react";
import { Container, Table } from "react-bootstrap";
import { ContextoUsuarioLogado } from "../../../App";
import { FaTrash, FaEdit } from "react-icons/fa";
import { excluirClientePF } from "../../../servicos/clientePFService";

export default function TabelaClientePF(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    // Função para excluir um ClientePF
    function handleExcluirClientePF(clientePF) {
            const token = contextoUsuario.usuarioLogado.token;
            if (window.confirm(`Deseja excluir o clientePF de ${clientePF.nome}?`)) {
                excluirClientePF(clientePF.cpf, token)
                .then((resposta) => {
                    props.setAtualizarTela(true); 
                    alert(resposta.mensagem);
                }).catch((erro) => {
                    alert("Erro ao enviar a requisição: " + erro.message);
                });
            }
        }

        function alterarClientePF(clientePF) {
            props.setClientePFSelecionado(clientePF);
            props.setModoEdicao(true);
            props.setExibirTabela(false);
        }

    // Formatação dos campos
    const formatarCPF = (valor) => {
        return valor
            .replace(/\D/g, "") // Remove tudo que não é número
            .slice(0, 11)       // Limita a 11 dígitos
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); // Aplica a máscara
    };

    const formatarContato = (valor) => {
        return valor
            .replace(/\D/g, "") // Remove tudo que não é número
            .slice(0, 11)       // Limita a 11 dígitos
            .replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"); // Aplica a máscara
    };

    const formatarCEP = (valor) => {
        return valor
            .replace(/\D/g, "") // Remove tudo que não é número
            .slice(0, 8)        // Limita a 8 dígitos
            .replace(/^(\d{5})(\d{3})/, "$1-$2"); // Aplica a máscara
    };

    return (
        <Container fluid className="px-2">
            <Table striped bordered hover responsive className="text-center align-middle small">
                <thead>
                    <tr>
                        <th>CPF</th>
                        <th>Nome</th>
                        <th className="text-nowrap">Data de Nascimento</th>
                        <th>Contato</th>
                        <th>Endereço</th>
                        <th>Cidade</th>
                        <th>Bairro</th>
                        <th>Estado</th>
                        <th>CEP</th>
                        <th>Criado em</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {props.listaDeClientePF?.map((clientePF) => (
                        <tr key={clientePF.cpf}>
                            <td className="text-nowrap">{formatarCPF(clientePF.cpf)}</td>
                            <td className="text-nowrap">{clientePF.nome}</td>
                            <td>
                                {new Date(clientePF.data_nascimento).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="text-nowrap">{formatarContato(clientePF.contato)}</td>
                            <td className="text-nowrap">{clientePF.endereco}</td>
                            <td className="text-nowrap">{clientePF.cidade}</td>
                            <td>{clientePF.bairro}</td>
                            <td>{clientePF.estado}</td>
                            <td className="text-nowrap">{formatarCEP(clientePF.cep)}</td>
                            <td className="text-nowrap">
                                {new Date(clientePF.criado_em).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="text-nowrap align-top">
                                <div className="d-flex justify-content-center gap-3">
                                    {/* Botão de Editar */}
                                    <FaEdit 
                                        className="text-primary" 
                                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                        onClick={() => {
                                            alterarClientePF(clientePF);
                                        }}
                                    />

                                    {/* Botão de Excluir */}
                                    <FaTrash
                                        className="text-danger"
                                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                        onClick={() => handleExcluirClientePF(clientePF)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
