import { Button, Container, Row, Col } from "react-bootstrap";
// import Pagina from "../Templates2/Pagina.jsx"; // Removido o layout antigo
import CardModerno from "../LayoutModerno/CardModerno"; // Importa o novo CardModerno
import { useState, useEffect, useContext } from "react";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaPlus } from "react-icons/fa";

// Mock da função buscarTodosModelos para MVP
const buscarTodosModelosMock = async (token) => {
    console.log("buscarTodosModelosMock chamado com token:", token);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ 
                status: true, 
                listaModelos: [
                    { id: 1, modelo: "Modelo Equip A (Mock)", criado_em: new Date().toISOString(), atualizado_em: new Date().toISOString() },
                    { id: 2, modelo: "Modelo Equip B (Mock)", criado_em: new Date().toISOString(), atualizado_em: new Date().toISOString() },
                ]
            });
        }, 300);
    });
};

// Componente de Formulário Mock para MVP (simples)
const FormCadastroModeloMock = ({ setExibirTabela, modoEdicao, modeloSelecionado, setAtualizarTela }) => {
    const [modeloInput, setModeloInput] = useState(modoEdicao ? modeloSelecionado.modelo : "");

    const handleSubmit = () => {
        console.log("Formulário de Modelo Enviado (Mock):", modeloInput, "Modo Edição:", modoEdicao, "Selecionado:", modeloSelecionado);
        alert(`Modelo ${modoEdicao ? 'atualizado' : 'cadastrado'} (Mock): ${modeloInput}`);
        setAtualizarTela(prevState => !prevState); // Alterna para disparar useEffect
        setExibirTabela(true);
    };

    return (
        <CardModerno titulo={modoEdicao ? "Editar Modelo de Equipamento" : "Adicionar Novo Modelo de Equipamento"}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="mb-3">
                    <label htmlFor="modeloInput" className="form-label">Nome do Modelo</label>
                    <input 
                        type="text" 
                        id="modeloInput"
                        value={modeloInput} 
                        onChange={(e) => setModeloInput(e.target.value)} 
                        placeholder="Digite o nome do modelo"
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

// Componente de Tabela Mock para MVP (simples)
const TabelaModelosEquipamentosMock = ({ listaDeModelos, setExibirTabela, setModoEdicao, setModeloSelecionado }) => {
    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Modelo</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {listaDeModelos.length === 0 ? (
                    <tr><td colSpan="3">Nenhum modelo cadastrado.</td></tr>
                ) : (
                    listaDeModelos.map(modelo => (
                        <tr key={modelo.id}>
                            <td>{modelo.id}</td>
                            <td>{modelo.modelo}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => {
                                    setModeloSelecionado(modelo);
                                    setModoEdicao(true);
                                    setExibirTabela(false);
                                }}>Editar</Button>
                                <Button variant="danger" size="sm" onClick={() => {
                                     alert(`Excluir modelo ${modelo.id} (Mock)`);
                                     // Aqui viria a lógica de exclusão e atualização da lista
                                     }}>Excluir</Button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default function TelaCadastroModelo(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDeModelos, setListaDeModelos] = useState([]);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [modeloSelecionado, setModeloSelecionado] = useState({
        id: null,
        modelo: "",
        criado_em: "",
        atualizado_em: ""
    });

    useEffect(() => {
        if (!contextoUsuario || !contextoUsuario.usuarioLogado) return;
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosModelosMock(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaDeModelos(resposta.listaModelos);
                }
            })
            .catch((erro) => {
                alert("Erro ao buscar Modelos (Mock): " + erro.message);
            })
            .finally(() => {
                setAtualizarTela(false); // Garante que para de atualizar após a busca
            });
    }, [exibirTabela, atualizarTela, contextoUsuario]);

    return (
        // Removido o <Pagina>, o LayoutModerno já está no App.js envolvendo as rotas
        <Container fluid className="pt-3 pb-3">
            <CardModerno titulo="Gestão de Modelos de Equipamentos">
                {exibirTabela ? (
                    <>
                        <div className="d-flex justify-content-end mb-3">
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setExibirTabela(false);
                                    setModoEdicao(false);
                                    setModeloSelecionado({ id: null, modelo: "", criado_em: "", atualizado_em: "" });
                                }}
                            >
                                <FaPlus className="me-2" />
                                Adicionar Novo Modelo
                            </Button>
                        </div>
                        <TabelaModelosEquipamentosMock
                            listaDeModelos={listaDeModelos}
                            setExibirTabela={setExibirTabela}
                            setModoEdicao={setModoEdicao}
                            setModeloSelecionado={setModeloSelecionado}
                        />
                    </>
                ) : (
                    <FormCadastroModeloMock
                        setExibirTabela={setExibirTabela}
                        modoEdicao={modoEdicao}
                        modeloSelecionado={modeloSelecionado}
                        setAtualizarTela={setAtualizarTela} // Passa setAtualizarTela
                    />
                )}
            </CardModerno>
        </Container>
    );
}

