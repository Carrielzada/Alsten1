import { Container, Row, Col } from "react-bootstrap";
import Button from '../UI/Button';
import Pagina from "../Templates2/Pagina.jsx";
import FormCadastroDefeito from "./Formularios/FormCadastroDefeito.jsx";
import TabelaDefeitos from "./Tabelas/TabelaDefeitos.jsx";
import { useState, useEffect, useContext } from "react";
import { buscarTodosDefeitos } from "../../Services/defeitoService.js";
import { ContextoUsuarioLogado } from "../../App.js";
import { FaPlus } from "react-icons/fa";

export default function TelaCadastroDefeito(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaDeDefeitos, setListaDeDefeitos] = useState([]);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [defeitoSelecionado, setDefeitoSelecionado] = useState({
        defeito: "",
        criado_em: "",
        atualizado_em: ""
    });

    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosDefeitos(token)
            .then((resposta) => {
                if (resposta.status) {
                    setListaDeDefeitos(resposta.listaDefeitos);
                }
                setAtualizarTela(false);
            })
            .catch((erro) => {
                alert("Erro ao buscar Defeitos: " + erro.message);
            });
    }, [exibirTabela, atualizarTela]);

    return (
        <Pagina>
            <div className="py-3 w-100 px-2">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col md={10}>
                            <h4>Gestão de Defeitos Alegados</h4>
                        </Col>
                        <Col md={2} className="text-end">
                            {exibirTabela && (
                                <Button
                                    className="w-90"
                                    variant="primary"
                                    onClick={() => {
                                        setExibirTabela(false);
                                        setModoEdicao(false);
                                        setDefeitoSelecionado({
                                            defeito: "",
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
                <TabelaDefeitos
                    listaDeDefeitos={listaDeDefeitos}
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    setModoEdicao={setModoEdicao}
                    setDefeitoSelecionado={setDefeitoSelecionado}
                />
            ) : (
                <FormCadastroDefeito
                    setExibirTabela={setExibirTabela}
                    setModoEdicao={setModoEdicao}
                    modoEdicao={modoEdicao}
                    defeitoSelecionado={defeitoSelecionado}
                    setDefeitoSelecionado={setDefeitoSelecionado}
                    setAtualizarTela={setAtualizarTela}
                />
            )}
        </Pagina>
    );
}
