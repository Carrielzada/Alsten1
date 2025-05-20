import { Button, FloatingLabel, Container, Row, Col, Form } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import BarraBusca from "../../busca/BarraBusca";
import InputMask from "react-input-mask";
import { ContextoUsuarioLogado } from "../../../App";
import { gravarPublicidadePJ, alterarPublicidadePJ } from "../../../Services/publicidadePJService";
import { FaSave, FaTimes } from "react-icons/fa";
import { buscarTodosClientePJ } from "../../../Services/clientePJService";

export default function FormCadastroPublicidadePJ({
    setExibirTabela,
    setAtualizarTela,
    modoEdicao,
    publicidadeSelecionada,
}) {
    const contextoUsuario = useContext(ContextoUsuarioLogado);
    const [publicidade, setPublicidade] = useState({
        id: "",
        cliente_cnpj: "",
        nome: "",
        canal: "",
        valor: "",
        data_emissao: "",
        data_encerramento: "",
        duracao: "",
        representante1_nome: "",
        representante1_contato: "",
        representante2_nome: "",
        representante2_contato: "",contrato_digital: "",
        arquivos_adicionais: "",
    });
    const [validado, setValidado] = useState(false);
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const token = contextoUsuario.usuarioLogado.token;
        buscarTodosClientePJ(token).then((resposta) => {
            if (resposta.status) {
                setClientes(resposta.listaClientes);
            }
        });
    }, []);

    useEffect(() => {
        if (modoEdicao && publicidadeSelecionada) {
            setPublicidade({
                ...publicidadeSelecionada,
                data_emissao: publicidadeSelecionada.data_emissao
                    ? new Date(publicidadeSelecionada.data_emissao).toISOString().split("T")[0] // Formato YYYY-MM-DD
                    : "",
                data_encerramento: publicidadeSelecionada.data_encerramento
                    ? new Date(publicidadeSelecionada.data_encerramento).toISOString().split("T")[0]
                    : "",
            });
        }
    }, [modoEdicao, publicidadeSelecionada]);

    function manipularMudanca(evento) {
        const { name, value } = evento.target;

        setPublicidade((prev) => {
            const novoEstado = { ...prev, [name]: value };

            if (novoEstado.data_emissao && novoEstado.data_encerramento) {
                const dias = calcularDiferencaDatas(novoEstado.data_emissao, novoEstado.data_encerramento);
                novoEstado.duracao = dias >= 0 ? dias : "";
            }

            return novoEstado;
        });
    }

    const calcularDiferencaDatas = (dataInicio, dataFim) => {
        try {
            const [anoInicio, mesInicio, diaInicio] = dataInicio.split("-"); 
            const [anoFim, mesFim, diaFim] = dataFim.split("-");
            const inicio = new Date(anoInicio, mesInicio - 1, diaInicio);
            const fim = new Date(anoFim, mesFim - 1, diaFim);

            if (isNaN(inicio) || isNaN(fim)) {
                throw new Error("Data inválida");
            }

            const diferenca = (fim - inicio) / (1000 * 60 * 60 * 24); // Diferença em dias
            return Math.round(diferenca);
        } catch (erro) {
            console.error("Erro ao calcular a duração:", erro.message);
            return ""; // Retorna vazio em caso de erro
        }         
    };

    function manipularUpload(evento) {
        const { name, files } = evento.target;

        setPublicidade((prev) => ({
            ...prev,
            [name]: files[0],
        }));
    }

    const manipularSubmissao = (evento) => {
        evento.preventDefault();
        const token = contextoUsuario.usuarioLogado.token;
        const formulario = evento.currentTarget;

        if (formulario.checkValidity()) {
            const formData = new FormData();

            Object.entries(publicidade).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            if (!modoEdicao) {
                gravarPublicidadePJ(formData, token)
                    .then((resposta) => {
                        alert(resposta.mensagem);               
                        if (resposta.status) setExibirTabela(true);
                    })
                    .catch((erro) => alert(erro.message));
            } else {
                alterarPublicidadePJ(formData, token)
                    .then((resposta) => {
                        alert(resposta.mensagem);
                        setAtualizarTela(true);
                        setExibirTabela(true);
                    })
                    .catch((erro) => alert(erro.message));
            }
        } else {
            setValidado(true);
        }
    };

    return (
        <Container>
            <Form noValidate validated={validado} onSubmit={manipularSubmissao} encType="multipart/form-data">
                {!modoEdicao && (
                    <Row className="mb-5 d-flex justify-content-center">
                        <Col md="8">
                            <BarraBusca
                                campoBusca={"nome"}
                                campoChave={"cnpj"}
                                dados={clientes}
                                funcaoSelecao={(cliente) => {
                                    setPublicidade((prev) => ({
                                        ...prev,
                                        cliente_cnpj: cliente.cnpj,
                                    }));
                                }}
                                placeHolder={"Selecione um cliente"}
                                valor={publicidade.clientePJ_cnpj}
                                tokenAcesso={contextoUsuario.usuarioLogado.token}
                            />
                        </Col>
                    </Row>
                 )}
                 {modoEdicao && (
                    <Row className="mb-5 d-flex justify-content-center">
                        <Col md="4">
                            <FloatingLabel controlId="cliente_cnpj" label="CNPJ do Cliente" className="mb-3">
                                <Form.Control
                                    type="text"
                                    value={publicidade.clientePJ_cnpj}
                                    readOnly
                                />
                            </FloatingLabel>
                        </Col>
                        <Col md="4">
                            <FloatingLabel controlId="nome" label="Nome do Cliente" className="mb-3">
                                <Form.Control
                                    type="text"
                                    value={publicidade.cliente_nome}
                                    readOnly
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>
                )}
                <Row className="mb-4">
                    <Col md="6">
                        <FloatingLabel controlId="nome" label="Nome da Publicidade" className="mb-3">
                            <Form.Control
                                required
                                type="text"
                                name="nome"
                                value={publicidade.nome}
                                onChange={manipularMudanca}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor, informe o nome da publicidade!
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                    <Col md="3">
                        <FloatingLabel controlId="canal" label="Canal" className="mb-3">
                            <Form.Control
                                required
                                type="text"
                                name="canal"
                                value={publicidade.canal}
                                onChange={manipularMudanca}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor, informe o canal!
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                    <Col md="3">
                        <FloatingLabel controlId="valor" label="Valor" className="mb-3">
                            <Form.Control
                                required
                                type="number"
                                step="0.01"
                                name="valor"
                                value={publicidade.valor}
                                onChange={manipularMudanca}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor, informe o valor!
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-4"> 
                    <Col md="2">
                        <FloatingLabel controlId="data_emissao" label="Data da Emissão" className="mb-3">
                            <Form.Control
                                required
                                type="date"
                                name="data_emissao"
                                value={publicidade.data_emissao}
                                onChange={manipularMudanca}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor, informe a data de emissão!
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                    <Col md="2">
                        <FloatingLabel controlId="data_encerramento" label="Data do Encerramento" className="mb-3">
                            <Form.Control
                                required
                                type="date"
                                name="data_encerramento"
                                value={publicidade.data_encerramento}
                                onChange={manipularMudanca}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor, informe a data de encerramento!
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                    <Col md="2">
                        <FloatingLabel controlId="duracao" label="Duração (em dias)" className="mb-3">
                            <Form.Control
                                type="text"
                                name="duracao"
                                value={publicidade.duracao}
                                readOnly
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md="3">
                        <FloatingLabel controlId="representante1_nome" label="Nome do Primeiro Representante" className="mb-3">
                            <Form.Control
                                required
                                type="text"
                                name="representante1_nome"
                                value={publicidade.representante1_nome}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md="3">
                        <FloatingLabel controlId="representante1_contato" label="Contato do Primeiro Representante" className="mb-3">
                            <InputMask
                                mask="(99) 99999-9999"
                                name="representante1_contato"
                                value={publicidade.representante1_contato}
                                onChange={manipularMudanca}
                                className="form-control"
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-4">                     
                    
                    <Col md="3">
                        <FloatingLabel controlId="representante2_nome" label="Nome do Segundo Representante" className="mb-3">
                            <Form.Control
                                required
                                type="text"
                                name="representante2_nome"
                                value={publicidade.representante2_nome}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md="3">
                        <FloatingLabel controlId="representante2_contato" label="Contato do Segundo Representante" className="mb-3">
                            <InputMask
                                mask="(99) 99999-9999"
                                name="representante2_contato"
                                value={publicidade.representante2_contato}
                                onChange={manipularMudanca}
                                className="form-control"
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md="3">
                        <FloatingLabel controlId="representante3_nome" label="Nome do Terceiro Representante" className="mb-3">
                            <Form.Control
                                required
                                type="text"
                                name="representante3_nome"
                                value={publicidade.representante3_nome}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md="3">
                        <FloatingLabel controlId="representante3_contato" label="Contato do Terceiro Representante" className="mb-3">
                            <InputMask
                                mask="(99) 99999-9999"
                                name="representante3_contato"
                                value={publicidade.representante3_contato}
                                onChange={manipularMudanca}
                                className="form-control"
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col md="6">
                        <Form.Group controlId="contrato_digital" className="mb-3">
                            <Form.Label>Contrato Digital</Form.Label>
                            <Form.Control
                                type="file"
                                name="contrato_digital"
                                accept=".pdf,.doc,.docx"
                                onChange={manipularUpload}
                            />
                        </Form.Group>
                    </Col>
                    <Col md="6">
                        <Form.Group controlId="arquivos_adicionais" className="mb-3">
                            <Form.Label>Arquivos Adicionais</Form.Label>
                            <Form.Control
                                type="file"
                                name="arquivos_adicionais"
                                accept=".zip,.rar,.pdf,.docx"
                                onChange={manipularUpload}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                {modoEdicao && (
                    <Row className="mb-4">
                        <Col md="6">
                            <h5>Contrato Digital Salvo</h5>
                            <ul>
                                {publicidade.contrato_digital &&
                                    publicidade.contrato_digital.split(",").map((arquivo, index) => (
                                        <li key={index}>
                                            <a href={`URL_DO_SERVIDOR/${arquivo}`} target="_blank" rel="noopener noreferrer">
                                                {arquivo}
                                            </a>
                                        </li>
                                    ))}
                            </ul>
                        </Col>
                        <Col md="6">
                            <h5>Arquivos Adicionais Salvos</h5>
                            <ul>
                                {publicidade.arquivos_adicionais &&
                                    publicidade.arquivos_adicionais.split(",").map((arquivo, index) => (
                                        <li key={index}>
                                            <a href={`URL_DO_SERVIDOR/${arquivo}`} target="_blank" rel="noopener noreferrer">
                                                {arquivo}
                                            </a>
                                        </li>
                                    ))}
                            </ul>
                        </Col>
                    </Row>
                )}

                <Row className="d-flex flex-column align-items-center justify-content-center mt-2 mb-2">
                    <Col md={4} className="d-flex align-items-center justify-content-center">
                        <Button type="submit" className="w-100 me-3">
                            <FaSave className="me-2" />
                            {modoEdicao ? "Alterar" : "Gravar"}
                        </Button>
                        <Button
                            className="w-100"
                            variant="secondary"
                            onClick={() => {
                                setExibirTabela(true);
                            }}
                        >
                            <FaTimes className="me-2" />
                            Cancelar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}
