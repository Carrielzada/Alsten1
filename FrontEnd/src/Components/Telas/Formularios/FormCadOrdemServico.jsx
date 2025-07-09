import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Row, Col, Button, Container, FormLabel } from "react-bootstrap";
import { FaSave, FaTimes, FaPaperclip } from "react-icons/fa";
import CaixaSelecaoPesquisavel from '../../busca/CaixaSelecaoPesquisavel';
import { buscarFabricantes } from '../../../Services/fabricanteService';
import { buscarModelo } from '../../../Services/modeloService';
import { buscarUrgencia } from '../../../Services/urgenciaService';
import { buscarTiposAnalise } from '../../../Services/tipoAnaliseService';
import { buscarTiposLacre } from '../../../Services/tipoLacreService';
import { buscarTiposLimpeza } from '../../../Services/tipoLimpezaService';
import { buscarTiposTransporte } from '../../../Services/tipoTransporteService';
import { buscarPagamento } from '../../../Services/pagamentoService';
import { gravarOrdemServico, anexarArquivo, removerArquivo } from '../../../Services/ordemServicoService';
import ListaArquivosAnexados from '../../Visualizacao/ListaArquivosAnexados';
import ClienteSelector from '../../busca/ClienteSelector';
import '../../busca/ClienteSelector.css';

