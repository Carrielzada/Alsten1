import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import './FormCadOrdemServico.css'; // Novo CSS

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
        if (!ordemServico.cliente || !ordemServico.cliente.id) {
            toast.error("Por favor, selecione um cliente do Bling.");
            return;
        }

        try {
            const ordemServicoToSend = {
                ...ordemServico,
                clienteIdBling: ordemServico.cliente.id,
            };

            delete ordemServicoToSend.cliente;

            const response = await gravarOrdemServico(ordemServicoToSend);
            if (response.status) {
                toast.success(response.mensagem);
                setOrdemServico(prev => ({ ...prev, id: response.os_id }));
                if (onFormSubmit) {
                    onFormSubmit();
                }
            } else {
                toast.error(response.mensagem);
            }
        } catch (error) {
            console.error("Erro ao salvar a Ordem de Serviço:", error);
            toast.error("Erro ao salvar a Ordem de Serviço.");
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
        <form className="os-form-container" onSubmit={handleSubmit}>
            <h3 className="os-form-title">{modoEdicao ? 'Editar Ordem de Serviço' : 'Cadastro de Ordem de Serviço'}</h3>

            <div className="os-form-row">
                <div className="os-form-field">
                    <label className="os-form-label" htmlFor="cliente">Cliente:</label>
                    <ClienteSelector
                        onClienteSelect={handleClienteSelect}
                        selectedClienteId={ordemServico.cliente?.id}
                    />
                </div>
                <div className="os-form-field">
                    <label className="os-form-label" htmlFor="modeloEquipamento">Modelo do Equipamento:</label>
                    <CaixaSelecaoPesquisavel
                        dados={modelos}
                        campoChave="id"
                        campoExibir="modelo"
                        valorSelecionado={ordemServico.modeloEquipamento?.id || ''}
                        onChange={handleSelectChange}
                        name="modeloEquipamento"
                    />
                </div>
            </div>

            <div className="os-form-row">
                <div className="os-form-field">
                    <label className="os-form-label" htmlFor="fabricante">Fabricante:</label>
                    <CaixaSelecaoPesquisavel
                        dados={fabricantes}
                        campoChave="id"
                        campoExibir="nome_fabricante"
                        valorSelecionado={ordemServico.fabricante?.id || ''}
                        onChange={handleSelectChange}
                        name="fabricante"
                    />
                </div>
                <div className="os-form-field">
                    <label className="os-form-label" htmlFor="numeroSerie">Número de Série:</label>
                    <input
                        type="text"
                        id="numeroSerie"
                        name="numeroSerie"
                        className="os-form-input"
                        value={ordemServico.numeroSerie}
                        onChange={handleInputChange}
                        placeholder="Número de Série"
                        required
                    />
                </div>
            </div>

            <div className="os-form-row">
                <div className="os-form-field">
                    <label className="os-form-label" htmlFor="defeitoAlegado">Defeito Alegado:</label>
                    <textarea
                        id="defeitoAlegado"
                        name="defeitoAlegado"
                        className="os-form-textarea"
                        value={ordemServico.defeitoAlegado}
                        onChange={handleInputChange}
                        placeholder="Descreva o defeito alegado pelo cliente"
                        rows="3"
                        required
                    />
                </div>
            </div>

            <div className="os-form-row">
                <div className="os-form-field">
                    <label className="os-form-label" htmlFor="urgencia">Nível de Urgência:</label>
                    <CaixaSelecaoPesquisavel
                        dados={urgencias}
                        campoChave="id"
                        campoExibir="urgencia"
                        valorSelecionado={ordemServico.urgencia?.id || ''}
                        onChange={handleSelectChange}
                        name="urgencia"
                    />
                </div>
                <div className="os-form-field">
                    <label className="os-form-label" htmlFor="tipoAnalise">Tipo de Análise:</label>
                    <CaixaSelecaoPesquisavel
                        dados={tiposAnalise}
                        campoChave="id"
                        campoExibir="tipo_analise"
                        valorSelecionado={ordemServico.tipoAnalise?.id || ''}
                        onChange={handleSelectChange}
                        name="tipoAnalise"
                    />
                </div>
            </div>

            <div className="os-form-row">
                <div className="os-form-field">
                    <label className="os-form-label" htmlFor="tipoLacre">Tipo de Lacre:</label>
                    <CaixaSelecaoPesquisavel
                        dados={tiposLacre}
                        campoChave="id"
                        campoExibir="tipo_lacre"
                        valorSelecionado={ordemServico.tipoLacre?.id || ''}
                        onChange={handleSelectChange}
                        name="tipoLacre"
                    />
                </div>
                <div className="os-form-field">
                    <label className="os-form-label" htmlFor="tipoLimpeza">Tipo de Limpeza:</label>
                    <CaixaSelecaoPesquisavel
                        dados={tiposLimpeza}
                        campoChave="id"
                        campoExibir="tipo_limpeza"
                        valorSelecionado={ordemServico.tipoLimpeza?.id || ''}
                        onChange={handleSelectChange}
                        name="tipoLimpeza"
                    />
                </div>
            </div>

            <div className="os-form-row">
                <div className="os-form-field">
                    <label className="os-form-label" htmlFor="tipoTransporte">Tipo de Transporte:</label>
                    <CaixaSelecaoPesquisavel
                        dados={tiposTransporte}
                        campoChave="id"
                        campoExibir="tipo_transporte"
                        valorSelecionado={ordemServico.tipoTransporte?.id || ''}
                        onChange={handleSelectChange}
                        name="tipoTransporte"
                    />
                </div>
                <div className="os-form-field">
                    <label className="os-form-label" htmlFor="formaPagamento">Forma de Pagamento:</label>
                    <CaixaSelecaoPesquisavel
                        dados={formasPagamento}
                        campoChave="id"
                        campoExibir="pagamento"
                        valorSelecionado={ordemServico.formaPagamento?.id || ''}
                        onChange={handleSelectChange}
                        name="formaPagamento"
                    />
                </div>
            </div>

            <div className="os-form-row">
                <div className="os-form-field">
                    <label className="os-form-label" htmlFor="arquivoInput">Anexar Arquivos:</label>
                    <input
                        type="file"
                        id="arquivoInput"
                        name="arquivo"
                        className="os-form-file"
                        onChange={handleFileChange}
                    />
                    <button type="button" onClick={handleAnexarArquivo} disabled={!ordemServico.id} className="os-form-button">
                        Anexar
                    </button>
                    {ordemServico.id ? (
                        <small className="os-form-note">Anexe um arquivo à OS salva.</small>
                    ) : (
                        <small className="os-form-note">Salve a OS primeiro para anexar arquivos.</small>
                    )}
                </div>
            </div>

            {ordemServico.arquivosAnexados.length > 0 && (
                <div className="os-form-row">
                    <ListaArquivosAnexados
                        arquivos={ordemServico.arquivosAnexados}
                        onRemoverArquivo={handleRemoverArquivo}
                    />
                </div>
            )}

            <div className="os-form-actions">
                <button type="submit" className="os-form-button">{modoEdicao ? 'Atualizar' : 'Cadastrar'}</button>
                <button type="button" onClick={resetForm} className="os-form-button secondary">Limpar</button>
            </div>
        </form>
    );
};

export default FormCadOrdemServico;
