import { Button, Container, Row, Col } from "react-bootstrap";
import Pagina from "../Templates2/Pagina.jsx";
import FormCadastroFabricante from "./Formularios/FormCadastroFabricante.jsx";
import TabelaFabricantes from "./Tabelas/TabelaFabricantes.jsx";
import { useState, useEffect, useContext } from "react";
import { buscarTodosFabricantes } from "../../Services/fabricanteService.js";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaPlus } from "react-icons/fa";

export default function TelaCadastroFabricante(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDeFabricantes, setListaDeFabricantes] = useState([]);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [fabricanteSelecionado, setFabricanteSelecionado] = useState({
        fabricante: "",
        numeroSerie: "",
        criado_em: "",
        atualizado_em: ""
    });

    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosFabricantes(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaDeFabricantes(resposta.listaFabricantes);
                }
                setAtualizarTela(false);
            })
            .catch((erro) => {
                alert("Erro ao buscar Fabricantes: " + erro.message);
            });
    }, [exibirTabela, atualizarTela]);

    return (
        <Pagina>
            <div className="py-3 w-100 px-2">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col md={10}>
                            <h4>Gestão de Fabricantes e Números de Série</h4>
                        </Col>
                        <Col md={2} className="text-end">
                            {exibirTabela && (
                                <Button
                                    className="w-90"
                                    variant="primary"
                                    onClick={() => {
                                        setExibirTabela(false);
                                        setModoEdicao(false);
                                        setFabricanteSelecionado({
                                            fabricante: "",
                                            numeroSerie: "",
                                            criado_em: "",
                                            atualizado_em: ""
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
                <TabelaFabricantes
                    listaDeFabricantes={listaDeFabricantes}
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    setModoEdicao={setModoEdicao}
                    setFabricanteSelecionado={setFabricanteSelecionado}
                />
            ) : (
                <FormCadastroFabricante
                    setExibirTabela={setExibirTabela}
                    setModoEdicao={setModoEdicao}
                    modoEdicao={modoEdicao}
                    fabricanteSelecionado={fabricanteSelecionado}
                    setFabricanteSelecionado={setFabricanteSelecionado}
                    setAtualizarTela={setAtualizarTela}
                />
            )}
        </Pagina>
    );
}
