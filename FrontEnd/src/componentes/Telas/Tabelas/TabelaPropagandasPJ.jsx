import { Container, Table, Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useContext, useState } from "react";
import { ContextoUsuarioLogado } from "../../../App";
import { excluirPropagandaPJ, baixarArquivo, atualizarArquivosAdicionais } from "../../../servicos/propagandaPJService";
import { FaTrash, FaEdit, FaInfoCircle, FaDownload, FaExternalLinkAlt, FaPlus } from "react-icons/fa";
import { consultarPorRole, vincularUsuarioPropaganda } from "../../../servicos/usersService";

export default function TabelaPropagandasPJ(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);
    const [showModal, setShowModal] = useState(false);
    const [selectedPropaganda, setSelectedPropaganda] = useState(null);
    const [showModalVincularUser, setShowModalVincularUser] = useState(false);
    const [listaUsers, setListaUsers] = useState([]);
    const [showModalAddAnexo, setShowModalAddAnexo] = useState(false);
    const [arquivos, setArquivos] = useState([]);
    const [carregando, setCarregando] = useState(false);

    function handleExcluirPropagandaPJ(propaganda) {
        const token = contextoUsuario.usuarioLogado.token;
        if (window.confirm(`Deseja excluir a propaganda "${propaganda.nome}" do cliente ${propaganda.clientePJ_cnpj}?`)) {
            excluirPropagandaPJ(propaganda, token)
                .then((resposta) => {
                    props.setAtualizarTela(true);
                    alert(resposta.mensagem);
                })
                .catch((erro) => {
                    alert("Erro ao enviar a requisição: " + erro.message);
                });
        }
    }

    function handleShowModal(propaganda) {
        setSelectedPropaganda(propaganda);
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        setSelectedPropaganda(null);
    }

    function handleArquivoChange(event) {
        setArquivos(event.target.files);
    }

    function handleShowModalAddAnexo(propaganda) {
        if (!propaganda || !propaganda.id) {
            alert("Nenhuma propaganda selecionada.");
            return;
        }
        console.log("Propaganda selecionada", propaganda);
        setSelectedPropaganda(propaganda);
        setShowModalAddAnexo(true);
    }

    function handleDownloadArquivo(nomeArquivo, cpf) {
        const token = contextoUsuario.usuarioLogado.token;
        baixarArquivo(nomeArquivo, cpf, token).catch((error) => {
            alert("Erro ao baixar o arquivo: " + error.message);
        });
    }

    function handleCloseModalVincularUser() {
        setShowModalVincularUser(false);
    }

    function handleShowModalVincularUser(propaganda) {
        setSelectedPropaganda(propaganda); // Atualize a propaganda selecionada
        consultarPorRole(3, contextoUsuario.usuarioLogado.token) // Role_id = 3
        .then((response) => {
            if (response.status) {
                setListaUsers(response.listaUsers); // Atualiza o estado com a lista de usuários
                setShowModalVincularUser(true); // Exibe o modal
            } else {
                alert("Nenhum usuário encontrado!");
            }
        })
        .catch((erro) => {
            alert("Erro ao buscar usuários: " + erro.message);
        });
    }
    

    function onVincularUsuario(userId) {
        const token = contextoUsuario.usuarioLogado.token;
    
        if (!selectedPropaganda) {
            alert("Nenhuma propaganda selecionada.");
            return;
        }
    
        const id_dados = selectedPropaganda.id; // Obtém o ID da propaganda
        const prop_publ = "prop"; // Define o valor para a coluna `prop_publ`
    
        vincularUsuarioPropaganda(userId, id_dados, prop_publ, token)
            .then((data) => {
                if (data.status) {
                    alert("Usuário vinculado com sucesso!");
                    setListaUsers((prevUsers) =>
                        prevUsers.map((user) =>
                            user.id === userId
                                ? { ...user, id_dados, prop_publ }
                                : user
                        )
                    );
                } else {
                    alert(`Erro ao vincular usuário: ${data.mensagem}`);
                }
            })
            .catch((err) => {
                alert(`Erro ao enviar a requisição: ${err.message}`);
            });
    }

    function handleCloseModalAddAnexo() {
        setArquivos([]);
        setShowModalAddAnexo(false);
    }

    async function handleAdicionarAnexos() {
        if (!selectedPropaganda || !selectedPropaganda.id) {
            alert("Nenhuma propaganda selecionada. Por favor, tente novamente.");
            return;
        }
    
        if (!arquivos || arquivos.length === 0) {
            alert("Selecione pelo menos um arquivo.");
            return;
        }
    
        const token = contextoUsuario.usuarioLogado.token;
        const formData = new FormData();
    
        Array.from(arquivos).forEach((arquivo) => {
            formData.append("novos_arquivos[]", arquivo);
        });
    
        setCarregando(true);
    
        try {
            const resposta = await atualizarArquivosAdicionais(formData, selectedPropaganda.id, token);
            if (resposta.status) {
                alert("Anexos adicionados com sucesso!");
    
                // Atualizar a lista de arquivos adicionais no Frontend
                setSelectedPropaganda((prev) => ({
                    ...prev,
                    arquivos_adicionais: prev.arquivos_adicionais
                        ? `${prev.arquivos_adicionais},${resposta.novos_arquivos.join(",")}`
                        : resposta.novos_arquivos.join(",")
                }));
    
                props.setAtualizarTela(true);
                handleCloseModalAddAnexo();
            } else {
                alert("Erro: " + resposta.mensagem);
            }
        } catch (erro) {
            alert("Erro ao adicionar anexos: " + erro.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <Container>
            <Table striped bordered hover className="text-center align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome Cliente</th>
                        <th>Canal</th>
                        <th>Valor</th>
                        <th>Data Emissão</th>
                        <th>Data Encerramento</th>
                        <th>Duração</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {props.listaPropagandas?.map((propaganda) => (
                        <tr key={propaganda.id}>
                            <td>{propaganda.id}</td>
                            <td>{propaganda.cliente_nome}</td>
                            <td className="text-nowrap">{propaganda.canal}</td>
                            <td className="text-nowrap">R$ {parseFloat(propaganda.valor).toFixed(2)}</td>
                            <td>{new Date(propaganda.data_emissao).toLocaleDateString("pt-BR")}</td>
                            <td>{new Date(propaganda.data_encerramento).toLocaleDateString("pt-BR")}</td>
                            <td>{propaganda.duracao} Dias</td>
                            <td className="text-nowrap">
                                {/* Botão de Editar */}
                                <FaEdit 
                                    className="text-primary mx-2"
                                    title="Editar" 
                                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                    onClick={() => {
                                        props.setPropagandaSelecionada(propaganda); // Define a propaganda a ser editada
                                        props.setModoEdicao(true); // Ativa o modo edição
                                        props.setExibirTabela(false); // Alterna para o formulário
                                    }}
                                />
                                {/* Botão de Excluir */}
                                <FaTrash
                                    className="text-danger mx-2"
                                    title="Excluir"
                                    style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "10px" }}
                                    onClick={() => handleExcluirPropagandaPJ(propaganda)}
                                />
                                {/* Botão de Informação */}
                                <FaInfoCircle
                                    className="text-info mx-2"
                                    title="Detalhar"
                                    style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "10px" }}
                                    onClick={() => handleShowModal(propaganda)}
                                />
                                <FaExternalLinkAlt
                                    className="text-secondary mx-2"
                                    title="Vincular User"
                                    style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "10px" }}
                                    onClick={() => handleShowModalVincularUser(propaganda)}
                                />
                                <FaPlus
                                    className="text-success mx-2"
                                    title="Adicionar Anexo"
                                    style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "10px" }}
                                    onClick={() => handleShowModalAddAnexo(propaganda)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* Modal para exibir informações da propaganda */}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
                size="xl"
                className="modal-custom-width"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Detalhes da Propaganda</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPropaganda && (
                        <Container>
                            {/* Informações Gerais */}
                            <Row className="mb-3">
                                <Col md="auto">
                                    <strong>ID:</strong> {selectedPropaganda.id}
                                </Col>
                                <Col md="auto">
                                    <strong>CNPJ:</strong> {selectedPropaganda.clientePJ_cnpj}
                                </Col>
                                <Col md="auto">
                                    <strong>Cliente:</strong> {selectedPropaganda.cliente_nome}
                                </Col>
                            </Row>
                            <hr />
                            {/* Informações da Propaganda */}
                            <Row className="mb-3">
                                <Col>
                                    <h5 className="mb-3 text-primary">Informações da Propaganda</h5>
                                    <Row className="align-items-center">
                                        <Col md="auto">
                                            <strong>Nome:</strong> {selectedPropaganda.nome}
                                        </Col>
                                    </Row>
                                    <Row className="align-items-center">
                                        <Col md="auto">
                                            <strong>Canal:</strong> {selectedPropaganda.canal}
                                        </Col>
                                        <Col md="auto">
                                            <strong>Valor:</strong> R$ {parseFloat(selectedPropaganda.valor).toFixed(2)}
                                        </Col>
                                        <Col md="auto">
                                            <strong>Duração:</strong> {selectedPropaganda.duracao} Dias
                                        </Col>
                                        <Col md="auto">
                                            <strong>Emissão:</strong>{" "}
                                            {new Date(selectedPropaganda.data_emissao).toLocaleDateString("pt-BR")}
                                        </Col>
                                        <Col md="auto">
                                            <strong>Encerram.:</strong>{" "}
                                            {new Date(selectedPropaganda.data_encerramento).toLocaleDateString("pt-BR")}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                            {/* Informações dos Representantes */}
                            <Row className="mb-3">
                                <Col>
                                    <h5 className="mb-3 text-success">Informações dos Representantes</h5>
                                    <Row>
                                        <Col md={6}>
                                            <p>
                                                <strong>Representante 1:</strong> {selectedPropaganda.representante1_nome || "Não informado"}{" "}
                                                {selectedPropaganda.representante1_contato || "Não informado"}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <p>
                                                <strong>Representante 2:</strong> {selectedPropaganda.representante2_nome || "Não informado"}{" "}
                                                {selectedPropaganda.representante2_contato || "Não informado"}
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                            {/* Arquivos */}
                            <Row>
                                <Col>
                                    <h5 className="mb-3 text-warning">Arquivos</h5>
                                    <Row>
                                        {/* Contrato Digital */}
                                        <Col md={6}>
                                            <Row>
                                                <Col className="d-flex align-items-center">
                                                    <strong>Contrato Digital:</strong>
                                                </Col>
                                            </Row>
                                            {selectedPropaganda.contrato_digital ? (
                                                <ul>
                                                    {selectedPropaganda.contrato_digital.split(",").map((arquivo, index) => (
                                                        <li key={index} className="d-flex align-items-center">
                                                            <span>{arquivo.trim()}</span>
                                                            <FaDownload
                                                                className="text-success ms-2"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() =>
                                                                    handleDownloadArquivo(
                                                                        arquivo.trim(),
                                                                        selectedPropaganda.clientePJ_cnpj
                                                                    )
                                                                }
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <Row>
                                                    <Col>Não informado</Col>
                                                </Row>
                                            )}
                                        </Col>
                                        {/* Arquivos Adicionais */}
                                        <Col md={6}>
                                            <Row>
                                                <Col className="d-flex align-items-center">
                                                    <strong>Arquivos Adicionais:</strong>
                                                </Col>
                                            </Row>
                                            {selectedPropaganda.arquivos_adicionais ? (
                                                <ul>
                                                    {selectedPropaganda.arquivos_adicionais.split(",").map((arquivo, index) => (
                                                        <li key={index} className="d-flex align-items-center">
                                                            <span>{arquivo.trim()}</span>
                                                            <FaDownload
                                                                className="text-success ms-2"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() =>
                                                                    handleDownloadArquivo(
                                                                        arquivo.trim(),
                                                                        selectedPropaganda.clientePJ_cnpj
                                                                    )
                                                                }
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <Row>
                                                    <Col>Não informado</Col>
                                                </Row>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal para vincular usuário */}
            <Modal show={showModalVincularUser} onHide={handleCloseModalVincularUser} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Vincular Usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Listagem de usuários */}
                    {listaUsers.length > 0 ? (
                        <Table striped bordered hover className="text-center align-middle">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.nome}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Button
                                                className="m-1 "
                                                variant="primary"
                                                size="sm"
                                                onClick={() => onVincularUsuario(user.id)}
                                            >
                                                Vincular
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>Nenhum usuário disponível para vincular.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalVincularUser}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal para Adicionar Anexos */}
            <Modal show={showModalAddAnexo} onHide={handleCloseModalAddAnexo} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Anexos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formArquivos" className="mb-3">
                            <Form.Label>Selecione os arquivos:</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={handleArquivoChange}
                                accept=".pdf,.doc,.docx,.zip,.rar"
                            />
                            <Form.Text className="text-muted">
                                Arquivos permitidos: PDF, DOC, DOCX, ZIP, RAR.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>                    
                    <Button
                        variant="success"
                        onClick={handleAdicionarAnexos}
                        disabled={carregando || arquivos.length === 0}
                    >
                        {carregando ? "Carregando..." : "Anexar"}
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModalAddAnexo}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
