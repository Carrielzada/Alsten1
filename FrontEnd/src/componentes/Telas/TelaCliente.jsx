import Pagina from "../Templates2/Pagina";
import { Container, Modal, Button, Row, Col, Tabs, Tab } from "react-bootstrap";
import { useContext, useEffect, useState, useRef } from "react";
import { baixarArquivo, buscarComprovantes, baixarComprovante } from "../../servicos/publicidadePJService";
import { ContextoUsuarioLogado } from "../../App";
import { obterPublicidadesCliente, obterPropagandasCliente, obterPropagandasPFCliente } from "../../servicos/clienteService";
import { enviarMensagem } from "../../servicos/mensagemService";
import { FaInfoCircle, FaDownload, FaPen } from "react-icons/fa";

export default function TelaCliente() {
    const contextoUsuario = useContext(ContextoUsuarioLogado);
    const { usuarioLogado } = contextoUsuario;
    const [itens, setItens] = useState([]);
    const [tipoItem, setTipoItem] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedPublicidade, setSelectedPublicidade] = useState(null);
    const [selectedRowId, setSelectedRowId] = useState(null); // ID da linha selecionada
    const [mostrarCamposMensagem, setMostrarCamposMensagem] = useState(false);
    const [mensagem, setMensagem] = useState(""); // Armazena a mensagem digitada
    const [arquivo, setArquivo] = useState(null); // Armazena o arquivo selecionado
    const inputArquivoRef = useRef(null); // Referência para o input de arquivo
    const [activeTab, setActiveTab] = useState(""); // Aba ativa para os comprovantes
    const [comprovantes, setComprovantes] = useState([]);

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

    async function carregarItens() {
        try {
            let response;
            const tipo = usuarioLogado.prop_publ; // Tipo de vínculo
            const idLista = usuarioLogado.id_dados
                ? usuarioLogado.id_dados.split(",").map(Number).filter((num) => !isNaN(num))
                : [];

            const itensVinculados = []; // Armazena as publicidades ou propagandas vinculadas

            switch (tipo) {
                case "publ":
                    for (const id of idLista) {
                        response = await obterPublicidadesCliente(id, usuarioLogado.token);
                        if (response.listaPublicidades) {
                            const publicidade = response.listaPublicidades.find((item) => item.id === id);
                            if (publicidade) itensVinculados.push(publicidade);
                        }
                    }
                    setTipoItem("Publicidade");
                    break;
                case "prop":
                    for (const id of idLista) {
                        response = await obterPropagandasCliente(id, usuarioLogado.token);
                        if (response.listaPropagandas) {
                            const propaganda = response.listaPropagandas.find((item) => item.id === id);
                            if (propaganda) itensVinculados.push(propaganda);
                        }
                    }
                    setTipoItem("PropagandaPJ");
                    break;
                case "propF":
                    for (const id of idLista) {
                        response = await obterPropagandasPFCliente(id, usuarioLogado.token);
                        if (response.listaPropagandas) {
                            const propagandaPF = response.listaPropagandas.find((item) => item.id === id);
                            if (propagandaPF) itensVinculados.push(propagandaPF);
                        }
                    }
                    setTipoItem("PropagandaPF");
                    break;
                default:
                    setItens([]);
                    setTipoItem("");
                    return;
            }

            setItens(itensVinculados);
        } catch (error) {
            console.error("Erro ao carregar itens:", error);
            setItens([]);
        }
    }

    useEffect(() => {
        carregarItens();
    }, [usuarioLogado.id_dados, usuarioLogado.token, usuarioLogado.prop_publ]);

    async function handleShowModal(publicidade) {
        setSelectedPublicidade(publicidade);
        setShowModal(true);

        try {
            const token = contextoUsuario.usuarioLogado.token;
            const resposta = await buscarComprovantes(publicidade.id, token);

            if (resposta.status) {
                const comprovantes = resposta.comprovantes;

                setComprovantes(comprovantes);

                const anos = Object.keys(comprovantes).sort();
                if (anos.length > 0) {
                    const primeiroAno = anos[0];
                    const meses = Object.keys(comprovantes[primeiroAno]).sort(
                        (a, b) => mesesOrdem.indexOf(a) - mesesOrdem.indexOf(b)
                    );
                    setActiveTab(`${primeiroAno}-${meses[0]}`);
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

    function handleCloseModal() {
        setShowModal(false);
        setSelectedPublicidade(null);
        setComprovantes({});
    }

    function handleRowClick(id) {
        setSelectedRowId((prevId) => (prevId === id ? null : id));
    }

    function handleDownloadArquivo(nomeArquivo, cnpj) {
        const token = usuarioLogado.token;
        baixarArquivo(nomeArquivo, cnpj, token).catch((error) => {
            alert("Erro ao baixar o arquivo: " + error.message);
        });
    }

    async function handleEnviarMensagem(e) {
        e.preventDefault();

        if (!mensagem) {
            alert("Por favor, escreva uma mensagem antes de enviar.");
            return;
        }

        if (!selectedRowId) {
            alert("Por favor, selecione uma publicidade antes de enviar a mensagem.");
            return;
        }

        try {
            const token = usuarioLogado.token;
            const publicidadeSelecionada = itens.find((item) => item.id === selectedRowId);

            const formData = new FormData();
            formData.append("user_id", usuarioLogado.id);
            formData.append("referencia_id", selectedRowId);
            formData.append("tipo_referencia", usuarioLogado.prop_publ);
            formData.append("nome_user", usuarioLogado.nome);
            formData.append("cliente_nome", publicidadeSelecionada.cliente_nome);
            formData.append("mensagem", mensagem);
            formData.append("arquivo", arquivo);
            formData.append("status", "Enviada");
            formData.append("data_hora", new Date().toISOString());

            const resposta = await enviarMensagem(formData, token);
            if (resposta.status) {
                alert("Mensagem enviada com sucesso!");
                setMensagem("");
                setArquivo(null);
                setSelectedRowId(null);
                if (inputArquivoRef.current) {
                    inputArquivoRef.current.value = "";
                }
            } else {
                alert(`Erro: ${resposta.mensagem}`);
            }
        } catch (erro) {
            alert(`Erro ao enviar mensagem: ${erro.message}`);
        }
    }

    async function handleDownloadComprovante(nomeArquivo, ano, mes) {
        const token = contextoUsuario.usuarioLogado.token;

        try {
            await baixarComprovante(selectedPublicidade.id, ano, mes, nomeArquivo, token);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <Container className="text-center align-middle" encType="multipart/form-data">
            <Pagina>
                <main>
                    <div className="container mt-2">
                        <h2 className="text-center mb-4">{tipoItem ? `${tipoItem}` : "Itens"} Vinculada</h2>
                        <table className="table table-bordered shadow">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Nome</th>
                                    <th>Canal</th>
                                    <th>Valor mensal</th>
                                    <th>Data Emissão</th>
                                    <th>Data Encerramento</th>
                                    <th>Detalhes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(itens) && itens.length > 0 ? (
                                    itens.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={selectedRowId === item.id ? "table-primary" : ""}
                                            onClick={() => handleRowClick(item.id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td>{item.id}</td>
                                            <td className="text-nowrap">{item.cliente_nome}</td>
                                            <td className="text-nowrap">{item.nome}</td>
                                            <td>{item.canal}</td>
                                            <td>R$ {parseFloat(item.valor).toFixed(2)}</td>
                                            <td>{new Date(item.data_emissao).toLocaleDateString()}</td>
                                            <td>{new Date(item.data_encerramento).toLocaleDateString()}</td>
                                            <td className="text-nowrap">
                                                <FaInfoCircle
                                                    className="text-info"
                                                    style={{ cursor: "pointer", fontSize: "1.2rem", marginLeft: "10px" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShowModal(item);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            Nenhum {tipoItem || "item"} encontrado
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Botão para exibir os campos de mensagem */}
                    <div
                        className="d-flex align-items-center justify-content-between bg-light p-2 rounded shadow mt-5"
                        style={{ cursor: "pointer" }}
                        onClick={() => setMostrarCamposMensagem(!mostrarCamposMensagem)}
                    >
                        <span className="d-flex align-items-center">
                            <FaPen className="text-primary me-2" />
                            <strong>Enviar Mensagem</strong>
                        </span>
                        <span className="text-muted">{mostrarCamposMensagem ? "▲" : "▼"}</span>
                    </div>

                    {/* Formulário para enviar mensagem */}
                    {mostrarCamposMensagem && (
                        <form className="mt-3" onSubmit={handleEnviarMensagem}>
                            <Row>
                                <Col>
                                    <textarea
                                        className="form-control"
                                        placeholder="Digite sua mensagem aqui..."
                                        rows="3"
                                        value={mensagem}
                                        onChange={(e) => setMensagem(e.target.value)}
                                        required
                                    ></textarea>
                                </Col>
                            </Row>
                            <Row className="mt-3 d-flex align-items-center">
                                <Col md={10}>
                                    <input
                                        id="arquivo-input"
                                        type="file"
                                        className="form-control"
                                        ref={inputArquivoRef}
                                        onChange={(e) => setArquivo(e.target.files[0])}
                                        accept=".pdf,.doc,.docx,.zip,.rar"
                                    />
                                </Col>
                                <Col md={2}>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-100"
                                        disabled={!selectedRowId}
                                    >
                                        Enviar
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    )}
                </main>
            </Pagina>

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
                                                                    .replace(/^\d+_/, "")
                                                                    .toLowerCase()} {" "}
                                                            </span>
                                                            <FaDownload
                                                                className="text-success ms-2"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() =>
                                                                    handleDownloadArquivo(
                                                                        arquivo.trim(),
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
        </Container>
    );
}
