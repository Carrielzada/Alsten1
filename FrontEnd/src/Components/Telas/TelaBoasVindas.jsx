import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaBoxOpen, FaCheckCircle, FaCog, FaUser, FaChartLine, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Layout from '../Templates2/Layout';
import './TelaBoasVindas.css';

const TelaBoasVindas = () => {
    const navigate = useNavigate();

    const funcionalidades = [
        {
            icon: <FaBoxOpen className="feature-icon" />,
            title: "Ordens de Serviço",
            description: "Gerencie todas as ordens de serviço do sistema. Crie, edite e acompanhe o status de cada OS.",
            action: "Gerenciar OS",
            path: "/ordens-servico",
            color: "primary"
        },
        {
            icon: <FaCheckCircle className="feature-icon" />,
            title: "OS Concluídas",
            description: "Visualize e consulte todas as ordens de serviço que foram concluídas com filtros avançados.",
            action: "Ver Concluídas",
            path: "/os-concluidas",
            color: "success"
        },
        {
            icon: <FaCog className="feature-icon" />,
            title: "Cadastros",
            description: "Configure todos os dados cadastrais do sistema: clientes, equipamentos, tipos de serviço e muito mais.",
            action: "Configurar",
            path: "/cadastros/modelo-equipamento",
            color: "info"
        },
        {
            icon: <FaUser className="feature-icon" />,
            title: "Sua Conta",
            description: "Gerencie suas informações pessoais, altere senha e configure preferências da sua conta.",
            action: "Minha Conta",
            path: "/sua-conta",
            color: "warning"
        }
    ];

    const estatisticas = [
        {
            icon: <FaChartLine className="stat-icon" />,
            title: "OS Ativas",
            value: "0",
            description: "Ordens em andamento"
        },
        {
            icon: <FaCheckCircle className="stat-icon" />,
            title: "OS Concluídas",
            value: "0",
            description: "Total finalizadas"
        },
        {
            icon: <FaFileAlt className="stat-icon" />,
            title: "Documentos",
            value: "0",
            description: "Arquivos anexados"
        }
    ];

    return (
        <Layout>
            <Container fluid className="boas-vindas-container">
                {/* Cabeçalho de Boas-vindas */}
                <Row className="mb-5">
                    <Col>
                        <div className="welcome-header text-center">
                            <h1 className="welcome-title">
                                Bem-vindo ao Sistema de Gestão de Ordens de Serviço
                            </h1>
                            <p className="welcome-subtitle">
                                Gerencie suas ordens de serviço de forma eficiente e organizada
                            </p>
                        </div>
                    </Col>
                </Row>

                {/* Estatísticas Rápidas */}
                <Row className="mb-5">
                    <Col>
                        <h3 className="section-title mb-4">
                            <FaChartLine className="me-2" />
                            Visão Geral
                        </h3>
                    </Col>
                </Row>
                <Row className="mb-5">
                    {estatisticas.map((stat, index) => (
                        <Col md={4} key={index} className="mb-3">
                            <Card className="stat-card h-100">
                                <Card.Body className="text-center">
                                    <div className="stat-icon-container">
                                        {stat.icon}
                                    </div>
                                    <h4 className="stat-value">{stat.value}</h4>
                                    <h6 className="stat-title">{stat.title}</h6>
                                    <p className="stat-description">{stat.description}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Funcionalidades Principais */}
                <Row className="mb-5">
                    <Col>
                        <h3 className="section-title mb-4">
                            <FaCog className="me-2" />
                            Funcionalidades Principais
                        </h3>
                    </Col>
                </Row>
                <Row>
                    {funcionalidades.map((feature, index) => (
                        <Col md={6} lg={3} key={index} className="mb-4">
                            <Card className={`feature-card h-100 border-${feature.color}`}>
                                <Card.Body className="text-center">
                                    <div className={`feature-icon-container bg-${feature.color}`}>
                                        {feature.icon}
                                    </div>
                                    <h5 className="feature-title">{feature.title}</h5>
                                    <p className="feature-description">{feature.description}</p>
                                    <Button 
                                        variant={feature.color}
                                        onClick={() => navigate(feature.path)}
                                        className="feature-button"
                                    >
                                        {feature.action}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Acesso Rápido */}
                <Row className="mt-5">
                    <Col>
                        <Card className="quick-access-card">
                            <Card.Header>
                                <h4 className="mb-0">
                                    <FaBoxOpen className="me-2" />
                                    Acesso Rápido
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Button 
                                            variant="primary" 
                                            size="lg" 
                                            className="w-100 quick-access-btn"
                                            onClick={() => navigate('/cadastrar-ordem-servico')}
                                        >
                                            <FaBoxOpen className="me-2" />
                                            Nova Ordem de Serviço
                                        </Button>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Button 
                                            variant="outline-primary" 
                                            size="lg" 
                                            className="w-100 quick-access-btn"
                                            onClick={() => navigate('/ordens-servico')}
                                        >
                                            <FaChartLine className="me-2" />
                                            Ver Todas as OS
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Informações do Sistema */}
                <Row className="mt-5">
                    <Col>
                        <Card className="info-card">
                            <Card.Body>
                                <h5 className="info-title">Sobre o Sistema</h5>
                                <p className="info-text">
                                    Este sistema foi desenvolvido para facilitar o gerenciamento de ordens de serviço, 
                                    permitindo o controle completo do fluxo de trabalho desde a criação até a conclusão 
                                    de cada ordem. Com funcionalidades avançadas de filtros, relatórios e integração 
                                    com sistemas externos, você pode trabalhar de forma mais eficiente e organizada.
                                </p>
                                <div className="info-features">
                                    <div className="info-feature">
                                        <strong>✓</strong> Controle completo de ordens de serviço
                                    </div>
                                    <div className="info-feature">
                                        <strong>✓</strong> Sistema de anexos e comprovantes
                                    </div>
                                    <div className="info-feature">
                                        <strong>✓</strong> Filtros avançados e relatórios
                                    </div>
                                    <div className="info-feature">
                                        <strong>✓</strong> Integração com sistemas externos
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default TelaBoasVindas;