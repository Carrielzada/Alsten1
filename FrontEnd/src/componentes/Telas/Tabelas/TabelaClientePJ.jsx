import React, { useContext } from "react";
import { Table } from "react-bootstrap";
import { ContextoUsuarioLogado } from "../../../App";
import { FaTrash, FaEdit } from "react-icons/fa";
import { excluirClientePJ } from "../../../servicos/clientePJService";
import './Tabelas.css';
export default function TabelaClientePJ(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    // Função para excluir um ClientePJ
    function handleExcluirClientePJ(clientePJ) {
        const token = contextoUsuario.usuarioLogado.token;
        if (window.confirm(`Deseja excluir o clientePJ de ${clientePJ.nome}?`)) {
            excluirClientePJ(clientePJ.cnpj, token)
                .then((resposta) => {
                    props.setAtualizarTela(true);
                    alert(resposta.mensagem);
                })
                .catch((erro) => {
                    alert("Erro ao enviar a requisição: " + erro.message);
                });
        }
    }

    function alterarClientePJ(clientePJ) {
        props.setClientePJSelecionado(clientePJ);
        props.setModoEdicao(true);
        props.setExibirTabela(false);
    }

    // Formatação dos campos
    const formatarCNPJ = (valor) => {
        return valor
            .replace(/\D/g, "") // Remove tudo que não é número
            .slice(0, 14)       // Limita a 14 dígitos
            .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"); // Aplica a máscara
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
        <div className="table-wrap"> {/* Envolva a tabela com um div */}
        <Table striped bordered hover responsive="sm" className="text-center align-middle small">
            <thead>
                <tr>
                    <th>CNPJ</th>
                    <th>Razão Social</th>
                    <th>Nome Fantasia</th>
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
                {props.listaDeClientePJ?.map((clientePJ) => (
                    <tr key={clientePJ.cnpj}>
                        <td>{formatarCNPJ(clientePJ.cnpj)}</td>
                        <td>{clientePJ.nome}</td>
                        <td>{clientePJ.nome_fantasia}</td>
                        <td>{formatarContato(clientePJ.contato)}</td>
                        <td>{clientePJ.endereco}</td>
                        <td>{clientePJ.cidade}</td>
                        <td>{clientePJ.bairro}</td>
                        <td>{clientePJ.estado}</td>
                        <td>{formatarCEP(clientePJ.cep)}</td>
                        <td>{new Date(clientePJ.criado_em).toLocaleDateString('pt-BR')}</td>
                        <td>
                            <div className="d-flex justify-content-center gap-3">
                                <FaEdit
                                    className="text-primary"
                                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                    onClick={() => alterarClientePJ(clientePJ)}
                                />
                                <FaTrash
                                    className="text-danger"
                                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                    onClick={() => handleExcluirClientePJ(clientePJ)}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
);
}