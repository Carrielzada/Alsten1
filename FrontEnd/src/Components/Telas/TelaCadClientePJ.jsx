import { Button, Container, Row, Col } from "react-bootstrap";
import Pagina from "../Templates2/Pagina.jsx";
import FormCadClientePJ from "./Formularios/FormCadClientePJ.jsx";
import TabelaClientePJ from "./Tabelas/TabelaClientePJ.jsx";
import { useState, useEffect, useContext } from "react";
import { buscarTodosClientePJ } from "../../Services/clientePJService.js";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaPlus } from "react-icons/fa";

export default function TelaCadClientePJ(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDeClientePJ, setListaDeClientePJ] = useState([]);

    // Estados adicionais
    const [modoEdicao, setModoEdicao] = useState(false);
    const [clientePJSelecionado, setClientePJSelecionado] = useState({
        cnpj: "",
        nome: "",
        nome_fantasia: "",
        contato: "",
        endereco: "",
        cidade: "",
        bairro: "",
        estado: "",
        cep: "",
        criado_em: "",
        atualizado_em: ""
    });

    // Buscar todos os clientes PJ no backend
    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosClientePJ(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaDeClientePJ(resposta.listaClientes);
                }
                setAtualizarTela(false);
            })
            .catch((erro) => {
                alert("Erro ao buscar Clientes PJ: " + erro.message);
            });
    }, [exibirTabela, atualizarTela]);

    return (
        <Pagina>
            <div className="py-3 w-100 px-2">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col md={10}>
                            <h4>Gestão de Cliente Pessoa Jurídica</h4>
                        </Col>
                        <Col md={2} className="text-end">
                            {exibirTabela && (
                                <Button
                                    className="w-90"
                                    variant="primary"
                                    onClick={() => {
                                        setExibirTabela(false);
                                        setModoEdicao(false); // Modo de edição desligado ao adicionar novo registro
                                        setClientePJSelecionado({
                                            cnpj: "",
                                            nome: "",
                                            nome_fantasia: "",
                                            contato: "",
                                            endereco: "",
                                            cidade: "",
                                            bairro: "",
                                            estado: "",
                                            cep: "",
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

            {/* Alterna entre Tabela e Formulário */}
            {exibirTabela ? (
                <TabelaClientePJ
                    listaDeClientePJ={listaDeClientePJ}
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    setModoEdicao={setModoEdicao}
                    setClientePJSelecionado={setClientePJSelecionado}
                />
            ) : (
                <FormCadClientePJ
                    setExibirTabela={setExibirTabela}
                    setModoEdicao={setModoEdicao}
                    modoEdicao={modoEdicao}
                    clientePJSelecionado={clientePJSelecionado}
                    setClientePJSelecionado={setClientePJSelecionado}
                    setAtualizarTela={setAtualizarTela}
                />
            )}
        </Pagina>
    );
}
