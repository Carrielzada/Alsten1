import { Button, Container, Row, Col } from "react-bootstrap";
import Pagina from "../Templates2/Pagina.jsx";
import FormCadastroModelo from "./Formularios/FormCadastroModelo.jsx";
import TabelaModelosEquipamentos from "./Tabelas/TabelaModelosEquipamentos.jsx";
import { useState, useEffect, useContext } from "react";
import { buscarTodosModelos } from "../../servicos/modeloService.js";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaPlus } from "react-icons/fa";

export default function TelaCadastroModelo(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDeModelos, setListaDeModelos] = useState([]);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [modeloSelecionado, setModeloSelecionado] = useState({
        modelo: "",
        criado_em: "",
        atualizado_em: ""
    });

    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosModelos(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaDeModelos(resposta.listaModelos);
                }
                setAtualizarTela(false);
            })
            .catch((erro) => {
                alert("Erro ao buscar Modelos: " + erro.message);
            });
    }, [exibirTabela, atualizarTela]);

    return (
        <Pagina>
            <div className="py-3 w-100 px-2">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col md={10}>
                            <h4>Gestão de Modelos de Equipamentos</h4>
                        </Col>
                        <Col md={2} className="text-end">
                            {exibirTabela && (
                                <Button
                                    className="w-90"
                                    variant="primary"
                                    onClick={() => {
                                        setExibirTabela(false);
                                        setModoEdicao(false);
                                        setModeloSelecionado({
                                            modelo: "",
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
                <TabelaModelosEquipamentos
                    listaDeModelos={listaDeModelos}
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    setModoEdicao={setModoEdicao}
                    setModeloSelecionado={setModeloSelecionado}
                />
            ) : (
                <FormCadastroModelo
                    setExibirTabela={setExibirTabela}
                    setModoEdicao={setModoEdicao}
                    modoEdicao={modoEdicao}
                    modeloSelecionado={modeloSelecionado}
                    setModeloSelecionado={setModeloSelecionado}
                    setAtualizarTela={setAtualizarTela}
                />
            )}
        </Pagina>
    );
}
