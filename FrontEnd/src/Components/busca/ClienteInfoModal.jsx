import React from 'react';
import { Modal, Button, Row, Col, Badge, Card } from 'react-bootstrap';
import { FaBuilding, FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaIndustry } from 'react-icons/fa';

const ClienteInfoModal = ({ show, onHide, cliente, title = "Informações do Cliente" }) => {
    const formatarDocumento = (documento) => {
        if (!documento) return 'Não informado';
        
        // Remove caracteres não numéricos
        const numeros = documento.replace(/\D/g, '');
        
        if (numeros.length === 11) {
            // CPF
            return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (numeros.length === 14) {
            // CNPJ
            return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        
        return documento;
    };

    const getTipoBadge = (tipo) => {
        const badges = {
            'cliente': 'success',
            'fornecedor': 'warning',
            'funcionario': 'info',
            'lead': 'secondary'
        };
        return badges[tipo] || 'secondary';
    };

    const getTipoIcon = (tipo) => {
        const icons = {
            'cliente': FaUser,
            'fornecedor': FaIndustry,
            'funcionario': FaUser,
            'lead': FaUser
        };
        return icons[tipo] || FaUser;
    };

    if (!cliente) {
        return (
            <Modal show={show} onHide={onHide} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaBuilding className="me-2" />
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center text-muted">
                        <FaBuilding className="mb-3" style={{ fontSize: '3rem' }} />
                        <h5>Cliente não encontrado</h5>
                        <p>As informações do cliente não estão disponíveis.</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    const TipoIcon = getTipoIcon(cliente.tipo);

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <FaBuilding className="me-2" />
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    {/* Cabeçalho com nome e tipo */}
                    <Row className="mb-4">
                        <Col md={8}>
                            <h4 className="text-primary mb-2">{cliente.nome}</h4>
                            <div className="d-flex align-items-center gap-2">
                                <Badge bg={getTipoBadge(cliente.tipo)}>
                                    <TipoIcon className="me-1" />
                                    {cliente.tipo || 'Não especificado'}
                                </Badge>
                                {cliente.situacao && (
                                    <Badge bg={cliente.situacao === 'A' ? 'success' : 'danger'}>
                                        {cliente.situacao === 'A' ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                )}
                            </div>
                        </Col>
                        <Col md={4} className="text-end">
                            <small className="text-muted">
                                ID: {cliente.id}
                            </small>
                        </Col>
                    </Row>

                    {/* Informações principais */}
                    <Row>
                        <Col md={6}>
                            <Card className="mb-3">
                                <Card.Header>
                                    <FaIdCard className="me-2" />
                                    Documentação
                                </Card.Header>
                                <Card.Body>
                                    <p className="mb-1">
                                        <strong>Documento:</strong><br />
                                        {formatarDocumento(cliente.numeroDocumento)}
                                    </p>
                                    {cliente.codigo && (
                                        <p className="mb-0">
                                            <strong>Código:</strong><br />
                                            {cliente.codigo}
                                        </p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="mb-3">
                                <Card.Header>
                                    <FaPhone className="me-2" />
                                    Contato
                                </Card.Header>
                                <Card.Body>
                                    {cliente.telefone && (
                                        <p className="mb-2">
                                            <strong>Telefone:</strong><br />
                                            {cliente.telefone}
                                        </p>
                                    )}
                                    {cliente.celular && (
                                        <p className="mb-2">
                                            <strong>Celular:</strong><br />
                                            {cliente.celular}
                                        </p>
                                    )}
                                    {cliente.email && (
                                        <p className="mb-0">
                                            <strong>E-mail:</strong><br />
                                            <a href={`mailto:${cliente.email}`}>{cliente.email}</a>
                                        </p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Endereço se disponível */}
                    {cliente.endereco && (
                        <Row>
                            <Col md={12}>
                                <Card className="mb-3">
                                    <Card.Header>
                                        <FaMapMarkerAlt className="me-2" />
                                        Endereço
                                    </Card.Header>
                                    <Card.Body>
                                        <p className="mb-0">{cliente.endereco}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {/* Informações adicionais do Bling */}
                    {cliente.observacoes && (
                        <Row>
                            <Col md={12}>
                                <Card className="mb-3">
                                    <Card.Header>
                                        <FaBuilding className="me-2" />
                                        Observações
                                    </Card.Header>
                                    <Card.Body>
                                        <p className="mb-0">{cliente.observacoes}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {/* Informações de negócio */}
                    <Row>
                        <Col md={12}>
                            <Card className="mb-3">
                                <Card.Header>
                                    <FaIndustry className="me-2" />
                                    Informações de Negócio
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <p className="mb-1">
                                                <strong>Tipo:</strong> {cliente.tipo || 'Não especificado'}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Situação:</strong> {cliente.situacao === 'A' ? 'Ativo' : 'Inativo'}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <p className="mb-1">
                                                <strong>ID Bling:</strong> {cliente.id}
                                            </p>
                                            {cliente.dataCriacao && (
                                                <p className="mb-0">
                                                    <strong>Criado em:</strong> {new Date(cliente.dataCriacao).toLocaleDateString('pt-BR')}
                                                </p>
                                            )}
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Fechar
                </Button>
                {cliente.telefone && (
                    <Button 
                        variant="outline-primary" 
                        onClick={() => window.open(`tel:${cliente.telefone.replace(/\D/g, '')}`)}
                    >
                        <FaPhone className="me-2" />
                        Ligar
                    </Button>
                )}
                {cliente.email && (
                    <Button 
                        variant="outline-info" 
                        onClick={() => window.open(`mailto:${cliente.email}`)}
                    >
                        <FaEnvelope className="me-2" />
                        Enviar E-mail
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ClienteInfoModal; 