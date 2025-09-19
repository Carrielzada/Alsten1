import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { FaHammer, FaCogs, FaRocket, FaInfoCircle } from 'react-icons/fa';
// Layout será fornecido pelo componente pai - não importar aqui

const TelaWorkInProgress = ({ 
    title = "Funcionalidade em Desenvolvimento", 
    description = "Esta funcionalidade está sendo desenvolvida e estará disponível em breve.",
    icon: Icon = FaHammer,
    estimatedCompletion,
    features = []
}) => {
    return (
        <>
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col lg={8} md={10}>
                        <Card className="shadow-lg border-0">
                            <Card.Body className="text-center py-5">
                                <div className="mb-4">
                                    <Icon size={80} className="text-warning animate__animated animate__pulse animate__infinite" />
                                </div>
                                
                                <h1 className="display-6 fw-bold text-primary mb-3">
                                    {title}
                                </h1>
                                
                                <p className="lead text-muted mb-4">
                                    {description}
                                </p>
                                
                                {estimatedCompletion && (
                                    <div className="alert alert-info d-inline-flex align-items-center" role="alert">
                                        <FaInfoCircle className="me-2" />
                                        <strong>Previsão de entrega:</strong> {estimatedCompletion}
                                    </div>
                                )}
                                
                                {features.length > 0 && (
                                    <div className="mt-5">
                                        <h5 className="text-primary mb-3">
                                            <FaRocket className="me-2" />
                                            Funcionalidades em desenvolvimento:
                                        </h5>
                                        <Row className="g-3">
                                            {features.map((feature, index) => (
                                                <Col md={6} key={index}>
                                                    <div className="p-3 bg-light rounded-3 h-100">
                                                        <FaCogs className="text-primary me-2" />
                                                        <span className="fw-semibold">{feature}</span>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                )}
                                
                                <div className="mt-5 pt-4 border-top">
                                    <p className="text-muted mb-0">
                                        <small>
                                            Nossa equipe está trabalhando para entregar esta funcionalidade 
                                            com a qualidade que você merece. Obrigado pela paciência!
                                        </small>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
        </Container>
        
        <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                
                .animate__pulse {
                    animation: pulse 2s infinite;
                }
                
                .bg-light {
                    transition: all 0.3s ease;
                }
                
                .bg-light:hover {
                    background-color: #e3f2fd !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
        `}</style>
        </>
    );
};

export default TelaWorkInProgress;