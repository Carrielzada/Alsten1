import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { 
    FaUsers, FaCogs, FaIndustry, FaWrench, 
    FaShippingFast, FaTruck, FaExclamationTriangle, FaVial, 
    FaBroom, FaUserShield, FaCreditCard, FaPlus 
} from 'react-icons/fa';
// Layout será fornecido pelo LayoutModerno - não importar aqui
import CardCadastro from '../Cards/CardCadastro';
import { ContextoUsuarioLogado } from '../../App';

const TelaCadastros = () => {
    const { usuarioLogado } = useContext(ContextoUsuarioLogado);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Verificar se é admin (role 1)
        setIsAdmin(usuarioLogado?.role === 1);
    }, [usuarioLogado]);

    const cadastrosEssenciais = [
        {
            titulo: "Nova Ordem de Serviço",
            descricao: "Criar uma nova ordem de serviço completa",
            icon: FaPlus,
            rota: "/cadastrar-ordem-servico",
            destaque: true,
            cor: "success"
        }
    ];

    const cadastrosClientes = [
        {
            titulo: "Clientes",
            descricao: "Cadastro e gestão de clientes PF e PJ",
            icon: FaUsers,
            rota: "/cadastros/clientes",
            cor: "info"
        }
    ];

    const cadastrosEquipamentos = [
        {
            titulo: "Modelos de Equipamento",
            descricao: "Cadastrar modelos de equipamentos",
            icon: FaCogs,
            rota: "/cadastros/modelo-equipamento",
            cor: "primary"
        },
        {
            titulo: "Fabricantes",
            descricao: "Gerenciar fabricantes de equipamentos",
            icon: FaIndustry,
            rota: "/cadastros/fabricante",
            cor: "dark"
        },
        {
            titulo: "Defeitos Alegados",
            descricao: "Padrões de defeitos relatados pelos clientes",
            icon: FaExclamationTriangle,
            rota: "/cadastros/defeito-alegado",
            cor: "warning"
        }
    ];

    const cadastrosProcessos = [
        {
            titulo: "Tipos de Análise",
            descricao: "Definir tipos de análise técnica",
            icon: FaVial,
            rota: "/cadastros/tipo-analise",
            cor: "info"
        },
        {
            titulo: "Tipos de Lacre",
            descricao: "Configurar tipos de lacres utilizados",
            icon: FaWrench,
            rota: "/cadastros/tipo-lacre",
            cor: "secondary"
        },
        {
            titulo: "Tipos de Limpeza",
            descricao: "Definir procedimentos de limpeza",
            icon: FaBroom,
            rota: "/cadastros/tipo-limpeza",
            cor: "primary"
        },
        {
            titulo: "Tipos de Transporte",
            descricao: "Gerenciar modalidades de transporte",
            icon: FaTruck,
            rota: "/cadastros/tipo-transporte",
            cor: "secondary"
        },
        {
            titulo: "Serviços Padrão",
            descricao: "Templates de serviços realizados",
            icon: FaCogs,
            rota: "/cadastros/servico-realizado",
            cor: "success"
        }
    ];

    const cadastrosComerciais = [
        {
            titulo: "Formas de Pagamento",
            descricao: "Configurar métodos de pagamento",
            icon: FaCreditCard,
            rota: "/cadastros/pagamento",
            cor: "success"
        },
        {
            titulo: "Níveis de Urgência",
            descricao: "Configurar prioridades de atendimento",
            icon: FaShippingFast,
            rota: "/cadastros/urgencia",
            cor: "danger"
        }
    ];

    const cadastrosAdmin = [
        {
            titulo: "Usuários do Sistema",
            descricao: "Gerenciar usuários e permissões",
            icon: FaUserShield,
            rota: "/admin/usuarios",
            cor: "danger"
        }
    ];

    return (
        <Container fluid className="py-4">
                {/* Cabeçalho */}
                <Row className="mb-4">
                    <Col>
                        <Card className="border-0 shadow-sm bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <Card.Body className="py-4 text-white">
                                <div className="text-center">
                                    <FaCogs size={48} className="mb-3" />
                                    <h2 className="fw-bold mb-2">Central de Cadastros</h2>
                                    <p className="lead mb-0">
                                        Gerencie todos os cadastros do sistema de forma organizada e eficiente
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Cadastros Essenciais */}
                <Row className="mb-5">
                    <Col>
                        <h4 className="fw-bold text-success mb-3 d-flex align-items-center">
                            <FaPlus className="me-2" />
                            Ação Rápida
                        </h4>
                        <Row>
                            {cadastrosEssenciais.map((cadastro, index) => (
                                <Col xl={4} lg={6} md={8} sm={10} xs={12} className="mb-4 mx-auto" key={index}>
                                    <CardCadastro {...cadastro} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                {/* Cadastros de Clientes */}
                <Row className="mb-5">
                    <Col>
                        <h4 className="fw-bold text-info mb-3 d-flex align-items-center">
                            <FaUsers className="me-2" />
                            Clientes
                        </h4>
                        <Row>
                            {cadastrosClientes.map((cadastro, index) => (
                                <Col xl={3} lg={4} md={6} sm={6} xs={12} className="mb-4" key={index}>
                                    <CardCadastro {...cadastro} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                {/* Cadastros de Equipamentos */}
                <Row className="mb-5">
                    <Col>
                        <h4 className="fw-bold text-primary mb-3 d-flex align-items-center">
                            <FaCogs className="me-2" />
                            Equipamentos
                        </h4>
                        <Row>
                            {cadastrosEquipamentos.map((cadastro, index) => (
                                <Col xl={3} lg={4} md={6} sm={6} xs={12} className="mb-4" key={index}>
                                    <CardCadastro {...cadastro} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                {/* Cadastros de Processos */}
                <Row className="mb-5">
                    <Col>
                        <h4 className="fw-bold text-secondary mb-3 d-flex align-items-center">
                            <FaWrench className="me-2" />
                            Processos Técnicos
                        </h4>
                        <Row>
                            {cadastrosProcessos.map((cadastro, index) => (
                                <Col xl={3} lg={4} md={6} sm={6} xs={12} className="mb-4" key={index}>
                                    <CardCadastro {...cadastro} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                {/* Cadastros Comerciais */}
                <Row className="mb-5">
                    <Col>
                        <h4 className="fw-bold text-success mb-3 d-flex align-items-center">
                            <FaCreditCard className="me-2" />
                            Configurações Comerciais
                        </h4>
                        <Row>
                            {cadastrosComerciais.map((cadastro, index) => (
                                <Col xl={3} lg={4} md={6} sm={6} xs={12} className="mb-4" key={index}>
                                    <CardCadastro {...cadastro} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                {/* Cadastros Administrativos (apenas para Admin) */}
                {isAdmin && (
                    <Row className="mb-4">
                        <Col>
                            <h4 className="fw-bold text-danger mb-3 d-flex align-items-center">
                                <FaUserShield className="me-2" />
                                Administração do Sistema
                            </h4>
                            <Alert variant="danger" className="mb-3">
                                <strong>🔒 Área Restrita:</strong> Apenas administradores têm acesso a estas funcionalidades críticas.
                            </Alert>
                            <Row>
                                {cadastrosAdmin.map((cadastro, index) => (
                                    <Col xl={3} lg={4} md={6} sm={8} xs={12} className="mb-4 mx-auto" key={index}>
                                        <CardCadastro {...cadastro} />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                )}

                {/* Rodapé informativo */}
                <Row className="mt-5">
                    <Col>
                        <Card className="border-0 bg-light">
                            <Card.Body className="text-center py-3">
                                <small className="text-muted">
                                    💡 <strong>Dica Profissional:</strong> Organize seus cadastros por categoria para agilizar o preenchimento das ordens de serviço. 
                                    Quanto mais completos os cadastros auxiliares, mais eficiente será seu fluxo de trabalho.
                                </small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
        </Container>
    );
};

export default TelaCadastros;