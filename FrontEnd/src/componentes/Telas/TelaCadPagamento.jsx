import { Button, Container, Row, Col } from "react-bootstrap";
// import Pagina from "../Templates2/Pagina.jsx"; // Removido o layout antigo
import CardModerno from "../LayoutModerno/CardModerno"; // Importa o novo CardModerno
import { useState, useEffect, useContext } from "react";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaPlus } from "react-icons/fa";

// Mock da função buscarTodosPagamentos para MVP
const buscarTodosPagamentosMock = async (token) => {
    console.log("buscarTodosPagamentosMock chamado com token:", token);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ 
                status: true, 
                listaPagamentos: [
                    { id: 1, pagamento: "Débito (Mock)", criado_em: new Date().toISOString(), atualizado_em: new Date().toISOString() },
                    { id: 2, pagamento: "Crédito (Mock)", criado_em: new Date().toISOString(), atualizado_em: new Date().toISOString() },
                    { id: 3, pagamento: "PIX (Mock)", criado_em: new Date().toISOString(), atualizado_em: new Date().toISOString() },
                ]
            });
        }, 300);
    });
};

// Componente de Formulário Mock para Pagamento (simples)
const FormCadPagamentoMock = ({ setExibirTabela, modoEdicao, pagamentoSelecionado, setAtualizarTela }) => {
    const [pagamentoInput, setPagamentoInput] = useState(modoEdicao ? pagamentoSelecionado.pagamento : "");

    const handleSubmit = () => {
        console.log("Formulário de Pagamento Enviado (Mock):", pagamentoInput, "Modo Edição:", modoEdicao, "Selecionado:", pagamentoSelecionado);
        alert(`Forma de Pagamento ${modoEdicao ? 'atualizada' : 'cadastrada'} (Mock): ${pagamentoInput}`);
        setAtualizarTela(prevState => !prevState); // Alterna para disparar useEffect
        setExibirTabela(true);
    };

    return (
        <CardModerno titulo={modoEdicao ? "Editar Forma de Pagamento" : "Adicionar Nova Forma de Pagamento"}>
             <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="mb-3">
                    <label htmlFor="pagamentoInput" className="form-label">Nome da Forma de Pagamento</label>
                    <input 
                        type="text" 
                        id="pagamentoInput"
                        value={pagamentoInput} 
                        onChange={(e) => setPagamentoInput(e.target.value)} 
                        placeholder="Digite a forma de pagamento"
                        className="form-control"
                        required
                    />
                </div>
                <Button type="submit" variant="primary" className="me-2">Salvar</Button>
                <Button onClick={() => setExibirTabela(true)} variant="secondary">Cancelar</Button>
            </form>
        </CardModerno>
    );
};

// Componente de Tabela Mock para Pagamento (simples)
const TabelaPagamentosMock = ({ listaDePagamentos, setExibirTabela, setModoEdicao, setPagamentoSelecionado }) => {
    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Forma de Pagamento</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {listaDePagamentos.length === 0 ? (
                    <tr><td colSpan="3">Nenhuma forma de pagamento cadastrada.</td></tr>
                ) : (
                    listaDePagamentos.map(pagamento => (
                        <tr key={pagamento.id}>
                            <td>{pagamento.id}</td>
                            <td>{pagamento.pagamento}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => {
                                    setPagamentoSelecionado(pagamento);
                                    setModoEdicao(true);
                                    setExibirTabela(false);
                                }}>Editar</Button>
                                <Button variant="danger" size="sm" onClick={() => {
                                    alert(`Excluir forma de pagamento ${pagamento.id} (Mock)`);
                                    // Aqui viria a lógica de exclusão e atualização da lista
                                    }} >Excluir</Button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default function TelaCadPagamento(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDePagamentos, setListaDePagamentos] = useState([]);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [pagamentoSelecionado, setPagamentoSelecionado] = useState({
        id: null,
        pagamento: "",
        criado_em: "",
        atualizado_em: ""
    });

    useEffect(() => {
        if (!contextoUsuario || !contextoUsuario.usuarioLogado) return;
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosPagamentosMock(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaDePagamentos(resposta.listaPagamentos);
                }
            })
            .catch((erro) => {
                alert("Erro ao buscar Formas de Pagamento (Mock): " + erro.message);
            })
            .finally(() => {
                setAtualizarTela(false); // Garante que para de atualizar após a busca
            });
    }, [exibirTabela, atualizarTela, contextoUsuario]);

    return (
        // Removido o <Pagina>, o LayoutModerno já está no App.js envolvendo as rotas
        <Container fluid className="pt-3 pb-3">
            <CardModerno titulo="Gestão de Formas de Pagamento">
                {exibirTabela ? (
                    <>
                        <div className="d-flex justify-content-end mb-3">
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setExibirTabela(false);
                                    setModoEdicao(false);
                                    setPagamentoSelecionado({ id: null, pagamento: "", criado_em: "", atualizado_em: "" });
                                }}
                            >
                                <FaPlus className="me-2" />
                                Adicionar Nova Forma
                            </Button>
                        </div>
                        <TabelaPagamentosMock
                            listaDePagamentos={listaDePagamentos}
                            setExibirTabela={setExibirTabela}
                            setModoEdicao={setModoEdicao}
                            setPagamentoSelecionado={setPagamentoSelecionado}
                        />
                    </>
                ) : (
                    <FormCadPagamentoMock
                        setExibirTabela={setExibirTabela}
                        modoEdicao={modoEdicao}
                        pagamentoSelecionado={pagamentoSelecionado}
                        setAtualizarTela={setAtualizarTela} // Passa setAtualizarTela
                    />
                )}
            </CardModerno>
        </Container>
    );
}

