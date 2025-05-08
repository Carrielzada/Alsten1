import { Button, Container, Row, Col } from "react-bootstrap";
import Pagina from "../Templates2/Pagina.jsx";
import FormCadNivelUrgencia from "./Formularios/FormCadNivelUrgencia.jsx";
import TabelaNivelUrgencia from "./Tabelas/TabelaNivelUrgencia.jsx";
import { useState, useEffect, useContext } from "react";
import { buscarTodosNiveisUrgencia } from "../../servicos/nivelUrgenciaService.js";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaPlus } from "react-icons/fa";

export default function TelaCadNivelUrgencia(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDeNiveisUrgencia, setListaDeNiveisUrgencia] = useState([]);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [nivelUrgenciaSelecionado, setNivelUrgenciaSelecionado] = useState({
        id: "",
        nome: "",
        descricao: ""
    });

    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosNiveisUrgencia(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaDeNiveisUrgencia(resposta.listaNiveis);
                }
                setAtualizarTela(false);
            })
            .catch((erro) => {
                alert("Erro ao buscar Níveis de Urgência: " + erro.message);
            });
    }, [exibirTabela, atualizarTela]);

    return (
        <Pagina>
            <div className="py-3 w-100 px-2">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col md={10}>
                            <h4>Gestão de Níveis de Urgência</h4>
                        </Col>
                        <Col md={2} className="text-end">
                            {exibirTabela && (
                                <Button
                                    className="w-90"
                                    variant="primary"
                                    onClick={() => {
                                        setExibirTabela(false);
                                        setModoEdicao(false);
                                        setNivelUrgenciaSelecionado({
                                            id: "",
                                            nome: "",
                                            descricao: ""
                                        });
                                    }}
                                    style={{ backgroundColor: "#191970", borderColor: "#191970" }}
                                >
                                    <FaPlus className="me-2" />
                                    Adicionar
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>

            {exibirTabela ? (
                <TabelaNivelUrgencia
                    listaDeNiveisUrgencia={listaDeNiveisUrgencia}
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    setModoEdicao={setModoEdicao}
                    setNivelUrgenciaSelecionado={setNivelUrgenciaSelecionado}
                />
            ) : (
                <FormCadNivelUrgencia
                    setExibirTabela={setExibirTabela}
                    setModoEdicao={setModoEdicao}
                    modoEdicao={modoEdicao}
                    nivelUrgenciaSelecionado={nivelUrgenciaSelecionado}
                    setNivelUrgenciaSelecionado={setNivelUrgenciaSelecionado}
                    setAtualizarTela={setAtualizarTela}
                />
            )}
        </Pagina>
    );
}
