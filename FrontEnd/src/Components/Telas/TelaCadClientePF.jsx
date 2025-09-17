import { Container, Row, Col } from "react-bootstrap";
import Button from '../UI/Button';
import Pagina from "../Templates2/Pagina.jsx";
import FormCadClientePF from "./Formularios/FormCadClientePF.jsx";
import TabelaClientePF from "./Tabelas/TabelaClientePF.jsx";
import { useState, useEffect, useContext } from "react";
import { buscarTodosClientePF } from "../../Services/clientePFService.js";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaPlus } from "react-icons/fa";

export default function TelaCadClientePF(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDeClientePF, setListaDeClientePF] = useState([]);

    // Estados adicionais
    const [modoEdicao, setModoEdicao] = useState(false);
    const [clientePFSelecionado, setClientePFSelecionado] = useState({
        cpf: "",
        nome: "",
        data_nascimento: "",
        contato: "",
        endereco: "",
        cidade: "",
        bairro: "",
        estado: "",
        cep: "",
        criado_em: "",
        atualizado_em: ""
    });

    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosClientePF(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaDeClientePF(resposta.listaClientes);
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
                            <h4>Gestão de Cliente Pessoa Física</h4>
                        </Col>
                        <Col md={2} className="text-end">
                            {exibirTabela && (
                                <Button
                                    className="w-90"
                                    variant="primary"
                                    onClick={() => {
                                        setExibirTabela(false);
                                        setModoEdicao(false); // Modo de edição desligado ao adicionar novo registro
                                        setClientePFSelecionado({
                                            cpf: "",
                                            nome: "",
                                            data_nascimento: "",
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
            {exibirTabela ? (
                <TabelaClientePF
                    listaDeClientePF={listaDeClientePF}
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    setModoEdicao={setModoEdicao}
                    setClientePFSelecionado={setClientePFSelecionado}
                />
            ) : (
                <FormCadClientePF
                    setExibirTabela={setExibirTabela}
                    setModoEdicao={setModoEdicao}
                    modoEdicao={modoEdicao}
                    clientePFSelecionado={clientePFSelecionado}
                    setClientePFSelecionado={setClientePFSelecionado}
                    setAtualizarTela={setAtualizarTela}
                />
            )}
        </Pagina>
    );
}
