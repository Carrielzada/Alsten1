import React, { useState, useEffect } from 'react';
import { Table, Modal, Badge } from 'react-bootstrap';
import Button from '../UI/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { buscarLogsOrdemServico } from '../../Services/ordemServicoService';
import { FaEye, FaHistory, FaUser, FaCalendar, FaEdit } from 'react-icons/fa';

const TelaListagemLogsOS = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [logSelecionado, setLogSelecionado] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const response = await buscarLogsOrdemServico();
                
                if (response.status && response.logs) {
                    setLogs(response.logs);
                } else {
                    setLogs([]);
                }
            } catch (error) {
                console.error("Erro ao buscar logs:", error);
                toast.error("Erro ao buscar logs: " + error.message);
                setLogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

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
            // Campos básicos
            'cliente': 'Cliente',
            'modeloEquipamento': 'Modelo do Equipamento',
            'defeitoAlegado': 'Defeito Alegado',
            'numeroSerie': 'Número de Série',
            'fabricante': 'Fabricante',
            'urgencia': 'Nível de Urgência',
            'tipoAnalise': 'Tipo de Análise',
            'tipoLacre': 'Tipo de Lacre',
            'tipoLimpeza': 'Tipo de Limpeza',
            'tipoTransporte': 'Tipo de Transporte',
            'formaPagamento': 'Forma de Pagamento',
            'etapa': 'Etapa',
            
            // Novos campos
            'vendedor': 'Vendedor',
            'diasPagamento': 'Dias de Pagamento',
            'dataEntrega': 'Data de Entrega',
            'dataAprovacaoOrcamento': 'Data de Aprovação do Orçamento',
            'diasReparo': 'Dias de Reparo',
            'dataEquipamentoPronto': 'Data do Equipamento Pronto',
            'informacoesConfidenciais': 'Informações Confidenciais',
            'checklistItems': 'Itens do Checklist',
            'agendado': 'Agendado',
            'possuiAcessorio': 'Possui Acessório',
            'tipoTransporteTexto': 'Observações do Transporte',
            'transporteCifFob': 'Transporte CIF/FOB',
            'pedidoCompras': 'Pedido de Compras',
            'defeitoConstatado': 'Defeito Constatado',
            'servicoRealizar': 'Serviço a Realizar',
            'valor': 'Valor',
            'etapaId': 'Etapa Atual',
            'comprovanteAprovacao': 'Comprovante de Aprovação',
            'notaFiscal': 'Nota Fiscal',
            'comprovante': 'Comprovante',
            
            // Ações especiais
            'criacao': 'Criação da OS'
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
        <div className="container mt-4">
            <h2>
                <FaHistory className="me-2" />
                Listagem de Logs de Ordem de Serviço
            </h2>
            
            {logs.length === 0 ? (
                <div className="text-center p-4">
                    <FaHistory className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                    <h5>Nenhum log encontrado</h5>
                    <p className="text-muted">
                        Não há logs de alterações registrados no sistema.
                    </p>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>Data/Hora</th>
                            <th>OS ID</th>
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
                                    <Badge bg="primary">#{log.ordem_servico_id}</Badge>
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
                                <div className="col-12 col-md-6">
                                    <strong>Data/Hora:</strong>
                                    <p>{formatarData(logSelecionado.data_alteracao)}</p>
                                </div>
                                <div className="col-12 col-md-6">
                                    <strong>Usuário:</strong>
                                    <p>{logSelecionado.nome_usuario || 'Usuário não identificado'}</p>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-12 col-md-6">
                                    <strong>OS ID:</strong>
                                    <p>{logSelecionado.ordem_servico_id}</p>
                                </div>
                                <div className="col-12 col-md-6">
                                    <strong>ID do Log:</strong>
                                    <p>{logSelecionado.id}</p>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-12 col-md-6">
                                    <strong>Campo Alterado:</strong>
                                    <p>{getCampoLabel(logSelecionado.campo_alterado)}</p>
                                </div>
                                <div className="col-12 col-md-6">
                                    <strong>Campo Original:</strong>
                                    <p>{logSelecionado.campo_alterado}</p>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-12 col-md-6">
                                    <strong>Valor Anterior:</strong>
                                    <p className="text-muted">{logSelecionado.valor_anterior || 'N/A'}</p>
                                </div>
                                <div className="col-12 col-md-6">
                                    <strong>Novo Valor:</strong>
                                    <p className="text-success fw-bold">{logSelecionado.valor_novo || 'N/A'}</p>
                                </div>
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

export default TelaListagemLogsOS;


