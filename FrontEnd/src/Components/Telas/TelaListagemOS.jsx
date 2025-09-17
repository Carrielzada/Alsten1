import React, { useState, useEffect } from 'react';
import { Resizable } from 'react-resizable';
import { buscarTodasOrdensServico, consultarOrdemServicoPorId } from '../../Services/ordemServicoService';
import Layout from '../Templates2/Layout';
import { Modal as BootstrapModal, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaEdit, FaHistory, FaPlus, FaIdCard, FaPhone, FaEnvelope, FaSearch, FaTimes } from 'react-icons/fa';
import FormCadOrdemServico from './Formularios/FormCadOrdemServico';
import TelaLogsOS from './TelaLogsOS';
import ClienteInfoModal from '../busca/ClienteInfoModal';

// Ensure you have run: npm install react-resizable
import 'react-resizable/css/styles.css';

// Custom component for the resizable table header
const ResizableHeader = ({ onResize, width, children, ...restProps }) => {
  if (!width) {
    return <th {...restProps}>{children}</th>;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => e.stopPropagation()}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps}>{children}</th>
    </Resizable>
  );
};

const TelaListagemOS = () => {
    const [ordensServico, setOrdensServico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLogsModal, setShowLogsModal] = useState(false);
    const [ordemServicoEmEdicao, setOrdemServicoEmEdicao] = useState(null);
    const [osIdParaLogs, setOsIdParaLogs] = useState(null);
    const [showClienteModal, setShowClienteModal] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [formDirty, setFormDirty] = useState(false);
    const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);
    
    // Estados para paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(25); // Usando 25 itens por página por padrão
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [termoBusca, setTermoBusca] = useState('');

    const [columns, setColumns] = useState([
        { title: 'Ações', width: 65 },
        { title: 'ID AP', width: 80 },
        { title: 'ID ER', width: 80 },
        { title: 'Cliente', width: 200 },
        { title: 'Modelo', width: 200 },
        { title: 'Defeito Alegado', width: 250 },
        { title: 'Técnico', width: 120 },
        { title: 'Etapa', width: 120 },
        { title: 'Cidade', width: 150 },
        { title: 'Nota Fiscal', width: 120 },
        { title: 'Data de entrega', width: 150 },
        { title: 'TP T', width: 80 },
        { title: 'Transporte', width: 120 },
        { title: 'Nível U', width: 100 },
    ]);

    const handleResize = (index) => (e, { size }) => {
        setColumns((prevColumns) => {
            const newColumns = [...prevColumns];
            newColumns[index] = {
                ...newColumns[index],
                width: size.width,
            };
            return newColumns;
        });
    };

    useEffect(() => {
        // Iniciar com a primeira página e poucos itens para carregamento rápido
        fetchOrdensServico(1, itensPorPagina, '');
    }, [itensPorPagina]); // Dependência adicionada para recarregar quando o número de itens por página mudar

    const fetchOrdensServico = async (pagina = paginaAtual, itens = itensPorPagina, termo = termoBusca) => {
        try {
            setLoading(true);
            const data = await buscarTodasOrdensServico(pagina, itens, termo);
            setOrdensServico(data.listaOrdensServico || []);
            
            // Atualizar informações de paginação
            if (data.paginacao) {
                setPaginaAtual(data.paginacao.pagina);
                setTotalPaginas(data.paginacao.totalPaginas);
                setTotalRegistros(data.paginacao.totalRegistros);
            }
            
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditarOS = (osId) => {
        const url = `${window.location.origin}/cadastrar-ordem-servico/${osId}`;
        window.open(url, '_blank');
    };

    const handleVerLogs = (osId) => {
        setOsIdParaLogs(osId);
        setShowLogsModal(true);
    };

    const handleFormSubmit = () => {
        setShowEditModal(false);
        setOrdemServicoEmEdicao(null);
        setFormDirty(false);
        fetchOrdensServico();
    };

    const handleCloseEditModal = () => {
        if (formDirty) {
            setShowConfirmCloseModal(true);
        } else {
            setShowEditModal(false);
            setOrdemServicoEmEdicao(null);
            setFormDirty(false);
        }
    };

    const handleConfirmClose = () => {
        setShowEditModal(false);
        setOrdemServicoEmEdicao(null);
        setFormDirty(false);
        setShowConfirmCloseModal(false);
    };

    const handleCancelClose = () => {
        setShowConfirmCloseModal(false);
    };

    const handleNovaOS = () => {
        setOrdemServicoEmEdicao(null);
        setShowEditModal(true);
        setFormDirty(false);
    };

    const handleVerDetalhesCliente = (cliente) => {
        setClienteSelecionado(cliente);
        setShowClienteModal(true);
    };

    const getEtapaBadge = (etapa) => {
        const badges = {
            'Previsto': 'primary', 'Em Andamento': 'warning',
            'Concluído': 'success', 'Cancelado': 'danger',
            'REPROVADO': 'danger', // Adicione outras etapas conforme necessário
            'SEM CUSTO': 'info'
        };
        return badges[etapa] || 'secondary';
    };

    const getRowClassName = (etapa) => {
        const sanitizedEtapa = (etapa || '').replace(/\s+/g, '-').toLowerCase();
        return `etapa-${sanitizedEtapa}`;
    };

    const formatarDocumento = (documento) => {
        if (!documento) return '';
        
        // Remove caracteres não numéricos
        const numeros = documento.replace(/\D/g, '');
        
        if (numeros.length === 11) {
            // CPF
            return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (numeros.length === 14) {
            // CNPJ
            return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        
        return documento;
    };

    const renderClienteInfo = (cliente) => {
        if (!cliente) return 'Não informado';
        
        const nome = cliente.nome || `Cliente ${cliente.id}`;
        const documento = cliente.numeroDocumento ? formatarDocumento(cliente.numeroDocumento) : '';
        
        // Se temos apenas o ID, mostrar de forma mais simples
        if (!cliente.nome || cliente.nome.startsWith('Cliente ')) {
            return (
                <span
                    className="text-muted cursor-pointer"
                    style={{ textDecoration: 'underline dotted' }}
                    onClick={() => handleVerDetalhesCliente(cliente)}
                    title="Ver detalhes do cliente"
                >
                    <FaIdCard className="me-1" />
                    {nome}
                </span>
            );
        }

        // Se temos dados completos, mostrar nome e documento
        return (
            <span
                className="fw-bold cursor-pointer"
                style={{ textDecoration: 'underline dotted' }}
                onClick={() => handleVerDetalhesCliente(cliente)}
                title="Ver detalhes do cliente"
            >
                {nome}
                {documento && (
                    <small className="text-muted ms-2">
                        <FaIdCard className="me-1" />
                        {documento}
                    </small>
                )}
            </span>
        );
    };

    const renderClienteTooltip = (cliente) => {
        if (!cliente || !cliente.nome || cliente.nome.startsWith('Cliente ')) {
            return (
                <div>
                    <strong>Cliente não encontrado no Bling</strong><br />
                    ID: {cliente?.id || 'N/A'}
                </div>
            );
        }

        return (
            <div>
                <strong>{cliente.nome}</strong><br />
                {cliente.numeroDocumento && (
                    <>
                        <FaIdCard className="me-1" />
                        {formatarDocumento(cliente.numeroDocumento)}<br />
                    </>
                )}
                {cliente.telefone && (
                    <>
                        <FaPhone className="me-1" />
                        {cliente.telefone}<br />
                    </>
                )}
                {cliente.email && (
                    <>
                        <FaEnvelope className="me-1" />
                        {cliente.email}<br />
                    </>
                )}
                {cliente.tipo && (
                    <Badge bg="info" className="mt-1">
                        {cliente.tipo}
                    </Badge>
                )}
            </div>
        );
    };

    // Estilos CSS inline
    const tooltipStyles = {
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    };

    const tooltipHoverStyles = {
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        padding: '2px 4px'
    };

    if (loading) return <Layout>
         <div className="text-center my-5">
             <div className="spinner-border text-primary" role="status">
                 <span className="visually-hidden">Carregando...</span>
             </div>
             <p className="mt-2">Carregando ordens de serviço (página {paginaAtual})...</p>
             <p className="text-muted small">Mostrando {itensPorPagina} registros por página para um equilíbrio entre desempenho e usabilidade</p>
         </div>
     </Layout>;
    if (error) return <Layout><p>Erro ao carregar ordens de serviço: {error}</p></Layout>;

    return (
        <Layout>
            <div className="container-fluid">
                <style>{`
                    /* Resizable handle styles */
                    .resizable-table th {
                        position: relative !important;
                        background-clip: padding-box !important;
                    }
                    .react-resizable-handle {
                        position: absolute;
                        right: 3px;
                        bottom: 0;
                        z-index: 100;
                        width: 10px;
                        height: 100%;
                        cursor: col-resize;
                        /* NEW: Add a visible white line as the handle */
                        border-right: 3px solid rgba(255, 255, 255, 0.3);
                        transition: border-color 0.2s ease-in-out;
                    }
                    .react-resizable-handle:hover,
                    .react-resizable-handle:active {
                        /* Make the line more prominent on hover/drag */
                        border-right-color: rgba(255, 255, 255, 0.8);
                    }

                    /* CORES DAS ETAPAS - aplica em todas as células da linha */
                    .etapa-previsto > td { background-color: #fff !important; }
                    .etapa-recebido > td { background-color: #ffe4ec !important; }
                    .etapa-em-análise > td, .etapa-em-analise > td { background-color: #ffd6d6 !important; }
                    .etapa-analisado > td { background-color: #ff6b6b !important; color: #fff !important; }
                    .etapa-aprovado > td, .etapa-pré-aprovado > td, .etapa-pre-aprovado > td, .etapa-sem-custo > td { background-color: #e3f0ff !important; }
                    .etapa-reprovado > td { background-color: #003366 !important; color: #fff !important; }
                    .etapa-expedição > td, .etapa-expedicao > td { background-color: #fffbe0 !important; }
                    .etapa-despacho > td { background-color: #d4f7d4 !important; }
                    .etapa-aguardando-informação > td, .etapa-aguardando-informacao > td { background-color: #ffe5b4 !important; }

                    /* Custom styles for extra small action buttons */
                    .action-btn {
                        background: transparent;
                        border: none;
                        color: #6c757d;
                        padding: 0.1rem 0.3rem;
                        margin: 0 2px;
                        font-size: 0.85rem;
                        line-height: 1;
                        cursor: pointer;
                        border-radius: 0.2rem;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .action-btn:hover {
                        background-color: #e9ecef;
                        color: #212529;
                    }
                `}</style>
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>
                            <FaEdit className="me-2" />
                            Listagem de Ordens de Serviço
                        </h2>
                        <button className="btn btn-primary btn-sm" onClick={handleNovaOS}>
                            <FaPlus />
                            Nova OS
                        </button>
                    </div>
                    
                    {/* Campo de busca */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Buscar por cliente, modelo ou número de série..."
                                    value={termoBusca}
                                    onChange={(e) => setTermoBusca(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            fetchOrdensServico(1, itensPorPagina, termoBusca);
                                        }
                                    }}
                                />
                                <button 
                                    className="btn btn-outline-secondary btn-sm" 
                                    type="button"
                                    onClick={() => fetchOrdensServico(1, itensPorPagina, termoBusca)}
                                >
                                    <FaSearch />
                                </button>
                                {termoBusca && (
                                    <button 
                                        className="btn btn-outline-danger btn-sm" 
                                        type="button"
                                        onClick={() => {
                                            setTermoBusca('');
                                            fetchOrdensServico(1, itensPorPagina, '');
                                        }}
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 text-end">
                            <span className="text-muted">
                                Total de registros: {totalRegistros}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-hover table-sm resizable-table">
                        <thead className="table-dark">
                            <tr>
                                {columns.map((col, index) => (
                                    <ResizableHeader
                                        key={index}
                                        width={col.width}
                                        onResize={handleResize(index)}
                                    >
                                        {col.title}
                                    </ResizableHeader>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ordensServico.length > 0 ? (
                                ordensServico.map((os) => (
                                    <tr key={os.id} className={getRowClassName(os.etapaId?.nome || os.etapa)}>
                                        <td style={{width: columns[0].width}}>
                                            <div>
                                                <button className="action-btn" onClick={() => handleEditarOS(os.id)} title="Editar OS">
                                                    <FaEdit />
                                                </button>
                                                <button className="action-btn" onClick={() => handleVerLogs(os.id)} title="Ver Histórico">
                                                    <FaHistory />
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{width: columns[1].width}}><strong>#{os.id}</strong></td>
                                        <td style={{width: columns[2].width}}>{os.pedidoCompras || ''}</td>
                                        <td style={{width: columns[3].width}}>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id={`tooltip-${os.id}`}>
                                                        {renderClienteTooltip(os.cliente)}
                                                    </Tooltip>
                                                }
                                            >
                                                <div 
                                                    style={tooltipStyles}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = tooltipHoverStyles.backgroundColor;
                                                        e.target.style.borderRadius = tooltipHoverStyles.borderRadius;
                                                        e.target.style.padding = tooltipHoverStyles.padding;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = '';
                                                        e.target.style.borderRadius = '';
                                                        e.target.style.padding = '';
                                                    }}
                                                >
                                                    {renderClienteInfo(os.cliente)}
                                                </div>
                                            </OverlayTrigger>
                                        </td>
                                        <td style={{width: columns[4].width}}>
                                            {os.modeloEquipamento ? (
                                                typeof os.modeloEquipamento === 'string' ? os.modeloEquipamento :
                                                (os.modeloEquipamento.modelo || `Modelo ${os.modeloEquipamento.id}` || '')
                                            ) : 'Não informado'}
                                        </td>
                                        <td style={{width: columns[5].width}}>
                                            <div className="text-truncate" title={os.defeitoAlegado}>
                                                {os.defeitoAlegado || 'Não informado'}
                                            </div>
                                        </td>
                                        <td style={{width: columns[6].width}}>{os.vendedor?.nome || ''}</td>
                                        <td style={{width: columns[7].width}}>
                                            <Badge bg={getEtapaBadge(os.etapaId?.nome || os.etapa)}>{os.etapaId?.nome || os.etapa || 'Não definida'}</Badge>
                                        </td>
                                        <td style={{width: columns[8].width}}>
                                            {os.cliente && typeof os.cliente === 'object' && os.cliente.cidade ? os.cliente.cidade : ''}
                                        </td>
                                        <td style={{width: columns[9].width}}>{os.notaFiscal || ''}</td>
                                        <td style={{width: columns[10].width}}>
                                            {os.dataEntrega ? new Date(os.dataEntrega).toLocaleDateString() : ''}
                                        </td>
                                        <td style={{width: columns[11].width}}>
  {os.tipoTransporte
    ? (typeof os.tipoTransporte === 'string'
        ? os.tipoTransporte
        : (os.tipoTransporte.tipo_transporte || ''))
    : (os.tipoTransporteTexto || '')}
</td>
                                        <td style={{width: columns[12].width}}>{os.transporteCifFob || ''}</td>
                                        <td style={{width: columns[13].width}}>
                                            {os.urgencia ? (
                                                typeof os.urgencia === 'string' ? os.urgencia :
                                                (os.urgencia.urgencia || '')
                                            ) : ''}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="text-center text-muted">Nenhuma Ordem de Serviço encontrada</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Controles de paginação */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <span className="me-2">Itens por página:</span>
                        <select 
                            className="form-select form-select-sm d-inline-block" 
                            style={{ width: 'auto' }}
                            value={itensPorPagina}
                            onChange={(e) => {
                                const novoItensPorPagina = parseInt(e.target.value);
                                setItensPorPagina(novoItensPorPagina);
                                fetchOrdensServico(1, novoItensPorPagina, termoBusca);
                            }}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    
                    <div className="d-flex align-items-center">
                        <span className="me-3">
                            Mostrando {ordensServico.length} de {totalRegistros} registros
                        </span>
                        <nav aria-label="Navegação de página">
                            <ul className="pagination mb-0">
                                <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => fetchOrdensServico(1)}
                                        disabled={paginaAtual === 1}
                                    >
                                        Primeira
                                    </button>
                                </li>
                                <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => fetchOrdensServico(paginaAtual - 1)}
                                        disabled={paginaAtual === 1}
                                    >
                                        Anterior
                                    </button>
                                </li>
                                
                                {/* Números de página */}
                                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                                    // Lógica para mostrar páginas ao redor da página atual
                                    let pageNum;
                                    if (totalPaginas <= 5) {
                                        pageNum = i + 1;
                                    } else if (paginaAtual <= 3) {
                                        pageNum = i + 1;
                                    } else if (paginaAtual >= totalPaginas - 2) {
                                        pageNum = totalPaginas - 4 + i;
                                    } else {
                                        pageNum = paginaAtual - 2 + i;
                                    }
                                    
                                    return (
                                        <li key={pageNum} className={`page-item ${pageNum === paginaAtual ? 'active' : ''}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={() => fetchOrdensServico(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        </li>
                                    );
                                })}
                                
                                <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => fetchOrdensServico(paginaAtual + 1)}
                                        disabled={paginaAtual === totalPaginas}
                                    >
                                        Próxima
                                    </button>
                                </li>
                                <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => fetchOrdensServico(totalPaginas)}
                                        disabled={paginaAtual === totalPaginas}
                                    >
                                        Última
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Modal de logs */}
                <BootstrapModal show={showLogsModal} onHide={() => setShowLogsModal(false)} size="xl">
                    <BootstrapModal.Header closeButton>
                        <BootstrapModal.Title>Histórico de Alterações - OS #{osIdParaLogs}</BootstrapModal.Title>
                    </BootstrapModal.Header>
                    <BootstrapModal.Body>
                        <TelaLogsOS osId={osIdParaLogs} />
                    </BootstrapModal.Body>
                </BootstrapModal>

                {/* Modal de cadastro de OS (apenas para NOVA OS) */}
                <BootstrapModal show={showEditModal} onHide={handleCloseEditModal} size="xl" backdrop="static" keyboard={false}>
                    <BootstrapModal.Header closeButton>
                        <BootstrapModal.Title>Nova Ordem de Serviço</BootstrapModal.Title>
                    </BootstrapModal.Header>
                    <BootstrapModal.Body>
                        <FormCadOrdemServico
                            onFormSubmit={handleFormSubmit}
                            modoEdicao={false}
                            ordemServicoEmEdicao={null}
                            onDirtyChange={setFormDirty}
                        />
                    </BootstrapModal.Body>
                </BootstrapModal>

                {/* Modal de confirmação de fechamento */}
                <BootstrapModal show={showConfirmCloseModal} onHide={handleCancelClose} centered>
                    <BootstrapModal.Header closeButton>
                        <BootstrapModal.Title>Tem certeza que deseja cancelar?</BootstrapModal.Title>
                    </BootstrapModal.Header>
                    <BootstrapModal.Body>
                        Alterações não salvas serão perdidas.
                    </BootstrapModal.Body>
                    <BootstrapModal.Footer>
                        <button className="btn btn-secondary" onClick={handleCancelClose}>Não</button>
                        <button className="btn btn-danger" onClick={handleConfirmClose}>Sim, cancelar</button>
                    </BootstrapModal.Footer>
                </BootstrapModal>

                {/* Modal de detalhes do cliente */}
                <ClienteInfoModal
                    show={showClienteModal}
                    onHide={() => setShowClienteModal(false)}
                    cliente={clienteSelecionado}
                    title="Detalhes do Cliente"
                />
            </div>
        </Layout>
    );
};

export default TelaListagemOS;
