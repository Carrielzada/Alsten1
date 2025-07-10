import React, { useState, useEffect } from 'react';
import { Resizable } from 'react-resizable';
import { buscarTodasOrdensServico, consultarOrdemServicoPorId } from '../../Services/ordemServicoService';
import Layout from '../Templates2/Layout';
import { Modal, Badge } from 'react-bootstrap';
import { FaEdit, FaHistory, FaPlus } from 'react-icons/fa';
import FormCadOrdemServico from './Formularios/FormCadOrdemServico';
import TelaLogsOS from './TelaLogsOS';

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

    if (loading) return <Layout><p>Carregando ordens de serviço...</p></Layout>;
    if (error) return <Layout><p>Erro ao carregar ordens de serviço: {error}</p></Layout>;

    return (
        <Layout>
            <div className="container-fluid p-3">
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

                    /* Row color styles */
                    .table > tbody > tr.etapa-previsto > td { --bs-table-bg: #FFFFFF; }
                    .table > tbody > tr.etapa-recebido > td { --bs-table-bg: #FFE4E1; }
                    .table > tbody > tr.etapa-em-análise > td { --bs-table-bg: #FFCDD2; }
                    .table > tbody > tr.etapa-analisado > td { --bs-table-bg: #E57373; }
                    .table > tbody > tr.etapa-aprovado > td,
                    .table > tbody > tr.etapa-pré-aprovado > td,
                    .table > tbody > tr.etapa-sem-custo > td { --bs-table-bg: #B3E5FC; }
                    .table > tbody > tr.etapa-reprovado > td { --bs-table-bg: #9FA8DA; }
                    .table > tbody > tr.etapa-expedição > td { --bs-table-bg: #FFF9C4; }
                    .table > tbody > tr.etapa-despacho > td { --bs-table-bg: #C8E6C9; }
                    .table > tbody > tr.etapa-aguardando-informação > td { --bs-table-bg: #FFECB3; }
                    
                    .table-hover > tbody > tr:hover > td {
                        --bs-table-hover-bg: rgba(0, 0, 0, 0.075);
                    }

                    /* Custom style for the "Nova OS" button */
                    .btn-nova-os {
                        background-color: #198754;
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 0.25rem;
                        font-size: 0.9rem;
                        font-weight: 500;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    .btn-nova-os:hover {
                        background-color: #157347;
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

                {/* Responsive Header */}
                <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-4">
                    <h2 className="mb-3 mb-md-0">Painel de Ordens de Serviço</h2>
                    <button className="btn-nova-os" onClick={handleNovaOS}>
                        <FaPlus />
                        <span className="d-none d-sm-inline">Nova Ordem de Serviço</span>
                        <span className="d-inline d-sm-none">Nova OS</span>
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
                            {Array.isArray(ordensServico) && ordensServico.length > 0 ? ordensServico.map(os => (
                                <tr key={os.id} className={getRowClassName(os.etapa)}>
                                    <td style={{width: columns[0].width}}><strong>#{os.id}</strong></td>
                                    <td style={{width: columns[1].width}}></td>
                                    <td style={{width: columns[2].width}}>{typeof os.cliente === 'object' && os.cliente ? os.cliente.nome : os.cliente || 'Não informado'}</td>
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
                            )) : (
                                <tr>
                                    <td colSpan={columns.length} className="text-center text-muted">Nenhuma Ordem de Serviço encontrada</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modals */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="xl" backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>{ordemServicoEmEdicao ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormCadOrdemServico onFormSubmit={handleFormSubmit} modoEdicao={!!ordemServicoEmEdicao} ordemServicoEmEdicao={ordemServicoEmEdicao} />
                    </Modal.Body>
                </Modal>
                <Modal show={showLogsModal} onHide={() => setShowLogsModal(false)} size="xl" backdrop="static">
                    <Modal.Body className="p-0">
                        {osIdParaLogs && <TelaLogsOS osId={osIdParaLogs} onClose={() => setShowLogsModal(false)} />}
                    </Modal.Body>
                </Modal>
            </div>
        </Layout>
    );
};

export default TelaListagemOS;
