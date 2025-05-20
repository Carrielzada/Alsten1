import { Button, Container, Row, Col } from "react-bootstrap";
import Pagina from "../Templates2/Pagina.jsx";
import FormCadTipoAnalise from "./Formularios/FormCadTipoAnalise.jsx";
import TabelaTipoAnalise from "./Tabelas/TabelaTipoAnalise.jsx";
import { useState, useEffect, useContext } from "react";
import { buscarTodosTiposAnalise } from "../../Services/tipoAnaliseService.js";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaPlus } from "react-icons/fa";

export default function TelaCadTipoAnalise(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDeTiposAnalise, setListaDeTiposAnalise] = useState([]);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [tipoAnaliseSelecionado, setTipoAnaliseSelecionado] = useState({
        id: "",
        tipo: ""  // Apenas orçamento, consertar e orçar, consertar, orçar e finalizar
    });

    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosTiposAnalise(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaDeTiposAnalise(resposta.listaTiposAnalise);
                }
                setAtualizarTela(false);
            })
            .catch((erro) => {
                alert("Erro ao buscar Tipos de Análise: " + erro.message);
            });
    }, [exibirTabela, atualizarTela]);

    return (
        <Pagina>
            <div className="py-3 w-100 px-2">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col md={10}>
                            <h4>Gestão de Tipos de Análise</h4>
                        </Col>
                        <Col md={2} className="text-end">
                            {exibirTabela && (
                                <Button
                                    className="w-90"
                                    variant="primary"
                                    onClick={() => {
                                        setExibirTabela(false);
                                        setModoEdicao(false);
                                        setTipoAnaliseSelecionado({
                                            id: "",
                                            tipo: ""
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
                <TabelaTipoAnalise
                    listaDeTiposAnalise={listaDeTiposAnalise}
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    setModoEdicao={setModoEdicao}
                    setTipoAnaliseSelecionado={setTipoAnaliseSelecionado}
                />
            ) : (
                <FormCadTipoAnalise
                    setExibirTabela={setExibirTabela}
                    setModoEdicao={setModoEdicao}
                    modoEdicao={modoEdicao}
                    tipoAnaliseSelecionado={tipoAnaliseSelecionado}
                    setTipoAnaliseSelecionado={setTipoAnaliseSelecionado}
                    setAtualizarTela={setAtualizarTela}
                />
            )}
        </Pagina>
    );
}
