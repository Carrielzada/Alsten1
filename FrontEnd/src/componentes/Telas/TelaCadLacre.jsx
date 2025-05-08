import { Button, Container, Row, Col } from "react-bootstrap";
import Pagina from "../Templates2/Pagina.jsx";
import FormCadTipoLacre from "./Formularios/FormCadTipoLacre.jsx";
import TabelaTipoLacre from "./Tabelas/TabelaTipoLacre.jsx";
import { useState, useEffect, useContext } from "react";
import { buscarTodosTiposLacre } from "../../servicos/tipoLacreService.js";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaPlus } from "react-icons/fa";

export default function TelaCadTipoLacre(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDeTiposLacre, setListaDeTiposLacre] = useState([]);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [tipoLacreSelecionado, setTipoLacreSelecionado] = useState({
        id: "",
        tipo: ""  // Alsten ou Neutro
    });

    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosTiposLacre(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaDeTiposLacre(resposta.listaTiposLacre);
                }
                setAtualizarTela(false);
            })
            .catch((erro) => {
                alert("Erro ao buscar Tipos de Lacre: " + erro.message);
            });
    }, [exibirTabela, atualizarTela]);

    return (
        <Pagina>
            <div className="py-3 w-100 px-2">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col md={10}>
                            <h4>Gestão de Tipos de Lacre</h4>
                        </Col>
                        <Col md={2} className="text-end">
                            {exibirTabela && (
                                <Button
                                    className="w-90"
                                    variant="primary"
                                    onClick={() => {
                                        setExibirTabela(false);
                                        setModoEdicao(false);
                                        setTipoLacreSelecionado({
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
                <TabelaTipoLacre
                    listaDeTiposLacre={listaDeTiposLacre}
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    setModoEdicao={setModoEdicao}
                    setTipoLacreSelecionado={setTipoLacreSelecionado}
                />
            ) : (
                <FormCadTipoLacre
                    setExibirTabela={setExibirTabela}
                    setModoEdicao={setModoEdicao}
                    modoEdicao={modoEdicao}
                    tipoLacreSelecionado={tipoLacreSelecionado}
                    setTipoLacreSelecionado={setTipoLacreSelecionado}
                    setAtualizarTela={setAtualizarTela}
                />
            )}
        </Pagina>
    );
}