const FormCadOrdemServico = ({ onFormSubmit, modoEdicao, ordemServicoEmEdicao }) => {
    const [ordemServico, setOrdemServico] = useState({
        id: '',
        cliente: null,
        modeloEquipamento: '',
        defeitoAlegado: '',
        numeroSerie: '',
        fabricante: '',
        urgencia: '',
        tipoAnalise: '',
        tipoLacre: '',
        tipoLimpeza: '',
        tipoTransporte: '',
        formaPagamento: '',
        arquivosAnexados: [],
        etapa: 'Previsto'
    });

    const [fabricantes, setFabricantes] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [urgencias, setUrgencias] = useState([]);
    const [tiposAnalise, setTiposAnalise] = useState([]);
    const [tiposLacre, setTiposLacre] = useState([]);
    const [tiposLimpeza, setTiposLimpeza] = useState([]);
    const [tiposTransporte, setTiposTransporte] = useState([]);
    const [formasPagamento, setFormasPagamento] = useState([]);
    const [arquivoParaUpload, setArquivoParaUpload] = useState(null);

    useEffect(() => {
        const carregarDadosCadastrais = async () => {
            try {
                const [
                    fabricantesData,
                    modelosData,
                    urgenciasData,
                    tiposAnaliseData,
                    tiposLacreData,
                    tiposLimpezaData,
                    tiposTransporteData,
                    pagamentosData
                ] = await Promise.all([
                    buscarFabricantes(),
                    buscarModelo(),
                    buscarUrgencia(),
                    buscarTiposAnalise(),
                    buscarTiposLacre(),
                    buscarTiposLimpeza(),
                    buscarTiposTransporte(),
                    buscarPagamento()
                ]);

                setFabricantes(fabricantesData.listaFabricantes);
                setModelos(modelosData.listaModelos);
                setUrgencias(urgenciasData.listaUrgencias);
                setTiposAnalise(tiposAnaliseData.listaTiposAnalise);
                setTiposLacre(tiposLacreData.listaTiposLacre);
                setTiposLimpeza(tiposLimpezaData.listaTiposLimpeza);
                setTiposTransporte(tiposTransporteData.listaTiposTransporte);
                setFormasPagamento(pagamentosData.listaPagamentos);
            } catch (error) {
                console.error("Erro ao carregar dados dos cadastros:", error);
                toast.error("Erro ao carregar dados dos cadastros.");
            }
        };

        carregarDadosCadastrais();
    }, []);

    useEffect(() => {
        if (modoEdicao && ordemServicoEmEdicao) {
            setOrdemServico(ordemServicoEmEdicao);
        }
    }, [modoEdicao, ordemServicoEmEdicao]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrdemServico(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleClienteSelect = (clienteBling) => {
        setOrdemServico(prevState => ({
            ...prevState,
            cliente: clienteBling
        }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        let selectedObject = null;

        switch (name) {
            case 'fabricante':
                selectedObject = fabricantes.find(item => item.id === parseInt(value));
                break;
            case 'modeloEquipamento':
                selectedObject = modelos.find(item => item.id === parseInt(value));
                break;
            case 'urgencia':
                selectedObject = urgencias.find(item => item.id === parseInt(value));
                break;
            case 'tipoAnalise':
                selectedObject = tiposAnalise.find(item => item.id === parseInt(value));
                break;
            case 'tipoLacre':
                selectedObject = tiposLacre.find(item => item.id === parseInt(value));
                break;
            case 'tipoLimpeza':
                selectedObject = tiposLimpeza.find(item => item.id === parseInt(value));
                break;
            case 'tipoTransporte':
                selectedObject = tiposTransporte.find(item => item.id === parseInt(value));
                break;
            case 'formaPagamento':
                selectedObject = formasPagamento.find(item => item.id === parseInt(value));
                break;
            default:
                break;
        }

        setOrdemServico(prevState => ({
            ...prevState,
            [name]: selectedObject
        }));
    };

    const handleFileChange = (e) => {
        setArquivoParaUpload(e.target.files[0]);
    };

    const handleAnexarArquivo = async () => {
        if (!ordemServico.id) {
            toast.warn("Por favor, salve a Ordem de Serviço antes de anexar arquivos.");
            return;
        }
        if (!arquivoParaUpload) {
            toast.warn("Selecione um arquivo para anexar.");
            return;
        }

        try {
            const response = await anexarArquivo(ordemServico.id, arquivoParaUpload);
            if (response.status) {
                toast.success(response.mensagem);
                setOrdemServico(prevState => ({
                    ...prevState,
                    arquivosAnexados: [...prevState.arquivosAnexados, response.caminho]
                }));
                setArquivoParaUpload(null);
                document.getElementById('arquivoInput').value = '';
            } else {
                toast.error(response.mensagem);
            }
        } catch (error) {
            console.error("Erro ao anexar arquivo:", error);
            toast.error("Erro ao anexar o arquivo.");
        }
    };

    const handleRemoverArquivo = async (nomeArquivo) => {
        try {
            const sucesso = await removerArquivo(ordemServico.id, nomeArquivo);
            if (sucesso) {
                toast.success("Arquivo removido com sucesso!");
                setOrdemServico(prevState => ({
                    ...prevState,
                    arquivosAnexados: prevState.arquivosAnexados.filter(arq => arq !== nomeArquivo)
                }));
            } else {
                toast.error("Falha ao remover o arquivo.");
            }
        } catch (error) {
            console.error("Erro ao remover arquivo:", error);
            toast.error("Erro ao remover o arquivo.");
        }
    };

        const handleSubmit = async (e) => {
            e.preventDefault();

            // 1. Client-side validation remains the same
            if (!ordemServico.cliente?.id) {
                toast.error("Por favor, selecione um Cliente.");
                return;
            }
            if (!ordemServico.modeloEquipamento?.id) {
                toast.error("Por favor, selecione um Modelo do Equipamento.");
                return;
            }
            if (!ordemServico.defeitoAlegado.trim()) {
                toast.error("Por favor, informe o Defeito Alegado.");
                return;
            }

            try {
                // 2. Simply pass the existing 'ordemServico' state object.
                //    No need to create a new 'payload' object.
                //    Your 'ordemServicoService' will handle stringifying it.
                const response = await gravarOrdemServico(ordemServico);

                if (response.status) {
                    toast.success(response.mensagem);
                    // If creating a new OS, update the state with the new ID from the response
                    if (response.os_id && !ordemServico.id) {
                        setOrdemServico(prev => ({ ...prev, id: response.os_id }));
                    }
                    if (onFormSubmit) {
                        onFormSubmit();
                    }
                } else {
                    toast.error(response.mensagem || "Ocorreu um erro ao salvar a Ordem de Serviço.");
                }
            } catch (error) {
                console.error("Erro ao salvar a Ordem de Serviço:", error);
                toast.error(error.message || "Não foi possível conectar com o servidor.");
            }
        };

    const resetForm = () => {
        setOrdemServico({
            id: '',
            cliente: null,
            modeloEquipamento: '',
            defeitoAlegado: '',
            numeroSerie: '',
            fabricante: '',
            urgencia: '',
            tipoAnalise: '',
            tipoLacre: '',
            tipoLimpeza: '',
            tipoTransporte: '',
            formaPagamento: '',
            arquivosAnexados: [],
            etapa: 'Previsto'
        });
    };

    return (
        <Container className="p-3 bg-white border rounded shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
            <Form onSubmit={handleSubmit} className="small">
                <h5 className="mb-3 text-center fw-bold">
                    {modoEdicao ? 'Editar Ordem de Serviço' : 'Cadastro de Ordem de Serviço'}
                </h5>
                <hr />

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="cliente">
                            <Form.Label>Cliente *</Form.Label>
                            <ClienteSelector
                                onClienteSelect={handleClienteSelect}
                                value={ordemServico.cliente}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="modeloEquipamento">
                            <Form.Label>Modelo do Equipamento</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={modelos}
                                campoChave="id"
                                campoExibir="modelo"
                                valorSelecionado={ordemServico.modeloEquipamento?.id || ''}
                                onChange={handleSelectChange}
                                name="modeloEquipamento"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="fabricante">
                            <Form.Label>Fabricante</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={fabricantes}
                                campoChave="id"
                                campoExibir="nome_fabricante"
                                valorSelecionado={ordemServico.fabricante?.id || ''}
                                onChange={handleSelectChange}
                                name="fabricante"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="numeroSerie">
                            <Form.Label>Número de Série</Form.Label>
                            <Form.Control
                                type="text"
                                name="numeroSerie"
                                value={ordemServico.numeroSerie}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="defeitoAlegado">
                            <Form.Label>Defeito Alegado</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="defeitoAlegado"
                                style={{ height: '100px' }}
                                value={ordemServico.defeitoAlegado}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="urgencia">
                            <Form.Label>Nível de Urgência</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={urgencias}
                                campoChave="id"
                                campoExibir="urgencia"
                                valorSelecionado={ordemServico.urgencia?.id || ''}
                                onChange={handleSelectChange}
                                name="urgencia"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="tipoAnalise">
                            <Form.Label>Tipo de Análise</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={tiposAnalise}
                                campoChave="id"
                                campoExibir="tipo_analise"
                                valorSelecionado={ordemServico.tipoAnalise?.id || ''}
                                onChange={handleSelectChange}
                                name="tipoAnalise"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="tipoLacre">
                            <Form.Label>Tipo de Lacre</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={tiposLacre}
                                campoChave="id"
                                campoExibir="tipo_lacre"
                                valorSelecionado={ordemServico.tipoLacre?.id || ''}
                                onChange={handleSelectChange}
                                name="tipoLacre"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="tipoLimpeza">
                            <Form.Label>Tipo de Limpeza</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={tiposLimpeza}
                                campoChave="id"
                                campoExibir="tipo_limpeza"
                                valorSelecionado={ordemServico.tipoLimpeza?.id || ''}
                                onChange={handleSelectChange}
                                name="tipoLimpeza"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="tipoTransporte">
                            <Form.Label>Tipo de Transporte</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={tiposTransporte}
                                campoChave="id"
                                campoExibir="tipo_transporte"
                                valorSelecionado={ordemServico.tipoTransporte?.id || ''}
                                onChange={handleSelectChange}
                                name="tipoTransporte"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formaPagamento">
                            <Form.Label>Forma de Pagamento</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={formasPagamento}
                                campoChave="id"
                                campoExibir="pagamento"
                                valorSelecionado={ordemServico.formaPagamento?.id || ''}
                                onChange={handleSelectChange}
                                name="formaPagamento"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3 align-items-end">
                    <Col>
                         <Form.Group controlId="arquivoInput">
                            <Form.Label>Anexar Arquivos</Form.Label>
                            <Form.Control
                                type="file"
                                name="arquivo"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs="auto">
                        <Button variant="outline-secondary" onClick={handleAnexarArquivo} disabled={!ordemServico.id} size="sm">
                            <FaPaperclip className="me-1" /> Anexar
                        </Button>
                    </Col>
                </Row>
                 {ordemServico.id ? (
                        <small className="text-muted d-block mb-2">Anexe um arquivo à OS salva.</small>
                    ) : (
                        <small className="text-muted d-block mb-2">Salve a OS primeiro para anexar arquivos.</small>
                )}


                {ordemServico.arquivosAnexados.length > 0 && (
                    <Row className="mb-2">
                        <Col>
                            <ListaArquivosAnexados
                                arquivos={ordemServico.arquivosAnexados}
                                onRemoverArquivo={handleRemoverArquivo}
                            />
                        </Col>
                    </Row>
                )}

                <hr />

                <Row className="mt-3 d-flex justify-content-center">
                    <Col xs="auto">
                        <Button type="submit" size="sm" className="px-3" style={{ backgroundColor: "#191970" }}>
                            <FaSave className="me-1" /> {modoEdicao ? 'Atualizar' : 'Cadastrar'}
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="px-3"
                            onClick={resetForm}
                        >
                            <FaTimes className="me-1" /> Limpar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default FormCadOrdemServico;