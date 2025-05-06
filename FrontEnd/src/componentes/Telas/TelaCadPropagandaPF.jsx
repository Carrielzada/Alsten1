import { Button, Container, Row, Col } from "react-bootstrap";
import Pagina from "../Templates2/Pagina";
import FormCadastroPropagandaPF from "./Formularios/FormCadastroPropagandaPF";
import TabelaPropagandasPF from "./Tabelas/TabelaPropagandasPF";
import { useState, useEffect, useContext } from "react";
import { buscarTodasPropagandasPF } from "../../servicos/propagandaPFService";
import { ContextoUsuarioLogado } from "../../App";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TelaCadPropagandaPF(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);
    const navigate = useNavigate();
    const { usuarioLogado } = contextoUsuario;

    useEffect(() => {
        console.log("Usuário logado:", usuarioLogado);
        console.log("Role do usuário:", usuarioLogado?.role);
    
        // Verificar se o role do usuário é válido
        if (usuarioLogado?.role !== 2) { // Role 2 é para Gerente
            alert("Acesso negado! Você não tem permissão para acessar esta página.");
            navigate("/"); // Redirecionar para a página inicial
        }
    }, [usuarioLogado, navigate]);
    
    useEffect(() => {
        console.log("Estado do contexto usuário logado:", contextoUsuario.usuarioLogado);
    }, [contextoUsuario.usuarioLogado]);
    

    const [exibirTabela, setExibirTabela] = useState(true);
    const [atualizarTela, setAtualizarTela] = useState(false);
    const [listaPropagandas, setListaPropagandas] = useState([]);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [propagandaSelecionada, setPropagandaSelecionada] = useState(null);

    useEffect(() => {
        const token = usuarioLogado.token;
        buscarTodasPropagandasPF(token)
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
                                        setModoEdicao(false);
                                        setPropagandaSelecionada(null);
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
                <TabelaPropagandasPF
                    listaPropagandas={listaPropagandas}
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    setModoEdicao={setModoEdicao}
                    setPropagandaSelecionada={setPropagandaSelecionada}
                />
            ) : (
                <FormCadastroPropagandaPF
                    setExibirTabela={setExibirTabela}
                    setAtualizarTela={setAtualizarTela}
                    modoEdicao={modoEdicao}
                    propagandaSelecionada={propagandaSelecionada}
                />
            )}
        </Pagina>
    );
}
