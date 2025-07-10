import React, { useState, useEffect } from 'react';
import { buscarTodasOrdensServico, consultarOrdemServicoPorId } from '../../Services/ordemServicoService';
import Layout from '../Templates2/Layout';
import { Button, Modal, Badge } from 'react-bootstrap';
import { FaEdit, FaHistory, FaEye, FaPlus } from 'react-icons/fa';
import FormCadOrdemServico from './Formularios/FormCadOrdemServico';
import TelaLogsOS from './TelaLogsOS';

const TelaListagemOS = () => {
    const [ordensServico, setOrdensServico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLogsModal, setShowLogsModal] = useState(false);
    const [ordemServicoEmEdicao, setOrdemServicoEmEdicao] = useState(null);
    const [osIdParaLogs, setOsIdParaLogs] = useState(null);

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
        fetchOrdensServico(); // Recarregar a lista
    };

    const handleNovaOS = () => {
        setOrdemServicoEmEdicao(null);
        setShowEditModal(true);
    };

    const getEtapaBadge = (etapa) => {
        const badges = {
            'Previsto': 'primary',
            'Em Andamento': 'warning',
            'Concluído': 'success',
            'Cancelado': 'danger'
        };
        return badges[etapa] || 'secondary';
    };

    if (loading) return <Layout><p>Carregando ordens de serviço...</p></Layout>;
    if (error) return <Layout><p>Erro ao carregar ordens de serviço: {error}</p></Layout>;

    return (
        <Layout>
            <div className="container-fluid p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Painel de Ordens de Serviço</h2>
                    <Button variant="success" onClick={handleNovaOS}>
                        <FaPlus className="me-1" />
                        Nova Ordem de Serviço
                    </Button>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Modelo</th>
                                <th>Defeito</th>
                                <th>Etapa</th>
                                <th>Data Criação</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(ordensServico) && ordensServico.length > 0 ? ordensServico.map(os => (
                                <tr key={os.id}>
                                    <td>
                                        <strong>#{os.id}</strong>
                                    </td>
                                    <td>
                                        {typeof os.cliente === 'object' && os.cliente ? os.cliente.nome : 
                                         typeof os.cliente === 'string' ? os.cliente : 
                                         'Cliente não informado'}
                                    </td>
                                    <td>
                                        {typeof os.modeloEquipamento === 'object' && os.modeloEquipamento ? os.modeloEquipamento.modelo : 
                                         typeof os.modeloEquipamento === 'string' ? os.modeloEquipamento : 
                                         'Modelo não informado'}
                                    </td>
                                    <td>
                                        <div className="text-truncate" style={{ maxWidth: '200px' }} title={os.defeitoAlegado}>
                                            {os.defeitoAlegado || 'Defeito não informado'}
                                        </div>
                                    </td>
                                    <td>
                                        <Badge bg={getEtapaBadge(os.etapa)}>
                                            {os.etapa || 'Etapa não definida'}
                                        </Badge>
                                    </td>
                                    <td>
                                        {os.dataCriacao ? new Date(os.dataCriacao).toLocaleDateString('pt-BR') : 'Data não informada'}
                                    </td>
                                    <td>
                                        <div className="btn-group" role="group">
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                onClick={() => handleEditarOS(os.id)}
                                                title="Editar OS"
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button 
                                                variant="outline-info" 
                                                size="sm" 
                                                onClick={() => handleVerLogs(os.id)}
                                                title="Ver Histórico"
                                            >
                                                <FaHistory />
                                            </Button>
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm" 
                                                onClick={() => alert(`Detalhes da OS ${os.id}`)}
                                                title="Ver Detalhes"
                                            >
                                                <FaEye />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted">
                                        Nenhuma Ordem de Serviço encontrada
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal para Edição/Criação de OS */}
                <Modal 
                    show={showEditModal} 
                    onHide={() => setShowEditModal(false)} 
                    size="xl"
                    backdrop="static"
                >
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

                {/* Modal para Logs */}
                <Modal 
                    show={showLogsModal} 
                    onHide={() => setShowLogsModal(false)} 
                    size="xl"
                    backdrop="static"
                >
                    <Modal.Body className="p-0">
                        {osIdParaLogs && (
                            <TelaLogsOS 
                                osId={osIdParaLogs} 
                                onClose={() => setShowLogsModal(false)} 
                            />
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </Layout>
    );
};

export default TelaListagemOS;

