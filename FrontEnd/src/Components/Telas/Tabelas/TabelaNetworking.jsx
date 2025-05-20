import { Container, Table } from "react-bootstrap";
import { useContext } from "react";
import { ContextoUsuarioLogado } from "../../../App";
import { excluirNetworking } from "../../../Services/networkingService"; 
import { FaTrash, FaEdit } from "react-icons/fa";

export default function TabelaNetworking(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    function handleExcluirNetworking(networking) {
        const token = contextoUsuario.usuarioLogado.token;
        if (window.confirm(`Deseja excluir o networking de ${networking.nome}?`)) {
            excluirNetworking(networking.id, token)
            .then((resposta) => {
                props.setAtualizarTela(true); 
                alert(resposta.mensagem);
            }).catch((erro) => {
                alert("Erro ao enviar a requisição: " + erro.message);
            });
        }
    }
    function alterarNetworking(networking) {
        props.setNetworkingSelecionado(networking);
        props.setModoEdicao(true);
        props.setExibirTabela(false);
    }

    return (
        <Container fluid className="px-2">
            <Table striped bordered hover responsive className="text-center align-middle small">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Contato</th>
                        <th>E-mail</th>
                        <th className="text-nowrap">Data de Nascimento</th>
                        <th>Observações</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {props.listaDeNetworking?.map((networking) => (
                        <tr key={networking.id}>
                            <td className="text-nowrap align-top">{networking.nome}</td>
                            <td className="align-top">{networking.categoria}</td>
                            <td className="text-nowrap align-top">{networking.contato}</td>
                            <td className="align-top">{networking.email}</td>
                            <td className="align-top">{new Date(networking.data_nascimento).toLocaleDateString('pt-BR')}</td>
                            <td className="align-top">{networking.observacoes}</td>
                            <td className="text-nowrap align-top">
                                <div className="d-flex justify-content-center gap-3">
                                    <FaEdit 
                                        className="text-primary" 
                                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                        onClick={() => {
                                            alterarNetworking(networking);
                                        }}
                                    />
                                    <FaTrash 
                                        className="text-danger" 
                                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                        onClick={() => handleExcluirNetworking(networking)}
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
