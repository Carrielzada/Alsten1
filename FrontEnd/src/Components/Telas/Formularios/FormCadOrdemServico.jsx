import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Removendo importação antiga do Bling
// import CaixaSelecaoAsyncBling from '../../busca/CaixaSelecaoAsyncBling';
import CaixaSelecaoPesquisavel from '../../busca/CaixaSelecaoPesquisavel';
// Removendo importação de serviço de cliente PJ
// import { buscarTodosClientePJ } from '../../../Services/clientePJService';
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
// Removendo importação de getToken, pois não é mais utilizada aqui
// import { getToken } from '../../../Services/authService';

// Importando o novo ClienteSelector com o caminho corrigido
import ClienteSelector from '../../busca/ClienteSelector'; // Caminho corrigido
import '../../busca/ClienteSelector.css'; // Caminho corrigido

const FormCadOrdemServico = ({ onFormSubmit, modoEdicao, ordemServicoEmEdicao }) => {
    const [ordemServico, setOrdemServico] = useState({
        id: '',
        cliente: null, // Agora armazena o objeto completo do cliente do Bling
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

    // Removendo estado de clientes, pois será gerenciado pelo ClienteSelector
    // const [clientes, setClientes] = useState([]);
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
            // const token = getToken(); // Não é mais necessário para buscar clientes
            try {
                // Removendo a busca de clientes PJ, agora o ClienteSelector fará isso
                // const [clientesPJData] = await Promise.all([
                //     buscarTodosClientePJ(token)
                // ]);
                // const todosClientes = [
                //     clientesPJData.listaClientesPJ
                // ];
                // setClientes(todosClientes);

                // Buscando dados dos outros cadastros
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

    // Nova função para lidar com a seleção do cliente do Bling
    const handleClienteSelect = (clienteBling) => {
        setOrdemServico(prevState => ({
            ...prevState,
            cliente: clienteBling // Armazena o objeto completo do cliente do Bling
        }));
    };

    const handleSelectChange = (e) => {
    const { name, value } = e.target;
    let selectedObject = null;

    switch (name) {
        // Removendo o case 'cliente' daqui, pois será tratado por handleClienteSelect
        // case 'cliente':
        //     selectedObject = clientes.find(item => item.id === parseInt(value));
        //     break;
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
                document.getElementById('arquivoInput').value = ''; // Limpa o input file
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
        // Adicione validação para o cliente do Bling
        if (!ordemServico.cliente || !ordemServico.cliente.id) {
            toast.error("Por favor, selecione um cliente do Bling.");
            return;
        }

        try {
            // Adapte o objeto ordemServico para enviar o ID do cliente do Bling
            const ordemServicoToSend = {
                ...ordemServico,
                clienteIdBling: ordemServico.cliente.id, // Envia o ID do cliente do Bling
                // Se precisar enviar outros dados do cliente para o backend, adicione aqui
                // Ex: clienteNomeBling: ordemServico.cliente.nome,
                // clienteDocumentoBling: ordemServico.cliente.documento,
            };
            
            // Remova o objeto cliente completo se seu backend espera apenas o ID
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

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h3>{modoEdicao ? 'Editar Ordem de Serviço' : 'Cadastro de Ordem de Serviço'}</h3>
            
            <div className="input-group">
                <div className="input-field">
                    <label htmlFor="cliente">Cliente:</label>
                    {/* Substituindo CaixaSelecaoAsyncBling pelo ClienteSelector */}
                    <ClienteSelector
                        onClienteSelect={handleClienteSelect}
                        selectedClienteId={ordemServico.cliente?.id} // Passa o ID do cliente selecionado
                    />
                </div>
                <div className="input-field">
                    <label htmlFor="modeloEquipamento">Modelo do Equipamento:</label>
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

            <div className="input-group">
                <div className="input-field">
                    <label htmlFor="fabricante">Fabricante:</label>
                    <CaixaSelecaoPesquisavel 
                        dados={fabricantes} 
                        campoChave="id" 
                        campoExibir="nome_fabricante" 
                        valorSelecionado={ordemServico.fabricante?.id || ''} 
                        onChange={handleSelectChange} 
                        name="fabricante"
                    />
                </div>
                <div className="input-field">
                    <label htmlFor="numeroSerie">Número de Série:</label>
                    <input
                        type="text"
                        id="numeroSerie"
                        name="numeroSerie"
                        value={ordemServico.numeroSerie}
                        onChange={handleInputChange}
                        placeholder="Número de Série"
                        required
                    />
                </div>
            </div>
            
            <div className="input-group">
                <div className="input-field">
                    <label htmlFor="defeitoAlegado">Defeito Alegado:</label>
                    <textarea
                        id="defeitoAlegado"
                        name="defeitoAlegado"
                        value={ordemServico.defeitoAlegado}
                        onChange={handleInputChange}
                        placeholder="Descreva o defeito alegado pelo cliente"
                        rows="3"
                        required
                    />
                </div>
            </div>

            <div className="input-group">
                <div className="input-field">
                    <label htmlFor="urgencia">Nível de Urgência:</label>
                    <CaixaSelecaoPesquisavel 
                        dados={urgencias} 
                        campoChave="id" 
                        campoExibir="urgencia" 
                        valorSelecionado={ordemServico.urgencia?.id || ''} 
                        onChange={handleSelectChange} 
                        name="urgencia"
                    />
                </div>
                <div className="input-field">
                    <label htmlFor="tipoAnalise">Tipo de Análise:</label>
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
            
            <div className="input-group">
                <div className="input-field">
                    <label htmlFor="tipoLacre">Tipo de Lacre:</label>
                    <CaixaSelecaoPesquisavel 
                        dados={tiposLacre} 
                        campoChave="id" 
                        campoExibir="tipo_lacre" 
                        valorSelecionado={ordemServico.tipoLacre?.id || ''} 
                        onChange={handleSelectChange} 
                        name="tipoLacre"
                    />
                </div>
                <div className="input-field">
                    <label htmlFor="tipoLimpeza">Tipo de Limpeza:</label>
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
            
            <div className="input-group">
                <div className="input-field">
                    <label htmlFor="tipoTransporte">Tipo de Transporte:</label>
                    <CaixaSelecaoPesquisavel 
                        dados={tiposTransporte} 
                        campoChave="id" 
                        campoExibir="tipo_transporte" 
                        valorSelecionado={ordemServico.tipoTransporte?.id || ''} 
                        onChange={handleSelectChange} 
                        name="tipoTransporte"
                    />
                </div>
                <div className="input-field">
                    <label htmlFor="formaPagamento">Forma de Pagamento:</label>
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

            <div className="input-group">
                <div className="input-field">
                    <label htmlFor="arquivoInput">Anexar Arquivos:</label>
                    <input
                        type="file"
                        id="arquivoInput"
                        name="arquivo"
                        onChange={handleFileChange}
                    />
                    <button type="button" onClick={handleAnexarArquivo} disabled={!ordemServico.id}>
                        Anexar
                    </button>
                    {ordemServico.id ? (
                        <small>Anexe um arquivo à OS salva.</small>
                    ) : (
                        <small>Salve a OS primeiro para anexar arquivos.</small>
                    )}
                </div>
            </div>

            {ordemServico.arquivosAnexados.length > 0 && (
                <div className="input-group">
                    <ListaArquivosAnexados 
                        arquivos={ordemServico.arquivosAnexados}
                        onRemoverArquivo={handleRemoverArquivo}
                    />
                </div>
            )}

            <div className="action-buttons">
                <button type="submit">{modoEdicao ? 'Atualizar' : 'Cadastrar'}</button>
                <button type="button" onClick={() => setOrdemServico({ id: '', cliente: null, modeloEquipamento: '', defeitoAlegado: '', numeroSerie: '', fabricante: '', urgencia: '', tipoAnalise: '', tipoLacre: '', tipoLimpeza: '', tipoTransporte: '', formaPagamento: '', arquivosAnexados: [], etapa: 'Previsto' })}> 
                    Limpar
                </button>
            </div>
        </form>
    );
};

export default FormCadOrdemServico;

