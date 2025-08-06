import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Row, Col, Button, Container } from "react-bootstrap";
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
import diasPagamentoService from '../../../Services/diasPagamentoService';
import checklistItemService from '../../../Services/checklistItemService';
import etapaOSService from '../../../Services/etapaOSService';
import servicoPadraoService from '../../../Services/servicoPadraoService';
import { buscarDefeitosAlegados } from '../../../Services/defeitoAlegadoService';
import { consultarUsuarios } from '../../../Services/usersService';
import ListaArquivosAnexados from '../../Visualizacao/ListaArquivosAnexados';
import MobileImageUpload from '../../Visualizacao/MobileImageUpload';
import ClienteSelector from '../../busca/ClienteSelector';
import ClienteSearchAdvanced from '../../busca/ClienteSearchAdvanced';
import '../../busca/ClienteSelector.css';
import './FormCadOrdemServico.css';

// Mapeamento dos campos obrigatórios por etapa (usando nomes exatos do banco de dados)
const obrigatoriosPorEtapa = {
    "PREVISTO": ["cliente", "modeloEquipamento", "defeitoAlegado"],
    "RECEBIDO": ["numeroSerie", "arquivosAnexados", "fabricante", "dataEntrega"],
    "EM ANÁLISE": ["tipoAnalise", "checklistItems", "tipoLimpeza", "defeitoConstatado", "servicoRealizar", "diasReparo", "informacoesConfidenciais"],
    "ANALISADO": ["valor"],
    "AGUARDANDO APROVAÇÃO": ["pedidoCompras", "comprovanteAprovacao", "tipoTransporte", "transporteCifFob"],
    "PRÉ-APROVADO": [],
    "APROVADO": [],
    "REPROVADO": ["comprovanteAprovacao"],
    "AGUARDANDO INFORMAÇÃO": ["comprovanteAprovacao", "pedidoCompras"],
    "SEM CUSTO": [],
    "EXPEDIÇÃO": [],
    "DESPACHO": [],
    "CONCLUÍDO": [],
};

// Lista ordenada das etapas conforme o fluxo do processo
const ordemEtapas = [
    "PREVISTO",
    "RECEBIDO", 
    "EM ANÁLISE",
    "ANALISADO",
    "AGUARDANDO APROVAÇÃO",
    "PRÉ-APROVADO",
    "APROVADO",
    "REPROVADO",
    "AGUARDANDO INFORMAÇÃO",
    "SEM CUSTO",
    "EXPEDIÇÃO",
    "DESPACHO",
    "CONCLUÍDO"
];

// Função utilitária para checar obrigatoriedade dinâmica
function validarCamposObrigatorios(etapa, dados, opcoes = {}) {
    // Obter todas as etapas em ordem para validar campos das etapas anteriores também
    const etapaIndex = ordemEtapas.indexOf(etapa);
    
    // Se a etapa não for encontrada, retornar array vazio (sem validação)
    if (etapaIndex === -1) {
        console.warn('Etapa não encontrada na lista ordenada:', etapa);
        return [];
    }
    
    // Obter campos obrigatórios da etapa atual e de todas as etapas anteriores
    let todosObrigatorios = [];
    
    // Incluir campos da etapa atual e de todas as etapas anteriores
    for (let i = 0; i <= etapaIndex; i++) {
        const etapaAtual = ordemEtapas[i];
        const camposEtapa = obrigatoriosPorEtapa[etapaAtual] || [];
        todosObrigatorios = [...todosObrigatorios, ...camposEtapa];
    }
    
    // Remover duplicatas
    todosObrigatorios = [...new Set(todosObrigatorios)];
    
    const faltando = [];
    
    console.log('Validando etapa:', etapa);
    console.log('Campos obrigatórios para esta etapa e anteriores:', todosObrigatorios);
    
    todosObrigatorios.forEach(campo => {
        console.log(`Validando campo: ${campo}, valor:`, dados[campo]);
        
        // Regras especiais para alguns campos
        if (campo === "arquivosAnexados") {
            if (!dados.arquivosAnexados || dados.arquivosAnexados.length === 0) faltando.push("arquivosAnexados");
        } else if (campo === "checklistItems") {
            if (!dados.checklistItems || dados.checklistItems.length === 0) faltando.push("checklistItems");
        } else if (campo === "enviarOrcamento") {
            if (!opcoes.enviouOrcamento) faltando.push("enviarOrcamento");
        } else if (campo === "conferenciaFotos") {
            if (!opcoes.conferiuFotos) faltando.push("conferenciaFotos");
        } else if (!dados[campo] || (typeof dados[campo] === 'string' && !dados[campo].trim())) {
            faltando.push(campo);
        } else if (campo === "cliente" || campo === "modeloEquipamento" || campo === "fabricante" || 
                   campo === "urgencia" || campo === "tipoAnalise" || campo === "tipoLacre" || 
                   campo === "tipoLimpeza" || campo === "tipoTransporte" || campo === "formaPagamento" ||
                   campo === "etapaId" || campo === "vendedor" || campo === "diasPagamento") {
            // Campos que são objetos
            if (!dados[campo] || dados[campo] === null || dados[campo] === undefined || !dados[campo].id) {
                faltando.push(campo);
            }
        } else if (campo === "valor") {
            // Campo numérico
            if (dados[campo] === null || dados[campo] === undefined || dados[campo] === '' || dados[campo] === 0) {
                faltando.push(campo);
            }
        } else if (campo === "diasReparo") {
            // Campo numérico
            if (!dados[campo] || dados[campo] === null || dados[campo] === undefined || 
                dados[campo].toString().trim() === '' || dados[campo] === 0) {
                faltando.push(campo);
            }
        } else if (campo === "dataEntrega") {
            // Campo de data
            if (!dados[campo] || dados[campo] === null || dados[campo] === undefined || 
                dados[campo].toString().trim() === '') {
                faltando.push(campo);
            }
        } else {
            // Campos de texto normais
            if (!dados[campo] || dados[campo] === null || dados[campo] === undefined || 
                (typeof dados[campo] === 'string' && dados[campo].trim() === '')) {
                faltando.push(campo);
            }
        }
    });
    
    console.log('Campos faltando:', faltando);
    return faltando;
}




