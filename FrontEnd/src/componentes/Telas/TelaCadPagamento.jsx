import { Button, Container, Row, Col } from "react-bootstrap";
import Pagina from "../Templates2/Pagina.jsx";
import FormCadNetworking from "./Formularios/FormCadPagamento.jsx";
import TabelaNetworking from "./Tabelas/TabelaNetworking.jsx";
import { useState, useEffect, useContext } from "react";
import { buscarTodosNetworking } from "../../servicos/networkingService.js";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaPlus } from "react-icons/fa";

export default function TelaCadNetworking(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDeNetworking, setListaDeNetworking] = useState([]);

    // Estados adicionais
    const [modoEdicao, setModoEdicao] = useState(false);
    const [networkingSelecionado, setNetworkingSelecionado] = useState({
        nome: "",
        contato: "",
        email: "",
        data_nascimento: "",
        observacoes: "",
    });

    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosNetworking(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaDeNetworking(resposta.listaNetworking);
                }
                setAtualizarTela(false);
            })
            .catch((erro) => {
                alert("Erro ao enviar a requisição: " + erro.message);
            });
    }, [exibirTabela, atualizarTela]);

    return (
        <Pagina>
            <div className="py-3 w-100 px-2">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col md={10}>
                            <h4>Gestão de Pagamento</h4>
                        </Col>
                        <Col md={2} className="text-end">
                            {exibirTabela && (
                                <Button
                                    className="w-90"
                                    variant="primary"
                                    onClick={() => {
                                        setExibirTabela(false);
                                        setModoEdicao(false); // Modo de edição desligado ao adicionar novo registro
                                        setNetworkingSelecionado({
                                            nome: "",
                                            contato: "",
                                            email: "",
                                            data_nascimento: "",
                                            observacoes: "",
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
                <TabelaNetworking
                    exibirTabela={exibirTabela}
                    setExibirTabela={setExibirTabela}
                    listaDeNetworking={listaDeNetworking}
                    setAtualizarTela={setAtualizarTela}
                    setModoEdicao={setModoEdicao}
                    setNetworkingSelecionado={setNetworkingSelecionado}
                />
            ) : (
                <FormCadNetworking
                    setExibirTabela={setExibirTabela}
                    setModoEdicao={setModoEdicao}
                    modoEdicao={modoEdicao}
                    networkingSelecionado={networkingSelecionado}
                    setNetworkingSelecionado={setNetworkingSelecionado}
                    setAtualizarTela={setAtualizarTela}
                />
            )}
        </Pagina>
    );
}
