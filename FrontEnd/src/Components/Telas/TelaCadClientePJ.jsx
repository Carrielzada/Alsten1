import { Button, Container, Row, Col } from "react-bootstrap";
import Pagina from "../Templates2/Pagina.jsx";
import FormCadClientePJ from "./Formularios/FormCadClientePJ.jsx";
import TabelaClientePJ from "./Tabelas/TabelaClientePJ.jsx";
import { useState, useEffect } from "react";
import { buscarTodosClientePJ } from "../../Services/clientePJService.js";
import { FaPlus } from "react-icons/fa";

export default function TelaCadClientePJ(props) {
    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDeClientePJ, setListaDeClientePJ] = useState([]);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [clientePJSelecionado, setClientePJSelecionado] = useState({});

    // CORREÇÃO: Chamando a função de serviço sem o token
    useEffect(() => {
        buscarTodosClientePJ()
            .then((resposta) => {
                if (resposta.status) {
                    setListaDeClientePJ(resposta.listaClientesPJ); // Corrigindo para listaClientesPJ
                }
            })
            .catch((erro) => {
                alert("Erro ao buscar Clientes PJ: " + erro.message);
            })
            .finally(() => {
                // Garante que o estado de atualização seja resetado
                setAtualizarTela(false);
            });
    }, [exibirTabela, atualizarTela]); // A tela será recarregada quando voltar para a tabela ou quando forçar a atualização

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
                                    variant="primary"
                                    onClick={() => {
                                        setModoEdicao(false);
                                        setClientePJSelecionado({}); // Limpa o cliente selecionado
                                        setExibirTabela(false);
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
                <TabelaClientePJ
                    listaDeClientePJ={listaDeClientePJ}
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela} // Prop necessária para forçar a atualização
                    setModoEdicao={setModoEdicao}
                    setClientePJSelecionado={setClientePJSelecionado}
                />
            ) : (
                <FormCadClientePJ
                    setExibirTabela={setExibirTabela}
                    modoEdicao={modoEdicao}
                    clientePJSelecionado={clientePJSelecionado}
                    setAtualizarTela={setAtualizarTela} // Prop necessária para forçar a atualização
                />
            )}
        </Pagina>
    );
}