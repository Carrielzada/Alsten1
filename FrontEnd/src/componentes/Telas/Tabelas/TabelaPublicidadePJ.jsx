import { Container, Table, Modal, Button, Row, Col, Form, Tabs, Tab } from "react-bootstrap";
import { useContext, useState } from "react";
import { ContextoUsuarioLogado } from "../../../App";
import { excluirPublicidadePJ, baixarArquivo, atualizarArquivosAdicionais, atualizarComprovante, buscarComprovantes, baixarComprovante } from "../../../servicos/publicidadePJService";
import { FaTrash, FaEdit, FaInfoCircle, FaDownload, FaExternalLinkAlt, FaPlus, FaLayerGroup } from "react-icons/fa";
import { consultarPorRole, vincularUsuarioPublicidade } from "../../../servicos/usersService";

export default function TabelaPublicidadesPJ(props) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);
    const [showModal, setShowModal] = useState(false);
    const [selectedPublicidade, setSelectedPublicidade] = useState(null);
    const [showModalVincularUser, setShowModalVincularUser] = useState(false);
    const [listaUsers, setListaUsers] = useState([]);
    const [showModalAddAnexo, setShowModalAddAnexo] = useState(false);
    const [showModalAddComprovante, setShowModalAddComprovante] = useState(false);
    const [comprovante, setComprovante] = useState([]);
    const [arquivos, setArquivos] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [mesSelecionado, setMesSelecionado] = useState("");
    const [anoSelecionado, setAnoSelecionado] = useState("2025");
    const [comprovantes, setComprovantes] = useState([]);
    const [activeTab, setActiveTab] = useState(""); // Aba ativa para os comprovantes

    // Ordem fixa dos meses
    const mesesOrdem = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];

    function handleExcluirPublicidadePJ(publicidade) {
        const token = contextoUsuario.usuarioLogado.token;
        if (window.confirm(`Deseja excluir a publicidade "${publicidade.nome}" do cliente ${publicidade.clientePJ_cnpj}?`)) {
            excluirPublicidadePJ(publicidade, token)
                .then((resposta) => {
                    props.setAtualizarTela(true);
                    alert(resposta.mensagem);
                })
                .catch((erro) => {
                    alert("Erro ao enviar a requisição: " + erro.message);
                });
        }
    }

    async function handleShowModal(publicidade) {
        setSelectedPublicidade(publicidade);
        setShowModal(true);
    
        try {
            const token = contextoUsuario.usuarioLogado.token;
            const resposta = await buscarComprovantes(publicidade.id, token);
    
            if (resposta.status) {
                // Use os comprovantes diretamente
                const comprovantes = resposta.comprovantes;
    
                setComprovantes(comprovantes);
    
                // Define a primeira aba ativa: o primeiro ano e o primeiro mês
                const anos = Object.keys(comprovantes).sort();
                if (anos.length > 0) {
                    const primeiroAno = anos[0];
                    const meses = Object.keys(comprovantes[primeiroAno]).sort(
                        (a, b) => mesesOrdem.indexOf(a) - mesesOrdem.indexOf(b)
                    );
                    setActiveTab(`${primeiroAno}-${meses[0]}`); // Primeiro ano-mês ativo
                }
            } else {
                setComprovantes({});
                setActiveTab("");
            }
        } catch (erro) {
            console.error("Erro ao buscar comprovantes:", erro.message);
            setComprovantes({});
        }
    }
    

    function handleArquivoChange(event) {
        setArquivos(event.target.files);
    }

    function handleComprovanteChange(event) {
        setComprovante(event.target.files);
    }

    const handleMesChange = (event) => {
        setMesSelecionado(event.target.value);
    };

    const handleAnoChange = (event) => {
        setAnoSelecionado(event.target.value);
    };

    function handleShowModalAddAnexo(publicidade) {
        if (!publicidade || !publicidade.id) {
            alert("Nenhuma publicidade selecionada.");
            return;
        }
        console.log("Publicidade selecionada", publicidade);
        setSelectedPublicidade(publicidade);
        setShowModalAddAnexo(true);
    }

    function handleShowModalAddComprovante(publicidade) {
        if (!publicidade || !publicidade.id) {
            alert("Nenhuma publicidade selecionada.");
            return;
        }
        console.log("Publicidade selecionada", publicidade);
        setSelectedPublicidade(publicidade);
        setShowModalAddComprovante(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        setSelectedPublicidade(null);
        setComprovantes({});
    }

    function handleDownloadArquivo(nomeArquivo, cpf) {
        const token = contextoUsuario.usuarioLogado.token;
        baixarArquivo(nomeArquivo, cpf, token).catch((error) => {
            alert("Erro ao baixar o arquivo: " + error.message);
        });
    }

    async function handleDownloadComprovante(nomeArquivo, ano, mes) {
        const token = contextoUsuario.usuarioLogado.token;
    
        try {
            await baixarComprovante(selectedPublicidade.id, ano, mes, nomeArquivo, token);
        } catch (error) {
            alert(error.message);
        }
    }
    

    function handleCloseModalVincularUser() {
        setShowModalVincularUser(false);
    }

    function handleShowModalVincularUser(publicidade) {
        setSelectedPublicidade(publicidade);
        consultarPorRole(4, contextoUsuario.usuarioLogado.token)
            .then((response) => {
                if (response.status) {
                    setListaUsers(response.listaUsers);
                    setShowModalVincularUser(true);
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

        if (!selectedPublicidade) {
            alert("Nenhuma publicidade selecionada.");
            return;
        }

        const id_dados = selectedPublicidade.id;
        const prop_publ = "publ";

        vincularUsuarioPublicidade(userId, id_dados, prop_publ, token)
            .then((data) => {
                if (data.status) {
                    alert("Usuário vinculado com sucesso!");
                    setListaUsers((prevUsers) =>
                        prevUsers.map((user) =>
                            user.id === userId ? { ...user, id_dados, prop_publ } : user
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

    function handleCloseModalAddComprovante() {
        setArquivos([]);
        setShowModalAddComprovante(false);
    }

    async function handleAdicionarAnexos() {
        if (!selectedPublicidade || !selectedPublicidade.id) {
            alert("Nenhuma publicidade selecionada. Por favor, tente novamente.");
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
            const resposta = await atualizarArquivosAdicionais(formData, selectedPublicidade.id, token);
            if (resposta.status) {
                alert("Anexos adicionados com sucesso!");
    
                // Atualizar a lista de arquivos adicionais no Frontend
                setSelectedPublicidade((prev) => ({
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

    async function handleAdicionarComprovante() {
        if (!selectedPublicidade || !selectedPublicidade.id) {
            alert("Nenhuma publicidade selecionada. Por favor, tente novamente.");
            return;
        }
    
        if (!comprovante || comprovante.length === 0) {
            alert("Selecione pelo menos um arquivo.");
            return;
        }
    
        if (!mesSelecionado) {
            alert("Selecione um mês.");
            return;
        }
    
        const token = contextoUsuario.usuarioLogado.token;
        const formData = new FormData();
    
        Array.from(comprovante).forEach((arquivo) => {
            const dataAtual = new Date();
    
            // Gerar DDMMAA (dia, mês, ano sem o século)
            const dia = dataAtual.getDate().toString().padStart(2, "0");
            const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0");
            const ano = dataAtual.getFullYear().toString().slice(-2);
    
            // Gerar DDHH (hora e minutos)
            const hora = dataAtual.getHours().toString().padStart(2, "0");
            const minutos = dataAtual.getMinutes().toString().padStart(2, "0");
    
            // Gerar o nome final no formato desejado
            const nomeArquivo = `${dia}${mes}${ano}-${hora}${minutos}-${arquivo.name.trim()}`;
            formData.append("novos_comprovantes[]", arquivo, nomeArquivo);
        });
    
        formData.append("mes", mesSelecionado);
        formData.append("ano", anoSelecionado);
    
        setCarregando(true);
    
        try {
            const resposta = await atualizarComprovante(formData, selectedPublicidade.id, token);
            if (resposta.status) {
                alert("Comprovante adicionado com sucesso!");
                props.setAtualizarTela(true);
                handleCloseModalAddComprovante();
            } else {
                alert("Erro: " + resposta.mensagem);
            }
        } catch (erro) {
            alert("Erro ao adicionar comprovante: " + erro.message);
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
                    {props.listaPublicidades?.map((publicidade) => (
                        <tr key={publicidade.id}>
                            <td>{publicidade.id}</td>
                            <td>{publicidade.cliente_nome}</td>
                            <td className="text-nowrap">{publicidade.canal}</td>
                            <td className="text-nowrap">R$ {parseFloat(publicidade.valor).toFixed(2)}</td>
                            <td>{new Date(publicidade.data_emissao).toLocaleDateString("pt-BR")}</td>
                            <td>{new Date(publicidade.data_encerramento).toLocaleDateString("pt-BR")}</td>
                            <td>{publicidade.duracao} Dias</td>
                            <td className="text-nowrap">
                                {/* Botão de Editar */}
                                {/* Botão de Informação */}
                                <FaInfoCircle
                                    className="text-info mx-2"
                                    title="Detalhar"
                                    style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "10px" }}
                                    onClick={() => handleShowModal(publicidade)}
                                />
                                <FaEdit
                                    className="text-primary mx-2"
                                    title="Editar"
                                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                    onClick={() => {
                                        props.setPublicidadeSelecionada(publicidade); // Define a publicidade a ser editada
                                        props.setModoEdicao(true); // Ativa o modo edição
                                        props.setExibirTabela(false); // Alterna para o formulário
                                    }}
                                />
                                {/* Botão de Excluir */}
                                <FaTrash
                                    className="text-danger mx-2"
                                    title="Excluir"
                                    style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "10px" }}
                                    onClick={() => handleExcluirPublicidadePJ(publicidade)}
                                />                                
                                {/* Botão Vincular User - Restrito à role diferente de 4 */}
                                {contextoUsuario.usuarioLogado.role !== 4 && (
                                    <FaExternalLinkAlt
                                        className="text-secondary mx-2"
                                        title="Vincular User"
                                        style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "10px" }}
                                        onClick={() => handleShowModalVincularUser(publicidade)}
                                    />
                                )}
                                {/* Botão de Adicionar Anexo */}
                                <FaPlus
                                    className="text-success mx-2"
                                    title="Adicionar Anexo"
                                    style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "10px" }}
                                    onClick={() => handleShowModalAddAnexo(publicidade)}
                                />
                                <FaLayerGroup
                                    className="text-warning mx-2"
                                    title="Adicionar Comprovantes"
                                    style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "10px" }}
                                    onClick={() => handleShowModalAddComprovante(publicidade)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>

            </Table>
            {/* Modal para exibir informações da publicidade */}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
                size="xl"
                className="modal-custom-width"
            >
                <Modal.Header closeButton>
                    
                    {selectedPublicidade && (
                        <Container>
                            
                        {/* Informações Gerais */}
                            <Row className="mb-0 d-flex align-items-center">
                                <Col md="auto">
                                    <Modal.Title>Detalhes da Publicidade</Modal.Title>
                                </Col>
                                <Col md="auto">
                                    <strong>ID:</strong> {selectedPublicidade.id}
                                </Col>
                                <Col md="auto">
                                    <strong>CNPJ:</strong> {selectedPublicidade.clientePJ_cnpj}
                                </Col>
                                <Col md="auto">
                                    <strong>Cliente:</strong> {selectedPublicidade.cliente_nome}
                                </Col>
                            </Row>
                            </Container>
                        )}
                </Modal.Header>
                <Modal.Body>
                    {selectedPublicidade && (
                        <Container>
                            
                            {/* Informações da Publicidade */}
                            <Row className="mb-3">
                                <Col>
                                    <h5 className="mb-3 text-primary">Informações da Publicidade</h5>
                                    <Row className="align-items-center">
                                        <Col md="auto">
                                            <strong>Nome:</strong> {selectedPublicidade.nome}
                                        </Col>
                                        <Col md="auto">
                                            <strong>Canal:</strong> {selectedPublicidade.canal}
                                        </Col>
                                        <Col md="auto">
                                            <strong>Valor:</strong> R$ {parseFloat(selectedPublicidade.valor).toFixed(2)}
                                        </Col>
                                        <Col md="auto">
                                            <strong>Duração:</strong> {selectedPublicidade.duracao} Dias
                                        </Col>
                                        <Col md="auto">
                                            <strong>Emissão:</strong>{" "}
                                            {new Date(selectedPublicidade.data_emissao).toLocaleDateString("pt-BR")}
                                        </Col>
                                        <Col md="auto">
                                            <strong>Encerram.:</strong>{" "}
                                            {new Date(selectedPublicidade.data_encerramento).toLocaleDateString("pt-BR")}
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
                                        <Col md={4}>
                                            <p>
                                                <strong>Representante 1:</strong> {selectedPublicidade.representante1_nome || "Não informado"}{" "}
                                                {selectedPublicidade.representante1_contato || "Não informado"}
                                            </p>
                                        </Col>
                                        <Col md={4}>
                                            <p>
                                                <strong>Representante 2:</strong> {selectedPublicidade.representante2_nome || "Não informado"}{" "}
                                                {selectedPublicidade.representante2_contato || "Não informado"}
                                            </p>
                                        </Col>
                                        <Col md={4}>
                                            <p>
                                                <strong>Representante 3:</strong> {selectedPublicidade.representante3_nome || "Não informado"}{" "}
                                                {selectedPublicidade.representante3_contato || "Não informado"}
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                            {/* Arquivos */}
                            <Row>
                                <Col>
                                    <h5 className="mb-3 text-warning">Arquivos Administrativos:</h5>
                                    <Row>
                                       {/* Contrato Digital */}
                                        <Col md={6}>
                                            <Row>
                                                <Col>
                                                    <strong>Contrato Digital:</strong>
                                                </Col>
                                                <Col
                                                    className="d-flex justify-content-center align-items-center text-success"
                                                    style={{ cursor: "pointer" }}
                                                ></Col>
                                            </Row>
                                            {selectedPublicidade.contrato_digital ? (
                                                <ul>
                                                    {selectedPublicidade.contrato_digital.split(",").map((arquivo, index) => (
                                                        <li key={index} className="align-items-center">
                                                            <span>
                                                                {arquivo
                                                                    .replace(/^\d+_/, "") // Remove os números no início
                                                                    .toLowerCase()}{" "}
                                                                {/* Converte para minúsculo */}
                                                            </span>
                                                            <FaDownload
                                                                className="text-success ms-2"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() =>
                                                                    handleDownloadArquivo(
                                                                        arquivo.trim(), // Remove espaços extras
                                                                        selectedPublicidade.clientePJ_cnpj
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
                                                <Col>
                                                    <strong>Arquivos Adicionais:</strong>
                                                </Col>
                                                <Col
                                                    className="d-flex justify-content-center align-items-center text-success"
                                                    style={{ cursor: "pointer" }}
                                                ></Col>
                                            </Row>
                                            {selectedPublicidade.arquivos_adicionais ? (
                                                <ul>
                                                    {selectedPublicidade.arquivos_adicionais.split(",").map((arquivo, index) => (
                                                        <li key={index} className="align-items-center">
                                                            <span>
                                                                {arquivo
                                                                    .replace(/^\d+_/, "") // Remove os números no início
                                                                    .toLowerCase()}{" "}
                                                                {/* Converte para minúsculo */}
                                                            </span>
                                                            <FaDownload
                                                                className="text-success ms-2"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() =>
                                                                    handleDownloadArquivo(
                                                                        arquivo.trim(), // Remove espaços extras
                                                                        selectedPublicidade.clientePJ_cnpj
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
                            <Row>
                            <Col>
                                <h5 className="mb-3 text-danger">Comprovantes:</h5>
                                {Object.keys(comprovantes["2025"] || {}).length > 0 ? (
                                    <Tabs
                                        id="tabs-comprovantes-meses"
                                        activeKey={activeTab}
                                        onSelect={(k) => setActiveTab(k)}
                                        className="mb-3"
                                    >
                                        {Object.keys(comprovantes["2025"])
                                            .sort((a, b) => mesesOrdem.indexOf(a) - mesesOrdem.indexOf(b)) // Ordena os meses
                                            .map((mes) => (
                                                <Tab eventKey={mes} title={mes} key={mes}>
                                                    <ul>
                                                        {comprovantes["2025"][mes].map((comp, index) => (
                                                            <li key={index}>
                                                                <span>{comp.nome.replace(/^\d+-\d+-\d+-/, "").toLowerCase()}</span> {/* Remove números no prefixo */}
                                                                <FaDownload
                                                                    className="text-success ms-2"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() =>
                                                                        handleDownloadComprovante(comp.nome, "2025", mes)
                                                                    }
                                                                />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </Tab>
                                            ))}
                                    </Tabs>
                                ) : (
                                    <p>Nenhum comprovante encontrado para 2025.</p>
                                )}



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
            {/* Modal para Adicionar Comprovantes */}
            <Modal show={showModalAddComprovante} onHide={handleCloseModalAddComprovante} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Comprovante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formArquivos" className="mb-3">
                            <Form.Label>Selecione o comprovante:</Form.Label>
                            <div className="d-flex align-items-center">
                                {/* Input de arquivo */}
                                <Form.Control
                                    type="file"
                                    multiple
                                    onChange={handleComprovanteChange}
                                    accept=".pdf,.doc,.docx,.zip,.rar"
                                    className="me-3"
                                />
                                
                                {/* Input de seleção de mês */}
                                <Form.Select
                                    controlId="formMes"
                                    value={mesSelecionado} // Variável do estado
                                    onChange={handleMesChange} // Função para atualizar o estado
                                    required
                                    className="w-auto"
                                >
                                    <option value="">Selecione o mês</option>
                                    <option value="Janeiro">Janeiro</option>
                                    <option value="Fevereiro">Fevereiro</option>
                                    <option value="Março">Março</option>
                                    <option value="Abril">Abril</option>
                                    <option value="Maio">Maio</option>
                                    <option value="Junho">Junho</option>
                                    <option value="Julho">Julho</option>
                                    <option value="Agosto">Agosto</option>
                                    <option value="Setembro">Setembro</option>
                                    <option value="Outubro">Outubro</option>
                                    <option value="Novembro">Novembro</option>
                                    <option value="Dezembro">Dezembro</option>
                                </Form.Select>

                                {/* Input de seleção de mês */}
                                <Form.Select
                                    controlId="formAno"
                                    value={anoSelecionado}
                                    onChange={handleAnoChange}
                                    required
                                    className="w-auto"
                                    defaultValue="2025" // Valor padrão
                                >
                                    <option value="2025">2025</option>
                                </Form.Select>

                            </div>
                            <Form.Text className="text-muted">
                                Arquivos permitidos: PDF, DOC, DOCX, ZIP, RAR.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>                    
        <Button
            variant="success"
            onClick={handleAdicionarComprovante}
            disabled={carregando || comprovante.length === 0 || !mesSelecionado}
        >
            {carregando ? "Carregando..." : "Anexar"}
        </Button>
        <Button variant="secondary" onClick={handleCloseModalAddComprovante}>
            Cancelar
        </Button>
    </Modal.Footer>
</Modal>


        </Container>
    );
}
