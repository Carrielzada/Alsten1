import { Button, Container, Row, Col } from "react-bootstrap";
import Pagina from "../Templates2/Pagina";
import FormCadastroPropagandaPJ from "./Formularios/FormCadastroPropagandaPJ";
import TabelaPropagandasPJ from "./Tabelas/TabelaPropagandasPJ";
import { useState, useEffect, useContext } from "react";
import { buscarTodasPropagandasPJ } from "../../Services/propagandaPJService";
import { ContextoUsuarioLogado } from "../../App";
import { FaPlus } from "react-icons/fa";

export default function TelaCadPropagandaPJ(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaPropagandas, setListaPropagandas] = useState([]);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [propagandaSelecionada, setPropagandaSelecionada] = useState(null);

    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodasPropagandasPJ(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaPropagandas(resposta.listaPropagandas);
                }
                setAtualizarTela(false);
            })
            .catch((erro) => {
                alert("Erro ao enviar a requisição: " + erro.message);
            });
    }, [exibirTabela, atualizarTela]);

    return (
        <Pagina>
            <div className="py-3 w-100">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col md={10}>
                            <h4>Gestão de Propagandas</h4>
                        </Col>
                        <Col md={2} className="text-end">
                            {exibirTabela && (
                                <Button
                                    className="w-100"
                                    variant="primary"
                                    onClick={() => {
                                        setExibirTabela(false);
                                        setModoEdicao(false); // Desativa o modo edição
                                        setPropagandaSelecionada(null); // Limpa a propaganda selecionada
                                    }}
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
                <TabelaPropagandasPJ
                    listaPropagandas={listaPropagandas}
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    setModoEdicao={setModoEdicao}
                    setPropagandaSelecionada={setPropagandaSelecionada}
                />
            ) : (
                <FormCadastroPropagandaPJ
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    modoEdicao={modoEdicao}
                    propagandaSelecionada={propagandaSelecionada}
                />
            )}
        </Pagina>
    );
}
