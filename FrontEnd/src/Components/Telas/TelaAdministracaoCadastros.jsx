import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { 
    FaClipboardList, FaUsers, FaCogs, FaIndustry, FaWrench, 
    FaShippingFast, FaTruck, FaExclamationTriangle, FaVial, 
    FaBroom, FaUserShield, FaCreditCard 
} from 'react-icons/fa';
import Layout from '../Templates2/Layout.jsx';
import CardCadastro from '../Cards/CardCadastro';
import { ContextoUsuarioLogado } from '../../App';

const TelaAdministracaoCadastros = () => {
    const { usuarioLogado } = useContext(ContextoUsuarioLogado);
    const [isAdminOrManager, setIsAdminOrManager] = useState(false);

    useEffect(() => {
        // Verificar se é admin (1) ou gerente (assumindo role 2)
        setIsAdminOrManager(usuarioLogado?.role === 1 || usuarioLogado?.role === 2);
    }, [usuarioLogado]);

    const cadastrosPrincipais = [
        {
            titulo: "Ordens de Serviço",
            descricao: "Gerenciar todas as ordens de serviço do sistema",
            icon: FaClipboardList,
            rota: "/ordens-servico",
            destaque: true,
            cor: "primary"
        }
    ];

    const cadastrosGerais = [
        {
            titulo: "Clientes",
            descricao: "Cadastro e gestão de clientes PF e PJ",
            icon: FaUsers,
            rota: "/cadastros/clientes",
            cor: "info"
        },
        {
            titulo: "Modelo de Equipamento",
            descricao: "Cadastrar modelos de equipamentos",
            icon: FaCogs,
            rota: "/cadastros/modelo-equipamento",
            cor: "secondary"
        },
        {
            titulo: "Fabricantes",
            descricao: "Gerenciar fabricantes de equipamentos",
            icon: FaIndustry,
            rota: "/cadastros/fabricante",
            cor: "dark"
        },
        {
            titulo: "Formas de Pagamento",
            descricao: "Configurar métodos de pagamento",
            icon: FaCreditCard,
            rota: "/cadastros/pagamento",
            cor: "success"
        },
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
            cor: "warning"
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
            titulo: "Níveis de Urgência",
            descricao: "Configurar prioridades de atendimento",
            icon: FaExclamationTriangle,
            rota: "/cadastros/urgencia",
            cor: "danger"
        },
        {
            titulo: "Defeitos Alegados",
            descricao: "Padrões de defeitos relatados",
            icon: FaShippingFast,
            rota: "/cadastros/defeito-alegado",
            cor: "info"
        },
        {
            titulo: "Serviços Padrão",
            descricao: "Templates de serviços realizados",
            icon: FaCogs,
            rota: "/cadastros/servico-realizado",
            cor: "success"
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
        <Layout>
            <Container fluid className="py-4">
                {/* Cabeçalho */}
                <Row className="mb-4">
                    <Col>
                        <Card className="border-0 shadow-sm bg-primary text-white">
                            <Card.Body className="py-4">
                                <div className="text-center">
                                    <FaCogs size={48} className="mb-3" />
                                    <h2 className="fw-bold mb-2">Administração de Cadastros</h2>
                                    <p className="lead mb-0">
                                        Gerencie todos os cadastros e configurações do sistema
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Cadastro Principal */}
                <Row className="mb-5">
                    <Col>
                        <h4 className="fw-bold text-primary mb-3 d-flex align-items-center">
                            <FaClipboardList className="me-2" />
                            Cadastro Principal
                        </h4>
                        <Row>
                            {cadastrosPrincipais.map((cadastro, index) => (
                                <Col lg={4} md={6} className="mb-4" key={index}>
                                    <CardCadastro {...cadastro} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                {/* Cadastros Gerais */}
                <Row className="mb-5">
                    <Col>
                        <h4 className="fw-bold text-secondary mb-3 d-flex align-items-center">
                            <FaCogs className="me-2" />
                            Cadastros Auxiliares
                        </h4>
                        <Row>
                            {cadastrosGerais.map((cadastro, index) => (
                                <Col lg={3} md={4} sm={6} className="mb-4" key={index}>
                                    <CardCadastro {...cadastro} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                {/* Cadastros Administrativos (apenas para Admin/Gerente) */}
                {isAdminOrManager && (
                    <Row className="mb-4">
                        <Col>
                            <h4 className="fw-bold text-danger mb-3 d-flex align-items-center">
                                <FaUserShield className="me-2" />
                                Administração de Sistema
                            </h4>
                            <Alert variant="warning" className="mb-3">
                                <strong>Área Restrita:</strong> Apenas administradores e gerentes têm acesso a estas funcionalidades.
                            </Alert>
                            <Row>
                                {cadastrosAdmin.map((cadastro, index) => (
                                    <Col lg={3} md={4} sm={6} className="mb-4" key={index}>
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
                                    💡 <strong>Dica:</strong> Clique em qualquer card para acessar a funcionalidade correspondente. 
                                    Os cadastros auxiliares ajudam a padronizar e agilizar o preenchimento das ordens de serviço.
                                </small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default TelaAdministracaoCadastros;