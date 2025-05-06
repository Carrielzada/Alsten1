import { Button, Container, Row, Col } from "react-bootstrap";
import Pagina from "../Templates2/Pagina";
import FormCadastroPublicidadePJ from "./Formularios/FormCadastroPublicidadePJ";
import TabelaPublicidadePJ from "./Tabelas/TabelaPublicidadePJ";
import { useState, useEffect, useContext } from "react";
import { buscarTodasPublicidadePJ } from "../../servicos/publicidadePJService";
import { ContextoUsuarioLogado } from "../../App";
import { FaPlus } from "react-icons/fa";

export default function TelaCadPublicidadePJ(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaPublicidades, setListaPublicidades] = useState([]);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [publicidadeSelecionada, setPublicidadeSelecionada] = useState(null);

    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodasPublicidadePJ(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaPublicidades(resposta.listaPublicidades);
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
                            <h4>Gestão de Publicidades</h4>
                        </Col>
                        <Col md={2} className="text-end">
                            {exibirTabela && (
                                <Button
                                    className="w-100"
                                    variant="primary"
                                    onClick={() => {
                                        setExibirTabela(false);
                                        setModoEdicao(false); // Desativa o modo edição
                                        setPublicidadeSelecionada(null); // Limpa a Publicidade selecionada
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
                <TabelaPublicidadePJ
                    listaPublicidades={listaPublicidades}
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    setModoEdicao={setModoEdicao}
                    setPublicidadeSelecionada={setPublicidadeSelecionada}
                />
            ) : (
                <FormCadastroPublicidadePJ
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    modoEdicao={modoEdicao}
                    publicidadeSelecionada={publicidadeSelecionada}
                />
            )}
        </Pagina>
    );
}
