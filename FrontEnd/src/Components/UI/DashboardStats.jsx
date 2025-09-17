import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { 
    FaClipboardList, 
    FaCheckCircle, 
    FaUsers, 
    FaClock,
    FaTools,
    FaExclamationTriangle
} from 'react-icons/fa';

const DashboardStats = () => {
    const [stats, setStats] = useState({
        osAtivas: 0,
        osConcluidas: 0,
        clientesAtivos: 0,
        osUrgentes: 0,
        osAndamento: 0,
        osPendentes: 0
    });

    useEffect(() => {
        // Simular dados de estatísticas (em produção, viria da API)
        // Pode ser substituído por chamadas reais da API
        const mockStats = {
            osAtivas: 24,
            osConcluidas: 156,
            clientesAtivos: 89,
            osUrgentes: 5,
            osAndamento: 12,
            osPendentes: 7
        };
        
        // Simular um pequeno delay de carregamento
        setTimeout(() => {
            setStats(mockStats);
        }, 500);
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
        <Col xs={12} sm={6} lg={4} xl={2} className="mb-3">
            <Card className="h-100 border-0 shadow-sm stat-card" style={{ borderLeft: `4px solid var(--bs-${color})` }}>
                <Card.Body className="p-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <div className={`text-${color} fw-bold h4 mb-1`}>{value}</div>
                            <div className="text-muted small fw-medium">{title}</div>
                            {subtitle && (
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{subtitle}</div>
                            )}
                        </div>
                        <Icon size={32} className={`text-${color} opacity-75`} />
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );

    return (
        <>
            <Row className="mb-4">
                <Col>
                    <h5 className="text-muted mb-3">📊 Visão Geral do Sistema</h5>
                </Col>
            </Row>
            <Row>
                <StatCard
                    title="OS Ativas"
                    value={stats.osAtivas}
                    icon={FaClipboardList}
                    color="primary"
                    subtitle="Total em andamento"
                />
                <StatCard
                    title="Concluídas"
                    value={stats.osConcluidas}
                    icon={FaCheckCircle}
                    color="success"
                    subtitle="Este mês"
                />
                <StatCard
                    title="Clientes"
                    value={stats.clientesAtivos}
                    icon={FaUsers}
                    color="info"
                    subtitle="Cadastrados"
                />
                <StatCard
                    title="Urgentes"
                    value={stats.osUrgentes}
                    icon={FaExclamationTriangle}
                    color="danger"
                    subtitle="Alta prioridade"
                />
                <StatCard
                    title="Em Processo"
                    value={stats.osAndamento}
                    icon={FaTools}
                    color="warning"
                    subtitle="Sendo executadas"
                />
                <StatCard
                    title="Pendentes"
                    value={stats.osPendentes}
                    icon={FaClock}
                    color="secondary"
                    subtitle="Aguardando"
                />
            </Row>
            
            <style jsx>{`
                .stat-card {
                    transition: all 0.3s ease;
                }
                
                .stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.12) !important;
                }
            `}</style>
        </>
    );
};

export default DashboardStats;