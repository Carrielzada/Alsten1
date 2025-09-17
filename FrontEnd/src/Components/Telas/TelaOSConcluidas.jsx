import React, { useState, useEffect } from 'react';
import { Table, Form, Button, InputGroup, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaDownload } from 'react-icons/fa';
import Layout from '../Templates2/Layout';
import { buscarTodasOrdensServico } from '../../Services/ordemServicoService';
import ClienteInfoModal from '../busca/ClienteInfoModal';

const TelaOSConcluidas = () => {
    const [ordensServico, setOrdensServico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtros, setFiltros] = useState({
        cliente: '',
        modelo: '',
        numeroSerie: '',
        defeitoAlegado: '',
        defeitoConstatado: '',
        servicoRealizado: '',
        dataInicio: '',
        dataFim: '',
        valor: '',
        tecnico: ''
    });
    const [showClienteModal, setShowClienteModal] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    
    // Estados para paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(25);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [filtrosAvancados, setFiltrosAvancados] = useState(false);

    useEffect(() => {
        fetchOrdensServico();
    }, [paginaAtual, itensPorPagina]);

    const fetchOrdensServico = async () => {
        try {
            setLoading(true);
            // Adicionar filtro para apenas OS concluídas
            const filtrosConsulta = { ...filtros, etapa: 'CONCLUÍDO' };
            const data = await buscarTodasOrdensServico(paginaAtual, itensPorPagina, '', filtrosConsulta);
            
            setOrdensServico(data.listaOrdensServico || []);
            
            // Atualizar informações de paginação
            if (data.paginacao) {
                setPaginaAtual(data.paginacao.pagina);
                setTotalPaginas(data.paginacao.totalPaginas);
                setTotalRegistros(data.paginacao.totalRegistros);
            }
            
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const aplicarFiltros = () => {
        setPaginaAtual(1); // Voltar para a primeira página ao aplicar filtros
        fetchOrdensServico();
    };

    const limparFiltros = () => {
        setFiltros({
            cliente: '',
            modelo: '',
            numeroSerie: '',
            defeitoAlegado: '',
            defeitoConstatado: '',
            servicoRealizado: '',
            dataInicio: '',
            dataFim: '',
            valor: '',
            tecnico: ''
        });
        setPaginaAtual(1);
        // Executar busca sem filtros
        fetchOrdensServico();
    };

    const handleVerDetalhesCliente = (cliente) => {
        setClienteSelecionado(cliente);
        setShowClienteModal(true);
    };

    const formatarData = (dataString) => {
        if (!dataString) return 'Não informada';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    const formatarValor = (valor) => {
        if (!valor && valor !== 0) return 'Não informado';
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const renderPaginacao = () => {
        const paginas = [];
        const maxPaginasVisiveis = 5;
        let startPage = Math.max(1, paginaAtual - Math.floor(maxPaginasVisiveis / 2));
        let endPage = Math.min(totalPaginas, startPage + maxPaginasVisiveis - 1);
        
        if (endPage - startPage + 1 < maxPaginasVisiveis) {
            startPage = Math.max(1, endPage - maxPaginasVisiveis + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginas.push(
                <Button 
                    key={i} 
                    variant={paginaAtual === i ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => setPaginaAtual(i)}
                    className="mx-1"
                >
                    {i}
                </Button>
            );
        }
        
        return (
            <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                    <span className="text-muted">
                        Mostrando {ordensServico.length} de {totalRegistros} registros
                    </span>
                </div>
                <div>
                    <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
                        disabled={paginaAtual === 1}
                        className="me-1"
                    >
                        Anterior
                    </Button>
                    {paginas}
                    <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
                        disabled={paginaAtual === totalPaginas}
                        className="ms-1"
                    >
                        Próxima
                    </Button>
                </div>
                <div>
                    <Form.Select 
                        size="sm" 
                        value={itensPorPagina} 
                        onChange={(e) => setItensPorPagina(Number(e.target.value))}
                        style={{ width: '100px' }}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </Form.Select>
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Ordens de Serviço Concluídas</h5>
                    <Button 
                        variant="light" 
                        size="sm" 
                        onClick={() => setFiltrosAvancados(!filtrosAvancados)}
                    >
                        <FaFilter className="me-1" />
                        {filtrosAvancados ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    </Button>
                </Card.Header>
                <Card.Body>
                    {filtrosAvancados && (
                        <div className="filtros-container mb-4">
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Cliente</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="cliente" 
                                            value={filtros.cliente} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Nome ou documento"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Modelo</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="modelo" 
                                            value={filtros.modelo} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Modelo do equipamento"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Número de Série</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="numeroSerie" 
                                            value={filtros.numeroSerie} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Número de série"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Defeito Alegado</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="defeitoAlegado" 
                                            value={filtros.defeitoAlegado} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Defeito alegado"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Defeito Constatado</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="defeitoConstatado" 
                                            value={filtros.defeitoConstatado} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Defeito constatado"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Serviço Realizado</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="servicoRealizado" 
                                            value={filtros.servicoRealizado} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Serviço realizado"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Data Início</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            name="dataInicio" 
                                            value={filtros.dataInicio} 
                                            onChange={handleFiltroChange}
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Data Fim</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            name="dataFim" 
                                            value={filtros.dataFim} 
                                            onChange={handleFiltroChange}
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Valor</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            name="valor" 
                                            value={filtros.valor} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Valor"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Técnico</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="tecnico" 
                                            value={filtros.tecnico} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Nome do técnico"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={9} className="d-flex align-items-end justify-content-end mb-3">
                                    <Button 
                                        variant="secondary" 
                                        size="sm" 
                                        onClick={limparFiltros} 
                                        className="me-2"
                                    >
                                        Limpar Filtros
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        size="sm" 
                                        onClick={aplicarFiltros}
                                    >
                                        <FaSearch className="me-1" />
                                        Aplicar Filtros
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Carregando ordens de serviço...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : ordensServico.length === 0 ? (
                        <div className="alert alert-info">Nenhuma ordem de serviço concluída encontrada.</div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <Table striped bordered hover size="sm">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Cliente</th>
                                            <th>Modelo</th>
                                            <th>Nº Série</th>
                                            <th>Defeito Alegado</th>
                                            <th>Defeito Constatado</th>
                                            <th>Serviço Realizado</th>
                                            <th>Data Conclusão</th>
                                            <th>Valor</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordensServico.map((os) => (
                                            <tr key={os.id}>
                                                <td>{os.id}</td>
                                                <td>
                                                    <Button 
                                                        variant="link" 
                                                        size="sm" 
                                                        onClick={() => handleVerDetalhesCliente(os.cliente)}
                                                        className="p-0 text-decoration-none"
                                                    >
                                                        {os.cliente?.nome || os.cliente}
                                                    </Button>
                                                </td>
                                                <td>{os.modeloEquipamento?.modelo || 'Não informado'}</td>
                                                <td>{os.numeroSerie || 'Não informado'}</td>
                                                <td>{os.defeitoAlegado || 'Não informado'}</td>
                                                <td>{os.defeitoConstatado || 'Não informado'}</td>
                                                <td>{os.servicoRealizar || 'Não informado'}</td>
                                                <td>{formatarData(os.dataEquipamentoPronto)}</td>
                                                <td>{formatarValor(os.valor)}</td>
                                                <td>
                                                    <Button 
                                                        variant="outline-info" 
                                                        size="sm" 
                                                        className="me-1"
                                                        title="Visualizar detalhes"
                                                        onClick={() => window.open(`/cadastrar-ordem-servico/${os.id}`, '_blank')}
                                                    >
                                                        <FaEye size={14} />
                                                    </Button>
                                                    {os.arquivosAnexados && os.arquivosAnexados.length > 0 && (
                                                        <Button 
                                                            variant="outline-secondary" 
                                                            size="sm"
                                                            title="Baixar anexos"
                                                            onClick={() => window.open(`${process.env.REACT_APP_API_URL}/uploads/${os.arquivosAnexados[0]}`, '_blank')}
                                                        >
                                                            <FaDownload size={14} />
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            {renderPaginacao()}
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Modal de detalhes do cliente */}
            <ClienteInfoModal 
                show={showClienteModal} 
                onHide={() => setShowClienteModal(false)} 
                cliente={clienteSelecionado} 
                title="Detalhes do Cliente"
            />
        </Layout>
    );
};

export default TelaOSConcluidas;