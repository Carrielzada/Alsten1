import React, { useState, useEffect } from 'react';
import { Table, Card, Badge, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { buscarLogsOrdemServicoPorId } from '../../Services/ordemServicoService';
import { FaEye, FaHistory, FaUser, FaCalendar, FaEdit } from 'react-icons/fa';

const TelaLogsOS = ({ osId, onClose }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [logSelecionado, setLogSelecionado] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const response = await buscarLogsOrdemServicoPorId(osId);
                
                if (response.status) {
                    setLogs(response.logs || []);
                } else {
                    // Se não há logs, não é um erro, apenas não há dados
                    setLogs([]);
                }
            } catch (error) {
                console.error("Erro ao buscar logs:", error);
                // Se a tabela não existe, mostrar mensagem amigável
                if (error.message.includes("doesn't exist")) {
                    setLogs([]);
                } else {
                    toast.error("Erro ao buscar logs da OS");
                }
            } finally {
                setLoading(false);
            }
        };

        if (osId) {
            fetchLogs();
        }
    }, [osId]);

    const handleVerDetalhes = (log) => {
        setLogSelecionado(log);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setLogSelecionado(null);
    };

    const formatarData = (dataString) => {
        return new Date(dataString).toLocaleString('pt-BR');
    };

    const getCampoLabel = (campo) => {
        const labels = {
            'cliente': 'Cliente',
            'modeloEquipamento': 'Modelo do Equipamento',
            'defeitoAlegado': 'Defeito Alegado',
            'numeroSerie': 'Número de Série',
            'fabricante': 'Fabricante',
            'urgencia': 'Urgência',
            'tipoAnalise': 'Tipo de Análise',
            'tipoLacre': 'Tipo de Lacre',
            'tipoLimpeza': 'Tipo de Limpeza',
            'tipoTransporte': 'Tipo de Transporte',
            'formaPagamento': 'Forma de Pagamento',
            'etapa': 'Etapa'
        };
        return labels[campo] || campo;
    };

    if (loading) {
        return (
            <div className="text-center p-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-2">Carregando logs...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>
                    <FaHistory className="me-2" />
                    Histórico de Alterações - OS #{osId}
                </h4>
                <Button variant="secondary" onClick={onClose}>
                    Fechar
                </Button>
            </div>

            {logs.length === 0 ? (
                <Card className="text-center p-4">
                    <Card.Body>
                        <FaHistory className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                        <h5>Nenhuma alteração registrada</h5>
                        <p className="text-muted">
                            Esta Ordem de Serviço ainda não possui alterações registradas.
                        </p>
                    </Card.Body>
                </Card>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>Data/Hora</th>
                            <th>Usuário</th>
                            <th>Campo Alterado</th>
                            <th>Valor Anterior</th>
                            <th>Novo Valor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td>
                                    <FaCalendar className="me-1" />
                                    {formatarData(log.data_alteracao)}
                                </td>
                                <td>
                                    <FaUser className="me-1" />
                                    {log.nome_usuario || 'Usuário não identificado'}
                                </td>
                                <td>
                                    <Badge bg="info">
                                        <FaEdit className="me-1" />
                                        {getCampoLabel(log.campo_alterado)}
                                    </Badge>
                                </td>
                                <td className="text-muted">
                                    {log.valor_anterior || 'N/A'}
                                </td>
                                <td className="text-success fw-bold">
                                    {log.valor_novo || 'N/A'}
                                </td>
                                <td>
                                    <Button 
                                        variant="outline-info" 
                                        size="sm" 
                                        onClick={() => handleVerDetalhes(log)}
                                    >
                                        <FaEye className="me-1" />
                                        Detalhes
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Modal com detalhes do log */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaHistory className="me-2" />
                        Detalhes da Alteração
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {logSelecionado && (
                        <div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Data/Hora:</strong>
                                    <p>{formatarData(logSelecionado.data_alteracao)}</p>
                                </div>
                                <div className="col-md-6">
                                    <strong>Usuário:</strong>
                                    <p>{logSelecionado.nome_usuario || 'Usuário não identificado'}</p>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Campo Alterado:</strong>
                                    <p>{getCampoLabel(logSelecionado.campo_alterado)}</p>
                                </div>
                                <div className="col-md-6">
                                    <strong>ID do Log:</strong>
                                    <p>{logSelecionado.id}</p>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Valor Anterior:</strong>
                                    <p className="text-muted">{logSelecionado.valor_anterior || 'N/A'}</p>
                                </div>
                                <div className="col-md-6">
                                    <strong>Novo Valor:</strong>
                                    <p className="text-success fw-bold">{logSelecionado.valor_novo || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <strong>Descrição:</strong>
                                <p className="text-muted">{logSelecionado.descricao}</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TelaLogsOS; 