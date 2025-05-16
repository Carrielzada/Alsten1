import { Button, Container, Row, Col } from "react-bootstrap";
// import Pagina from "../Templates2/Pagina.jsx"; // Removido o layout antigo
import CardModerno from "../LayoutModerno/CardModerno"; // Importa o novo CardModerno
import { useState, useEffect, useContext } from "react";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaPlus } from "react-icons/fa";

// Mock da função buscarTodosNiveisUrgencia para MVP
const buscarTodosNiveisUrgenciaMock = async (token) => {
    console.log("buscarTodosNiveisUrgenciaMock chamado com token:", token);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ 
                status: true, 
                listaNiveis: [
                    { id: 1, nome: "Não Urgente (Mock)", descricao: "Pode aguardar" },
                    { id: 2, nome: "Pouco Urgente (Mock)", descricao: "Resolver em breve" },
                    { id: 3, nome: "Urgente (Mock)", descricao: "Resolver agora" },
                ]
            });
        }, 300);
    });
};

// Componente de Formulário Mock para Nível de Urgência (simples)
const FormCadNivelUrgenciaMock = ({ setExibirTabela, modoEdicao, nivelUrgenciaSelecionado, setAtualizarTela }) => {
    const [nomeInput, setNomeInput] = useState(modoEdicao ? nivelUrgenciaSelecionado.nome : "");
    const [descricaoInput, setDescricaoInput] = useState(modoEdicao ? nivelUrgenciaSelecionado.descricao : "");

    const handleSubmit = () => {
        console.log("Formulário de Nível de Urgência Enviado (Mock):", { nome: nomeInput, descricao: descricaoInput }, "Modo Edição:", modoEdicao, "Selecionado:", nivelUrgenciaSelecionado);
        alert(`Nível de Urgência ${modoEdicao ? 'atualizado' : 'cadastrado'} (Mock): ${nomeInput}`);
        setAtualizarTela(prevState => !prevState); // Alterna para disparar useEffect
        setExibirTabela(true);
    };

    return (
        <CardModerno titulo={modoEdicao ? "Editar Nível de Urgência" : "Adicionar Novo Nível de Urgência"}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="mb-3">
                    <label htmlFor="nomeUrgenciaInput" className="form-label">Nome do Nível de Urgência</label>
                    <input 
                        type="text" 
                        id="nomeUrgenciaInput"
                        value={nomeInput} 
                        onChange={(e) => setNomeInput(e.target.value)} 
                        placeholder="Digite o nome do nível de urgência"
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="descricaoUrgenciaInput" className="form-label">Descrição (Opcional)</label>
                    <textarea 
                        id="descricaoUrgenciaInput"
                        value={descricaoInput} 
                        onChange={(e) => setDescricaoInput(e.target.value)} 
                        placeholder="Descreva o nível de urgência"
                        className="form-control"
                        rows="3"
                    />
                </div>
                <Button type="submit" variant="primary" className="me-2">Salvar</Button>
                <Button onClick={() => setExibirTabela(true)} variant="secondary">Cancelar</Button>
            </form>
        </CardModerno>
    );
};

// Componente de Tabela Mock para Nível de Urgência (simples)
const TabelaNivelUrgenciaMock = ({ listaDeNiveisUrgencia, setExibirTabela, setModoEdicao, setNivelUrgenciaSelecionado }) => {
    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {listaDeNiveisUrgencia.length === 0 ? (
                    <tr><td colSpan="4">Nenhum nível de urgência cadastrado.</td></tr>
                ) : (
                    listaDeNiveisUrgencia.map(nivel => (
                        <tr key={nivel.id}>
                            <td>{nivel.id}</td>
                            <td>{nivel.nome}</td>
                            <td>{nivel.descricao}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => {
                                    setNivelUrgenciaSelecionado(nivel);
                                    setModoEdicao(true);
                                    setExibirTabela(false);
                                }}>Editar</Button>
                                <Button variant="danger" size="sm" onClick={() => {
                                    alert(`Excluir nível de urgência ${nivel.id} (Mock)`);
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

export default function TelaCadNivelUrgencia(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDeNiveisUrgencia, setListaDeNiveisUrgencia] = useState([]);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [nivelUrgenciaSelecionado, setNivelUrgenciaSelecionado] = useState({
        id: null,
        nome: "",
        descricao: ""
    });

    useEffect(() => {
        if (!contextoUsuario || !contextoUsuario.usuarioLogado) return;
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosNiveisUrgenciaMock(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaDeNiveisUrgencia(resposta.listaNiveis);
                }
            })
            .catch((erro) => {
                alert("Erro ao buscar Níveis de Urgência (Mock): " + erro.message);
            })
            .finally(() => {
                setAtualizarTela(false); // Garante que para de atualizar após a busca
            });
    }, [exibirTabela, atualizarTela, contextoUsuario]);

    return (
        // Removido o <Pagina>, o LayoutModerno já está no App.js envolvendo as rotas
        <Container fluid className="pt-3 pb-3">
            <CardModerno titulo="Gestão de Níveis de Urgência">
                {exibirTabela ? (
                    <>
                        <div className="d-flex justify-content-end mb-3">
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setExibirTabela(false);
                                    setModoEdicao(false);
                                    setNivelUrgenciaSelecionado({ id: null, nome: "", descricao: "" });
                                }}
                            >
                                <FaPlus className="me-2" />
                                Adicionar Novo Nível
                            </Button>
                        </div>
                        <TabelaNivelUrgenciaMock
                            listaDeNiveisUrgencia={listaDeNiveisUrgencia}
                            setExibirTabela={setExibirTabela}
                            setModoEdicao={setModoEdicao}
                            setNivelUrgenciaSelecionado={setNivelUrgenciaSelecionado}
                        />
                    </>
                ) : (
                    <FormCadNivelUrgenciaMock
                        setExibirTabela={setExibirTabela}
                        modoEdicao={modoEdicao}
                        nivelUrgenciaSelecionado={nivelUrgenciaSelecionado}
                        setAtualizarTela={setAtualizarTela} // Passa setAtualizarTela
                    />
                )}
            </CardModerno>
        </Container>
    );
}

