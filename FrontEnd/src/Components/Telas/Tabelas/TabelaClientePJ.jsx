import { Button, Container, Table, Spinner, Alert } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { excluirClientePJ } from "../../../Services/clientePJService";

export default function TabelaClientePJ({
    listaDeClientePJ,
    setExibirTabela,
    setAtualizarTela,
    setModoEdicao,
    setClientePJSelecionado,
}) {
    // Função para lidar com a exclusão de um cliente
    const handleExcluir = (cliente) => {
        if (window.confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
            // A função de serviço agora só precisa do ID
            excluirClientePJ(cliente.id)
                .then(() => {
                    alert("Cliente excluído com sucesso!");
                    // Força a atualização da lista na tela principal
                    setAtualizarTela(true); 
                })
                .catch((erro) => {
                    alert("Erro ao excluir cliente: " + erro.message);
                });
        }
    };

    // Função para lidar com a edição de um cliente
    const handleEditar = (cliente) => {
        // Define o cliente que será editado no estado da tela principal
        setClientePJSelecionado(cliente);
        // Ativa o modo de edição
        setModoEdicao(true);
        // Mostra o formulário
        setExibirTabela(false);
    };

    if (!listaDeClientePJ) {
        return <Spinner animation="border" role="status"><span className="visually-hidden">Carregando...</span></Spinner>;
    }

    if (listaDeClientePJ.length === 0) {
        return <Alert variant="info">Nenhum cliente cadastrado.</Alert>;
    }

    return (
        <Container className="mt-3">
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>CNPJ</th>
                        <th>Razão Social</th>
                        <th>Nome Fantasia</th>
                        <th>Contato</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {listaDeClientePJ.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.cnpj}</td>
                            <td>{cliente.nome}</td>
                            <td>{cliente.nome_fantasia}</td>
                            <td>{cliente.contato}</td>
                            <td className="text-center">
                                <Button variant="warning" className="me-2" onClick={() => handleEditar(cliente)}>
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" onClick={() => handleExcluir(cliente)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}