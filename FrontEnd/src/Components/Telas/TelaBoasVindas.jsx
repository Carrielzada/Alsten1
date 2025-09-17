import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Button from '../UI/Button';
// import DashboardStats from '../UI/DashboardStats'; // Comentado: dados mock
import { FaClipboardList, FaTools, FaFileAlt, FaUserCog, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './TelaBoasVindas.css';
// Layout será fornecido pelo LayoutModerno no App.js - não importar aqui

const TelaBoasVindas = () => {
    const navigate = useNavigate();

    const funcionalidades = [
        {
            titulo: 'Gerenciar Ordens de Serviço',
            descricao: 'Visualize, edite e acompanhe todas as ordens de serviço em andamento. Controle o status de cada etapa do processo de reparo.',
            icone: <FaClipboardList size={40} className="mb-3 text-primary" />,
            botao: 'Ver Ordens de Serviço',
            rota: '/ordens-servico'
        },
        {
            titulo: 'Histórico de OS Concluídas',
            descricao: 'Consulte todas as ordens de serviço finalizadas com filtros avançados por cliente, equipamento, valor e período.',
            icone: <FaFileAlt size={40} className="mb-3 text-success" />,
            botao: 'Ver OS Concluídas',
            rota: '/os-concluidas'
        },
        {
            titulo: 'Criar Nova Ordem de Serviço',
            descricao: 'Inicie um novo atendimento registrando equipamento, defeito alegado, cliente e todas as informações necessárias.',
            icone: <FaTools size={40} className="mb-3 text-warning" />,
            botao: 'Criar Nova OS',
            rota: '/cadastrar-ordem-servico'
        },
        {
            titulo: 'Gerenciar Cadastros',
            descricao: 'Acesse a central de cadastros organizada por categorias: clientes, equipamentos, processos técnicos e configurações comerciais.',
            icone: <FaUserCog size={40} className="mb-3 text-info" />,
            botao: 'Central de Cadastros',
            rota: '/cadastros'
        },
        {
            titulo: 'Relatórios Completos',
            descricao: 'Acesse relatórios detalhados de produtividade, análise financeira e estatísticas de atendimento para tomada de decisões.',
            icone: <FaChartLine size={40} className="mb-3 text-secondary" />,
            botao: 'Ver Relatórios',
            rota: '/relatorio-completo'
        }
    ];

    return (
        <>
            <div className="container-fluid px-4">
                <div className="py-3">
                <Card className="shadow-sm mb-5">
                    <Card.Body className="text-center py-5">
                        <h1 className="display-4 mb-3">Bem-vindo ao Sistema Alsten</h1>
                        <p className="lead mb-4">
                            Sistema completo para gestão de ordens de serviço para manutenção e reparo de equipamentos. 
                            Controle todo o fluxo desde o recebimento até a entrega, com integração Bling, anexos de comprovantes 
                            e relatórios detalhados para uma gestão eficiente.
                        </p>
                        <Button 
                            variant="primary" 
                            size="lg" 
                            onClick={() => navigate('/ordens-servico')}
                            className="px-4"
                        >
                            Começar Agora
                        </Button>
                    </Card.Body>
                </Card>

                {/* <DashboardStats /> */}
                {/* ☝️ Comentado: Dashboard com dados falsos/mock - aguardando implementação de dados reais */}

                <h2 className="text-center mb-4 mt-5">Principais Funcionalidades</h2>
                
                <Row>
                    {funcionalidades.map((item, index) => (
                        <Col xs={12} sm={6} lg={4} key={index} className="mb-4">
                            <Card className="h-100 shadow-sm hover-card">
                                <Card.Body className="text-center p-4">
                                    {item.icone}
                                    <Card.Title className="mb-3">{item.titulo}</Card.Title>
                                    <Card.Text className="mb-4">{item.descricao}</Card.Text>
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={() => navigate(item.rota)}
                                        className="mt-auto"
                                    >
                                        {item.botao}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Card className="bg-light mt-5">
                    <Card.Body className="p-4">
                        <h3 className="mb-3">Recursos do Sistema Alsten</h3>
                        <ul className="mb-0">
                            <li className="mb-2"><strong>Integração Bling:</strong> Busca automática de dados de clientes diretamente do seu ERP Bling.</li>
                            <li className="mb-2"><strong>Controle de Etapas:</strong> Acompanhe cada OS desde "Previsto" até "Concluído" com validações dinâmicas.</li>
                            <li className="mb-2"><strong>Anexos e Comprovantes:</strong> Anexe fotos do equipamento e comprovantes de aprovação para documentação completa.</li>
                            <li className="mb-2"><strong>Sistema de Logs:</strong> Histórico completo de todas as alterações realizadas em cada ordem de serviço.</li>
                            <li className="mb-2"><strong>Controle de Usuários:</strong> 6 níveis de acesso (Admin, Diretoria, PCM, Comercial, Logística, Técnico).</li>
                            <li><strong>Segurança Avançada:</strong> Autenticação JWT, senhas criptografadas e proteção contra edição concorrente.</li>
                        </ul>
                    </Card.Body>
                </Card>
                </div>
            </div>

        </>
    );
};

export default TelaBoasVindas;