const FormCadOrdemServico = ({ onFormSubmit, modoEdicao, ordemServicoEmEdicao, onDirtyChange }) => {
    const [ordemServico, setOrdemServico] = useState({
        id: '',
        cliente: null,
        modeloEquipamento: null,
        defeitoAlegado: '',
        numeroSerie: '',
        fabricante: null,
        urgencia: null,
        tipoAnalise: null,
        tipoLacre: null,
        tipoLimpeza: null,
        tipoTransporte: null,
        formaPagamento: null,
        arquivosAnexados: [],
        etapa: 'PREVISTO',
        // Novos campos
        vendedor: null,
        diasPagamento: null,
        dataEntrega: '',
        dataAprovacaoOrcamento: '',
        diasReparo: '',
        dataEquipamentoPronto: '',
        informacoesConfidenciais: '',
        checklistItems: [],
        agendado: false,
        possuiAcessorio: false,
        tipoTransporteTexto: '',
        transporteCifFob: '',
        pedidoCompras: '',
        defeitoConstatado: '',
        servicoRealizar: '',
        valor: '',
        etapaId: null,
        comprovanteAprovacao: '',
        notaFiscal: ''
    });
    const [dirty, setDirty] = useState(false);
    const [faltandoCampos, setFaltandoCampos] = useState([]);

    // Detecta alterações no formulário
    useEffect(() => {
        if (onDirtyChange) onDirtyChange(dirty);
    }, [dirty, onDirtyChange]);

    // Marca como dirty ao alterar qualquer campo
    const markDirty = () => { if (!dirty) setDirty(true); };

    const [fabricantes, setFabricantes] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [urgencias, setUrgencias] = useState([]);
    const [tiposAnalise, setTiposAnalise] = useState([]);
    const [tiposLacre, setTiposLacre] = useState([]);
    const [tiposLimpeza, setTiposLimpeza] = useState([]);
    const [tiposTransporte, setTiposTransporte] = useState([]);
    const [formasPagamento, setFormasPagamento] = useState([]);
    const [arquivoParaUpload, setArquivoParaUpload] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // Para controlar se pode editar o ID
    
    // Novos estados para os novos campos
    const [vendedores, setVendedores] = useState([]);
    const [diasPagamento, setDiasPagamento] = useState([]);
    const [checklistItems, setChecklistItems] = useState([]);
    const [etapasOS, setEtapasOS] = useState([]);
    const [servicosPadrao, setServicosPadrao] = useState([]);
    const [defeitosPadrao, setDefeitosPadrao] = useState([]);

    useEffect(() => {
        const carregarDadosCadastrais = async () => {
            try {
                const token = localStorage.getItem('token');
                const usuarioLogado = localStorage.getItem('usuarioLogado');
                
                console.log("Token encontrado:", !!token);
                console.log("Usuário logado encontrado:", !!usuarioLogado);
                
                if (!token && !usuarioLogado) {
                    toast.error("Você precisa estar logado para acessar esta página.");
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                    return;
                }

                console.log("Iniciando carregamento de dados...");

                const [
                    fabricantesData,
                    modelosData,
                    urgenciasData,
                    tiposAnaliseData,
                    tiposLacreData,
                    tiposLimpezaData,
                    tiposTransporteData,
                    pagamentosData,
                    vendedoresData,
                    diasPagamentoData,
                    checklistItemsData,
                    etapasOSData,
                    servicosPadraoData,
                    defeitosAlegadosData
                ] = await Promise.all([
                    buscarFabricantes(),
                    buscarModelo(),
                    buscarUrgencia(),
                    buscarTiposAnalise(),
                    buscarTiposLacre(),
                    buscarTiposLimpeza(),
                    buscarTiposTransporte(),
                    buscarPagamento(),
                    consultarUsuarios(),
                    diasPagamentoService.buscarDiasPagamento(),
                    checklistItemService.buscarChecklistItems(),
                    etapaOSService.buscarEtapasOS(),
                    servicoPadraoService.buscarServicosPadrao(),
                    buscarDefeitosAlegados()
                ]);

                console.log("Dados recebidos:", {
                    fabricantesData,
                    modelosData,
                    urgenciasData,
                    tiposAnaliseData,
                    tiposLacreData,
                    tiposLimpezaData,
                    tiposTransporteData,
                    pagamentosData,
                    vendedoresData,
                    diasPagamentoData,
                    checklistItemsData,
                    etapasOSData,
                    servicosPadraoData,
                    defeitosAlegadosData
                });

                setFabricantes(fabricantesData.listaFabricantes);
                setModelos(modelosData.listaModelos);
                setUrgencias(urgenciasData.listaUrgencias);
                setTiposAnalise(tiposAnaliseData.listaTiposAnalise);
                setTiposLacre(tiposLacreData.listaTiposLacre);
                setTiposLimpeza(tiposLimpezaData.listaTiposLimpeza);
                setTiposTransporte(tiposTransporteData.listaTiposTransporte);
                setFormasPagamento(pagamentosData.listaPagamentos);
                setVendedores(vendedoresData.listaUsers || []);
                setDiasPagamento(diasPagamentoData.listaDiasPagamento || []);
                setChecklistItems(checklistItemsData.listaChecklistItems || []);
                setEtapasOS(etapasOSData.listaEtapasOS || []);
                setServicosPadrao(servicosPadraoData.listaServicosPadrao || []);
                setDefeitosPadrao(defeitosAlegadosData.listaDefeitosAlegados || []); // Usando os mesmos dados por enquanto

                console.log("Estados atualizados:", {
                    fabricantes: fabricantesData.listaFabricantes,
                    modelos: modelosData.listaModelos,
                    urgencias: urgenciasData.listaUrgencias,
                    tiposAnalise: tiposAnaliseData.listaTiposAnalise,
                    tiposLacre: tiposLacreData.listaTiposLacre,
                    tiposLimpeza: tiposLimpezaData.listaTiposLimpeza,
                    tiposTransporte: tiposTransporteData.listaTiposTransporte,
                    formasPagamento: pagamentosData.listaPagamentos,
                    vendedores: vendedoresData.listaUsers || [],
                    diasPagamento: diasPagamentoData.listaDiasPagamento || [],
                    checklistItems: checklistItemsData.listaChecklistItems || [],
                    etapasOS: etapasOSData.listaEtapasOS || [],
                    servicosPadrao: servicosPadraoData.listaServicosPadrao || [],
                    defeitosPadrao: defeitosAlegadosData.listaDefeitosAlegados || []
                });

            } catch (error) {
                console.error("Erro ao carregar dados dos cadastros:", error);
                toast.error("Erro ao carregar dados dos cadastros.");
            }
        };

        carregarDadosCadastrais();
    }, []);

    useEffect(() => {
        if (modoEdicao && ordemServicoEmEdicao) {
            // Garantir que campos de texto nunca sejam null ou undefined, mas não sobrescrever se for 0 ou string válida
            const ordemServicoLimpa = {
                ...ordemServicoEmEdicao,
                defeitoAlegado: ordemServicoEmEdicao.defeitoAlegado ?? '',
                numeroSerie: ordemServicoEmEdicao.numeroSerie ?? '',
                dataEntrega: ordemServicoEmEdicao.dataEntrega ?? '',
                dataAprovacaoOrcamento: ordemServicoEmEdicao.dataAprovacaoOrcamento ?? '',
                diasReparo: ordemServicoEmEdicao.diasReparo ?? '',
                dataEquipamentoPronto: ordemServicoEmEdicao.dataEquipamentoPronto ?? '',
                informacoesConfidenciais: ordemServicoEmEdicao.informacoesConfidenciais ?? '',
                tipoTransporteTexto: ordemServicoEmEdicao.tipoTransporteTexto ?? '',
                transporteCifFob: ordemServicoEmEdicao.transporteCifFob ?? '',
                pedidoCompras: ordemServicoEmEdicao.pedidoCompras ?? '',
                defeitoConstatado: ordemServicoEmEdicao.defeitoConstatado ?? '',
                servicoRealizar: ordemServicoEmEdicao.servicoRealizar ?? '',
                valor: ordemServicoEmEdicao.valor ?? '',
                notaFiscal: ordemServicoEmEdicao.notaFiscal ?? '',
                comprovanteAprovacao: ordemServicoEmEdicao.comprovanteAprovacao ?? '',
                // Garante que checklistItems seja sempre array
                checklistItems: Array.isArray(ordemServicoEmEdicao.checklistItems)
                  ? ordemServicoEmEdicao.checklistItems
                  : ordemServicoEmEdicao.checklistItems
                    ? (typeof ordemServicoEmEdicao.checklistItems === 'string'
                        ? JSON.parse(ordemServicoEmEdicao.checklistItems)
                        : [])
                    : []
            };
            setOrdemServico(ordemServicoLimpa);
        }
    }, [modoEdicao, ordemServicoEmEdicao]);

    useEffect(() => {
        // Verificar se o usuário é admin
        const checkAdminStatus = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setIsAdmin(payload.role === 1); // Role 1 = Admin
                } catch (error) {
                    console.error('Erro ao decodificar token:', error);
                }
            }
        };
        checkAdminStatus();
    }, []);

    const handleInputChange = (e) => {
        markDirty();
        const { name, value } = e.target;
        
        // Tratamento especial para campos numéricos
        if (name === 'diasReparo' || name === 'valor') {
            // Se o valor estiver vazio, definir como null para evitar erro de conversão no banco
            const processedValue = value.trim() === '' ? null : value;
            console.log(`Campo ${name} processado: valor original='${value}', processado=${processedValue === null ? 'null' : processedValue}`);
            setOrdemServico(prevState => ({
                ...prevState,
                [name]: processedValue
            }));
        } else {
            setOrdemServico(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleCheckboxChange = (e) => {
        markDirty();
        const { name, checked } = e.target;
        setOrdemServico(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    const handleChecklistChange = (itemId, checked) => {
        markDirty();
        setOrdemServico(prevState => {
            const currentItems = prevState.checklistItems || [];
            if (checked) {
                return {
                    ...prevState,
                    checklistItems: [...currentItems, itemId]
                };
            } else {
                return {
                    ...prevState,
                    checklistItems: currentItems.filter(id => id !== itemId)
                };
            }
        });
    };

    const handleClienteSelect = (clienteBling) => {
        markDirty();
        setOrdemServico(prevState => ({
            ...prevState,
            cliente: clienteBling
        }));
    };

    const handleSelectChange = (e) => {
        markDirty();
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
            case 'vendedor':
                selectedObject = vendedores.find(item => item.id === parseInt(value));
                break;
            case 'diasPagamento':
                selectedObject = diasPagamento.find(item => item.id === parseInt(value));
                break;
            case 'etapaId':
                selectedObject = etapasOS.find(item => item.id === parseInt(value));
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

    // Função de teste para verificar validação
    const testarValidacao = () => {
        const etapaAtual = ordemServico.etapaId?.nome || ordemServico.etapa || 'PREVISTO';
        console.log('=== TESTE DE VALIDAÇÃO ===');
        console.log('Etapa atual:', etapaAtual);
        console.log('Estado completo da OS:', ordemServico);
        
        const faltando = validarCamposObrigatorios(etapaAtual, ordemServico);
        console.log('Campos faltando:', faltando);
        
        if (faltando.length > 0) {
            toast.warning("Campos obrigatórios faltando: " + faltando.join(", "));
        } else {
            toast.success("Todos os campos obrigatórios estão preenchidos!");
        }
    };

    // Função de teste para o sistema de anexos
    const testarAnexos = () => {
        console.log('=== TESTE DE ANEXOS ===');
        console.log('ID da OS:', ordemServico.id);
        console.log('Arquivos anexados:', ordemServico.arquivosAnexados);
        console.log('Arquivo para upload:', arquivoParaUpload);
        
        if (!ordemServico.id) {
            toast.warning("Salve a OS primeiro para testar anexos");
        } else if (!arquivoParaUpload) {
            toast.warning("Selecione um arquivo para testar");
        } else {
            toast.info("Clique em 'Anexar' para testar o upload");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação dinâmica por etapa
        const etapaAtual = ordemServico.etapaId?.nome || ordemServico.etapa || 'PREVISTO';
        console.log('Etapa atual:', etapaAtual);
        
        // Criar uma cópia para validação (mantendo objetos intactos)
        const dadosParaValidacao = JSON.parse(JSON.stringify(ordemServico));
        
        // Validar com os dados originais (antes de processar)
        const faltando = validarCamposObrigatorios(etapaAtual, dadosParaValidacao);
        setFaltandoCampos(faltando); // <-- Salva os campos faltando para destacar
        if (faltando.length > 0) {
            toast.error("Preencha os campos obrigatórios: " + faltando.join(", "));
            return;
        }
        
        // Após validação, preparar dados para envio
        const dadosProcessados = { ...ordemServico };
        
        // Garantir que campos numéricos vazios sejam enviados como null
        if (dadosProcessados.diasReparo === '' || dadosProcessados.diasReparo === undefined) {
            dadosProcessados.diasReparo = null;
            console.log('Campo diasReparo convertido para null antes do envio');
        }
        if (dadosProcessados.valor === '' || dadosProcessados.valor === undefined) {
            dadosProcessados.valor = null;
            console.log('Campo valor convertido para null antes do envio');
        }
        
        // Garantir que o campo fabricante seja enviado apenas como ID
        if (dadosProcessados.fabricante && typeof dadosProcessados.fabricante === 'object') {
            dadosProcessados.fabricante = dadosProcessados.fabricante.id;
            console.log('Campo fabricante convertido para ID antes do envio');
        }
        
        // Garantir que o campo transporteCifFob seja enviado como null se estiver vazio
        // O campo no banco é ENUM('CIF', 'FOB') NULL, então só aceita esses valores ou null
        if (dadosProcessados.transporteCifFob === '' || dadosProcessados.transporteCifFob === undefined) {
            dadosProcessados.transporteCifFob = null;
            console.log('Campo transporteCifFob convertido para null antes do envio');
        }
        
        console.log('Dados da OS processados:', dadosProcessados);

        try {
            const response = await gravarOrdemServico(dadosProcessados);

            if (response.status) {
                toast.success(response.mensagem || "Ordem de Serviço salva com sucesso!");
                // If creating a new OS, update the state with the new ID from the response
                if (response.os_id && !dadosProcessados.id) {
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
            modeloEquipamento: null,
            defeitoAlegado: '',
            numeroSerie: '',
            fabricante: null,
            urgencia: null,
            tipoAnalise: null,
            tipoLacre: null,
            tipoLimpeza: null,
            tipoTransporte: null,
            formaPagamento: null,
            arquivosAnexados: [],
            etapa: 'PREVISTO',
            // Novos campos
            vendedor: null,
            diasPagamento: null,
            dataEntrega: '',
            dataAprovacaoOrcamento: '',
            diasReparo: '',
            dataEquipamentoPronto: '',
            informacoesConfidenciais: '',
            checklistItems: [],
            agendado: false,
            possuiAcessorio: false,
            tipoTransporteTexto: '',
            transporteCifFob: '',
            pedidoCompras: '',
            defeitoConstatado: '',
            servicoRealizar: '',
            valor: '',
            etapaId: null,
            comprovanteAprovacao: '',
            notaFiscal: ''
        });
    };

    // Função para formatar valor como moeda
    const formatarValor = (valor) => {
        if (!valor) return '';
        // Remove tudo que não é número
        const numeros = valor.toString().replace(/\D/g, '');
        // Converte para número e divide por 100 para ter centavos
        const valorNumerico = parseInt(numeros) / 100;
        // Formata como moeda brasileira
        return valorNumerico.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleValorChange = (e) => {
        const { value } = e.target;
        // Remove tudo que não é número
        const numeros = value.replace(/\D/g, '');
        // Permite valor 0
        let valorNumerico = 0;
        if (numeros.length > 0) {
            valorNumerico = parseInt(numeros, 10) / 100;
        }
        setOrdemServico(prevState => ({
            ...prevState,
            valor: valorNumerico
        }));
    };

    // Função utilitária para garantir o formato yyyy-MM-dd para inputs de data
    function toInputDateString(date) {
      if (!date) return '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
      const d = new Date(date);
      if (isNaN(d)) return '';
      return d.toISOString().slice(0, 10);
    }

    return (
        <Container className="p-3 bg-white border rounded shadow-sm mx-auto form-cad-os" style={{ maxWidth: "800px" }}>
            <Form onSubmit={handleSubmit} className="small">
                <h5 className="mb-3 text-center fw-bold">
                    {modoEdicao ? 'Editar Ordem de Serviço' : 'Cadastro de Ordem de Serviço'}
                </h5>
                <hr />

                {/* Linha 1: ID da OS e Vendedor */}
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="id">
                            <Form.Label>ID da Ordem de Serviço</Form.Label>
                            <Form.Control
                                type="text"
                                value={ordemServico.id || ''}
                                readOnly={!isAdmin}
                                disabled={!isAdmin}
                                className={!isAdmin ? 'bg-light' : ''}
                            />
                            {!isAdmin && (
                                <Form.Text className="text-muted">
                                    Apenas administradores podem alterar o ID
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="vendedor">
                            <Form.Label>Vendedor</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={vendedores}
                                campoChave="id"
                                campoExibir="nome"
                                valorSelecionado={ordemServico.vendedor?.id || ''}
                                onChange={handleSelectChange}
                                name="vendedor"
                                style={faltandoCampos.includes('vendedor') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Linha 2: Cliente e Pagamento */}
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="cliente">
                            <Form.Label>Cliente *</Form.Label>
                            <div style={faltandoCampos.includes('cliente') ? { border: '2px solid red', borderRadius: 4, padding: 2 } : {}}>
                                <ClienteSearchAdvanced
                                    onClienteSelect={handleClienteSelect}
                                    selectedCliente={ordemServico.cliente}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formaPagamento">
                            <Form.Label>Pagamento</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={formasPagamento}
                                campoChave="id"
                                campoExibir="pagamento"
                                valorSelecionado={ordemServico.formaPagamento?.id || ''}
                                onChange={handleSelectChange}
                                name="formaPagamento"
                                style={faltandoCampos.includes('formaPagamento') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Linha 3: Data de Entrega */}
                <Row className="mb-3">
                    <Col md={12} sm={12} xs={12}>
                        <Form.Group controlId="dataEntrega">
                            <Form.Label>Data de Entrega</Form.Label>
                            <Form.Control
                                type="date"
                                name="dataEntrega"
                                value={toInputDateString(ordemServico.dataEntrega)}
                                onChange={handleInputChange}
                                style={faltandoCampos.includes('dataEntrega') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Linha 4: Modelo de Equipamento, Número de Série e Fabricante */}
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group controlId="modeloEquipamento">
                            <Form.Label>Modelo do Equipamento</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={modelos}
                                campoChave="id"
                                campoExibir="modelo"
                                valorSelecionado={ordemServico.modeloEquipamento?.id || ''}
                                onChange={handleSelectChange}
                                name="modeloEquipamento"
                                style={faltandoCampos.includes('modeloEquipamento') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="numeroSerie">
                            <Form.Label>Número de Série</Form.Label>
                            <Form.Control
                                type="text"
                                name="numeroSerie"
                                value={ordemServico.numeroSerie || ''}
                                onChange={handleInputChange}
                                style={faltandoCampos.includes('numeroSerie') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="fabricante">
                            <Form.Label>Fabricante</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={fabricantes}
                                campoChave="id"
                                campoExibir="nome_fabricante"
                                valorSelecionado={ordemServico.fabricante?.id || ''}
                                onChange={handleSelectChange}
                                name="fabricante"
                                style={faltandoCampos.includes('fabricante') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Linha 5: Defeito Alegado e Informações Confidenciais */}
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="defeitoAlegado">
                            <Form.Label>Defeito Alegado e Considerações</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="defeitoAlegado"
                                value={ordemServico.defeitoAlegado || ''}
                                onChange={handleInputChange}
                                style={{
                                    height: '100px',
                                    ...(faltandoCampos.includes('defeitoAlegado') ? { border: '2px solid red' } : {})
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="informacoesConfidenciais">
                            <Form.Label>Informações Confidenciais</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="informacoesConfidenciais"
                                style={{ 
                                    height: '100px',
                                    ...(faltandoCampos.includes('informacoesConfidenciais') ? { border: '2px solid red' } : {})
                                }}
                                value={ordemServico.informacoesConfidenciais || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Linha 6: Nível de Urgência, Tipo de Lacre e Tipo de Análise */}
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group controlId="urgencia">
                            <Form.Label>Nível de Urgência</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={urgencias}
                                campoChave="id"
                                campoExibir="urgencia"
                                valorSelecionado={ordemServico.urgencia?.id || ''}
                                onChange={handleSelectChange}
                                name="urgencia"
                                style={faltandoCampos.includes('urgencia') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="tipoLacre">
                            <Form.Label>Tipo de Lacre</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={tiposLacre}
                                campoChave="id"
                                campoExibir="tipo_lacre"
                                valorSelecionado={ordemServico.tipoLacre?.id || ''}
                                onChange={handleSelectChange}
                                name="tipoLacre"
                                style={faltandoCampos.includes('tipoLacre') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="tipoAnalise">
                            <Form.Label>Tipo de Análise</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={tiposAnalise}
                                campoChave="id"
                                campoExibir="tipo_analise"
                                valorSelecionado={ordemServico.tipoAnalise?.id || ''}
                                onChange={handleSelectChange}
                                name="tipoAnalise"
                                style={faltandoCampos.includes('tipoAnalise') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
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
                                style={faltandoCampos.includes('tipoLimpeza') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
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
                                style={faltandoCampos.includes('tipoTransporte') ? { border: '2px solid red' } : {}}
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
                                style={faltandoCampos.includes('arquivosAnexados') ? { border: '2px solid red' } : {}}
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


                {/* Componente Mobile para Upload de Imagens - TEMPORARIAMENTE COMENTADO */}
                {/* 
                <Row className="mb-3">
                    <Col>
                        <MobileImageUpload
                            arquivos={ordemServico.arquivosAnexados}
                            onFileSelect={handleAnexarArquivo}
                            onFileRemove={handleRemoverArquivo}
                            maxFiles={10}
                            acceptedTypes="image/*"
                        />
                    </Col>
                </Row>
                */}

                {/* Campo de anexos original */}
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

                {/* Novos campos adicionados */}
                <Row className="mb-3">
                    <Col md={6} sm={12} xs={12}>
                        <Form.Group controlId="diasPagamento">
                            <Form.Label>Dias de Pagamento</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={diasPagamento}
                                campoChave="id"
                                campoExibir="dias"
                                valorSelecionado={ordemServico.diasPagamento?.id || ''}
                                onChange={handleSelectChange}
                                name="diasPagamento"
                                style={faltandoCampos.includes('diasPagamento') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} sm={12} xs={12}>
                        <Form.Group controlId="dataAprovacaoOrcamento">
                            <Form.Label>Data de Aprovação do Orçamento</Form.Label>
                            <Form.Control
                                type="date"
                                name="dataAprovacaoOrcamento"
                                value={toInputDateString(ordemServico.dataAprovacaoOrcamento)}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="dataEquipamentoPronto">
                            <Form.Label>Data do Equipamento Pronto</Form.Label>
                            <Form.Control
                                type="date"
                                name="dataEquipamentoPronto"
                                value={toInputDateString(ordemServico.dataEquipamentoPronto)}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Linha 10: Dias para o Reparo, Valor e Situação/Etapa */}
                <Row className="mb-3">
                    <Col md={4} sm={12} xs={12}>
                        <Form.Group controlId="diasReparo">
                            <Form.Label>Dias para o Reparo</Form.Label>
                            <Form.Control
                                type="text"
                                name="diasReparo"
                                value={ordemServico.diasReparo || ''}
                                onChange={handleInputChange}
                                placeholder="Ex: 5"
                                style={faltandoCampos.includes('diasReparo') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Form.Group controlId="valor">
                            <Form.Label>Valor</Form.Label>
                            <Form.Control
                                type="number"
                                name="valor"
                                value={ordemServico.valor === 0 || ordemServico.valor ? ordemServico.valor : ''}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                placeholder="0,00"
                                style={faltandoCampos.includes('valor') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4} sm={12} xs={12}>
                        <Form.Group controlId="etapaId">
                            <Form.Label>Situação/Etapa</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={etapasOS}
                                campoChave="id"
                                campoExibir="nome"
                                valorSelecionado={ordemServico.etapaId?.id || ''}
                                onChange={handleSelectChange}
                                name="etapaId"
                                style={faltandoCampos.includes('etapaId') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Linha 7: Checklist, Tipo de Limpeza, Agendado e Possui Acessório */}
                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group controlId="checklist">
                            <Form.Label>Checklist</Form.Label>
                            <div className="border rounded p-2" style={{ maxHeight: '120px', overflowY: 'auto', border: faltandoCampos.includes('checklistItems') ? '2px solid red' : undefined }}>
                                {checklistItems.map((item) => (
                                    <Form.Check
                                        key={item.id}
                                        type="checkbox"
                                        id={`checklist-${item.id}`}
                                        checked={ordemServico.checklistItems?.includes(item.id) || false}
                                        onChange={(e) => handleChecklistChange(item.id, e.target.checked)}
                                        label={item.item}
                                        className="mb-1"
                                        size="sm"
                                    />
                                ))}
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="tipoLimpeza">
                            <Form.Label>Tipo de Limpeza</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={tiposLimpeza}
                                campoChave="id"
                                campoExibir="tipo_limpeza"
                                valorSelecionado={ordemServico.tipoLimpeza?.id || ''}
                                onChange={handleSelectChange}
                                name="tipoLimpeza"
                                style={faltandoCampos.includes('tipoLimpeza') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="agendado">
                            <Form.Label>Agendado?</Form.Label>
                            <Form.Check
                                type="checkbox"
                                name="agendado"
                                checked={ordemServico.agendado}
                                onChange={handleCheckboxChange}
                                label="Marque caso seja sim"
                                className="mt-2"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="possuiAcessorio">
                            <Form.Label>Possui Acessório?</Form.Label>
                            <Form.Check
                                type="checkbox"
                                name="possuiAcessorio"
                                checked={ordemServico.possuiAcessorio}
                                onChange={handleCheckboxChange}
                                label="Marque caso seja sim"
                                className="mt-2"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Linha 8: Tipo de Transporte, Transporte e Pedido de Compras */}
                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group controlId="tipoTransporte">
                            <Form.Label>Tipo de Transporte</Form.Label>
                            <CaixaSelecaoPesquisavel
                                dados={tiposTransporte}
                                campoChave="id"
                                campoExibir="tipo_transporte"
                                valorSelecionado={ordemServico.tipoTransporte?.id || ''}
                                onChange={handleSelectChange}
                                name="tipoTransporte"
                                style={faltandoCampos.includes('tipoTransporte') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="transporteCifFob">
                            <Form.Label>Transporte</Form.Label>
                            <Form.Select
                                name="transporteCifFob"
                                value={ordemServico.transporteCifFob || ''}
                                onChange={handleInputChange}
                                style={faltandoCampos.includes('transporteCifFob') ? { border: '2px solid red' } : {}}
                            >
                                <option value="">Selecione...</option>
                                <option value="CIF">CIF</option>
                                <option value="FOB">FOB</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="pedidoCompras">
                            <Form.Label>Pedido de Compras</Form.Label>
                            <Form.Control
                                type="text"
                                name="pedidoCompras"
                                value={ordemServico.pedidoCompras || ''}
                                onChange={handleInputChange}
                                style={faltandoCampos.includes('pedidoCompras') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="comprovanteAprovacao">
                            <Form.Label>Comprovante de Aprovação</Form.Label>
                            <Form.Control
                                type="text"
                                name="comprovanteAprovacao"
                                value={ordemServico.comprovanteAprovacao || ''}
                                onChange={handleInputChange}
                                style={faltandoCampos.includes('comprovanteAprovacao') ? { border: '2px solid red' } : {}}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Linha 9: Defeito Constatado e Serviço a Realizar */}
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="defeitoConstatado">
                            <Form.Label>Defeito Constatado</Form.Label>
                            <Form.Select
                                name="defeitoPadraoSelect"
                                onChange={(e) => {
                                    const defeitoPadrao = defeitosPadrao.find(d => d.id === parseInt(e.target.value));
                                    if (defeitoPadrao) {
                                        setOrdemServico(prev => ({
                                            ...prev,
                                            defeitoConstatado: defeitoPadrao.defeito
                                        }));
                                    }
                                }}
                                className="mb-2"
                            >
                                <option value="">Escolha um padrão</option>
                                {defeitosPadrao.map((defeito) => (
                                    <option key={defeito.id} value={defeito.id}>
                                        {defeito.titulo}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control
                                as="textarea"
                                name="defeitoConstatado"
                                style={{ height: '80px', ...(faltandoCampos.includes('defeitoConstatado') ? { border: '2px solid red' } : {}) }}
                                value={ordemServico.defeitoConstatado || ''}
                                onChange={handleInputChange}
                                placeholder="Descreva o defeito constatado..."
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="servicoRealizar">
                            <Form.Label>Serviço a Realizar</Form.Label>
                            <Form.Select
                                name="servicoPadraoSelect"
                                onChange={(e) => {
                                    const servicoPadrao = servicosPadrao.find(s => s.id === parseInt(e.target.value));
                                    if (servicoPadrao) {
                                        setOrdemServico(prev => ({
                                            ...prev,
                                            servicoRealizar: servicoPadrao.servico
                                        }));
                                    }
                                }}
                                className="mb-2"
                            >
                                <option value="">Escolha um padrão</option>
                                {servicosPadrao.map((servico) => (
                                    <option key={servico.id} value={servico.id}>
                                        {servico.titulo}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control
                                as="textarea"
                                name="servicoRealizar"
                                style={{ height: '80px', ...(faltandoCampos.includes('servicoRealizar') ? { border: '2px solid red' } : {}) }}
                                value={ordemServico.servicoRealizar || ''}
                                onChange={handleInputChange}
                                placeholder="Descreva o serviço a realizar..."
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Linha 11: Nota Fiscal e Botão Salvar */}
                <Row className="mb-3">
                    <Col md={6} sm={12} xs={12}>
                        <Form.Group controlId="notaFiscal">
                            <Form.Label>Nota Fiscal</Form.Label>
                            <Form.Control
                                type="text"
                                name="notaFiscal"
                                value={ordemServico.notaFiscal || ''}
                                onChange={handleInputChange}
                                placeholder="Número da NF"
                                maxLength="15"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} sm={12} xs={12} className="d-flex align-items-end">
                        <Button 
                            type="submit" 
                            variant="primary" 
                            size="lg"
                            className="w-100"
                        >
                            Salvar Ordem de Serviço
                        </Button>
                    </Col>
                </Row>

                <Row className="mt-3 d-flex justify-content-center">
                    <Col xs="auto">
                        <Button
                            variant="info"
                            size="sm"
                            className="px-3 me-2"
                            onClick={testarValidacao}
                        >
                            Testar Validação
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="px-3"
                            onClick={testarAnexos}
                        >
                            Testar Anexos
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