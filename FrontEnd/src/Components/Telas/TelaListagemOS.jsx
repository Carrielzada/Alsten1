import React, { useState, useEffect } from 'react';
import { Resizable } from 'react-resizable';
import { buscarTodasOrdensServico, consultarOrdemServicoPorId } from '../../Services/ordemServicoService';
import Layout from '../Templates2/Layout';
import { Modal, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaEdit, FaHistory, FaPlus, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';
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

    const [columns, setColumns] = useState([
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
        { title: 'Ações', width: 65 },
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
        fetchOrdensServico();
    }, []);

    const fetchOrdensServico = async () => {
        try {
            setLoading(true);
            const data = await buscarTodasOrdensServico();
            setOrdensServico(data.listaOrdensServico || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditarOS = async (osId) => {
        try {
            const response = await consultarOrdemServicoPorId(osId);
            if (response) {
                setOrdemServicoEmEdicao(response);
                setShowEditModal(true);
            }
        } catch (error) {
            console.error('Erro ao buscar OS para edição:', error);
        }
    };

    const handleVerLogs = (osId) => {
        setOsIdParaLogs(osId);
        setShowLogsModal(true);
    };

    const handleFormSubmit = () => {
        setShowEditModal(false);
        setOrdemServicoEmEdicao(null);
        fetchOrdensServico();
    };

    const handleNovaOS = () => {
        setOrdemServicoEmEdicao(null);
        setShowEditModal(true);
    };

    const handleVerDetalhesCliente = (cliente) => {
        setClienteSelecionado(cliente);
        setShowClienteModal(true);
    };

    const getEtapaBadge = (etapa) => {
        const badges = {
            'Previsto': 'primary', 'Em Andamento': 'warning',
            'Concluído': 'success', 'Cancelado': 'danger'
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

    if (loading) return <Layout><p>Carregando ordens de serviço...</p></Layout>;
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>
                        <FaEdit className="me-2" />
                        Listagem de Ordens de Serviço
                    </h2>
                    <button className="btn btn-primary" onClick={handleNovaOS}>
                        <FaPlus className="me-2" />
                        Nova OS
                    </button>
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
                                    <tr key={os.id} className={getRowClassName(os.etapa)}>
                                        <td style={{width: columns[0].width}}><strong>#{os.id}</strong></td>
                                        <td style={{width: columns[1].width}}></td>
                                        <td style={{width: columns[2].width}}>
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
                                        <td style={{width: columns[3].width}}>{typeof os.modeloEquipamento === 'object' && os.modeloEquipamento ? os.modeloEquipamento.modelo : os.modeloEquipamento || 'Não informado'}</td>
                                        <td style={{width: columns[4].width}}><div className="text-truncate" title={os.defeitoAlegado}>{os.defeitoAlegado || 'Não informado'}</div></td>
                                        <td style={{width: columns[5].width}}></td>
                                        <td style={{width: columns[6].width}}><Badge bg={getEtapaBadge(os.etapa)}>{os.etapa || 'Não definida'}</Badge></td>
                                        <td style={{width: columns[7].width}}></td>
                                        <td style={{width: columns[8].width}}></td>
                                        <td style={{width: columns[9].width}}></td>
                                        <td style={{width: columns[10].width}}></td>
                                        <td style={{width: columns[11].width}}></td>
                                        <td style={{width: columns[12].width}}></td>
                                        <td style={{width: columns[13].width}}>
                                            <div>
                                                <button className="action-btn" onClick={() => handleEditarOS(os.id)} title="Editar OS">
                                                    <FaEdit />
                                                </button>
                                                <button className="action-btn" onClick={() => handleVerLogs(os.id)} title="Ver Histórico">
                                                    <FaHistory />
                                                </button>
                                            </div>
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

                {/* Modal de edição */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {ordemServicoEmEdicao ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormCadOrdemServico
                            onFormSubmit={handleFormSubmit}
                            modoEdicao={!!ordemServicoEmEdicao}
                            ordemServicoEmEdicao={ordemServicoEmEdicao}
                        />
                    </Modal.Body>
                </Modal>

                {/* Modal de logs */}
                <Modal show={showLogsModal} onHide={() => setShowLogsModal(false)} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>Histórico de Alterações - OS #{osIdParaLogs}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <TelaLogsOS osId={osIdParaLogs} />
                    </Modal.Body>
                </Modal>

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
