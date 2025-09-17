import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Table, Form, Button, InputGroup, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaDownload } from 'react-icons/fa';
import Layout from '../Templates2/Layout';
import { buscarTodasOrdensServico } from '../../Services/ordemServicoService';
import ClienteInfoModal from '../busca/ClienteInfoModal';
=======
import { Table, Button, Form, Row, Col, Badge, Modal, Card } from 'react-bootstrap';
import { FaSearch, FaEye, FaFilter, FaDownload, FaFileImage, FaTimes } from 'react-icons/fa';
import { buscarTodasOrdensServico } from '../../Services/ordemServicoService';
import Layout from '../Templates2/Layout';
import './TelaOSConcluidas.css';
>>>>>>> 153f7dff68df0911d789a58d52adf343f27db289

const TelaOSConcluidas = () => {
    const [ordensServico, setOrdensServico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
<<<<<<< HEAD
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
=======
    const [showModal, setShowModal] = useState(false);
    const [osSelecionada, setOsSelecionada] = useState(null);
    
    // Estados para filtros
    const [filtros, setFiltros] = useState({
        id: '',
        cliente: '',
        modelo: '',
        numeroSerie: '',
        fabricante: '',
        vendedor: '',
        dataEntrega: '',
        valor: '',
        notaFiscal: '',
        defeitoAlegado: '',
        defeitoConstatado: '',
        servicoRealizar: '',
        pedidoCompras: '',
        comprovanteAprovacao: ''
    });
>>>>>>> 153f7dff68df0911d789a58d52adf343f27db289
    
    // Estados para paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(25);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
<<<<<<< HEAD
    const [filtrosAvancados, setFiltrosAvancados] = useState(false);
=======
>>>>>>> 153f7dff68df0911d789a58d52adf343f27db289

    useEffect(() => {
        fetchOrdensServico();
    }, [paginaAtual, itensPorPagina]);

    const fetchOrdensServico = async () => {
        try {
            setLoading(true);
<<<<<<< HEAD
            // Adicionar filtro para apenas OS concluídas
            const filtrosConsulta = { ...filtros, etapa: 'CONCLUÍDO' };
            const data = await buscarTodasOrdensServico(paginaAtual, itensPorPagina, '', filtrosConsulta);
            
            setOrdensServico(data.listaOrdensServico || []);
            
            // Atualizar informações de paginação
            if (data.paginacao) {
                setPaginaAtual(data.paginacao.pagina);
                setTotalPaginas(data.paginacao.totalPaginas);
                setTotalRegistros(data.paginacao.totalRegistros);
=======
            // Buscar todas as OS e filtrar apenas as concluídas
            const data = await buscarTodasOrdensServico(paginaAtual, itensPorPagina, '');
            
            // Filtrar apenas OS com etapa "CONCLUÍDO"
            const osConcluidas = (data.listaOrdensServico || []).filter(os => 
                (os.etapaId?.nome || os.etapa) === 'CONCLUÍDO'
            );
            
            // Aplicar filtros adicionais
            const osFiltradas = aplicarFiltros(osConcluidas);
            
            setOrdensServico(osFiltradas);
            
            if (data.paginacao) {
                setTotalPaginas(Math.ceil(osFiltradas.length / itensPorPagina));
                setTotalRegistros(osFiltradas.length);
>>>>>>> 153f7dff68df0911d789a58d52adf343f27db289
            }
            
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const aplicarFiltros = () => {
        setPaginaAtual(1); // Voltar para a primeira página ao aplicar filtros
        fetchOrdensServico();
=======
    const aplicarFiltros = (osList) => {
        return osList.filter(os => {
            return Object.entries(filtros).every(([campo, valor]) => {
                if (!valor) return true;
                
                const valorBusca = valor.toLowerCase();
                
                switch (campo) {
                    case 'id':
                        return os.id?.toString().includes(valorBusca);
                    case 'cliente':
                        return os.cliente?.nome?.toLowerCase().includes(valorBusca) ||
                               os.cliente?.numeroDocumento?.includes(valorBusca);
                    case 'modelo':
                        return os.modeloEquipamento?.modelo?.toLowerCase().includes(valorBusca);
                    case 'numeroSerie':
                        return os.numeroSerie?.toLowerCase().includes(valorBusca);
                    case 'fabricante':
                        return os.fabricante?.nome_fabricante?.toLowerCase().includes(valorBusca);
                    case 'vendedor':
                        return os.vendedor?.nome?.toLowerCase().includes(valorBusca);
                    case 'dataEntrega':
                        return os.dataEntrega?.includes(valorBusca);
                    case 'valor':
                        return os.valor?.toString().includes(valorBusca);
                    case 'notaFiscal':
                        return os.notaFiscal?.toLowerCase().includes(valorBusca);
                    case 'defeitoAlegado':
                        return os.defeitoAlegado?.toLowerCase().includes(valorBusca);
                    case 'defeitoConstatado':
                        return os.defeitoConstatado?.toLowerCase().includes(valorBusca);
                    case 'servicoRealizar':
                        return os.servicoRealizar?.toLowerCase().includes(valorBusca);
                    case 'pedidoCompras':
                        return os.pedidoCompras?.toLowerCase().includes(valorBusca);
                    case 'comprovanteAprovacao':
                        return os.comprovanteAprovacao?.toLowerCase().includes(valorBusca);
                    default:
                        return true;
                }
            });
        });
    };

    const handleFiltroChange = (campo, valor) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor
        }));
>>>>>>> 153f7dff68df0911d789a58d52adf343f27db289
    };

    const limparFiltros = () => {
        setFiltros({
<<<<<<< HEAD
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
=======
            id: '',
            cliente: '',
            modelo: '',
            numeroSerie: '',
            fabricante: '',
            vendedor: '',
            dataEntrega: '',
            valor: '',
            notaFiscal: '',
            defeitoAlegado: '',
            defeitoConstatado: '',
            servicoRealizar: '',
            pedidoCompras: '',
            comprovanteAprovacao: ''
        });
    };

    const handleVerDetalhes = (os) => {
        setOsSelecionada(os);
        setShowModal(true);
    };

    const formatarValor = (valor) => {
        if (!valor) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatarData = (data) => {
        if (!data) return '';
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const formatarDocumento = (documento) => {
        if (!documento) return '';
        
        const numeros = documento.replace(/\D/g, '');
        
        if (numeros.length === 11) {
            return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (numeros.length === 14) {
            return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        
        return documento;
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p className="mt-2">Carregando ordens de serviço concluídas...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="alert alert-danger" role="alert">
                    Erro ao carregar ordens de serviço: {error}
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>
                        <FaEye className="me-2" />
                        Ordens de Serviço Concluídas
                    </h2>
                    <Badge bg="success" className="fs-6">
                        {totalRegistros} registros encontrados
                    </Badge>
                </div>

                {/* Filtros */}
                <Card className="mb-4">
                    <Card.Header>
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <FaFilter className="me-2" />
                                Filtros de Pesquisa
                            </h5>
                            <Button variant="outline-secondary" size="sm" onClick={limparFiltros}>
                                <FaTimes />
                                Limpar
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={3} className="mb-3">
                                <Form.Label>ID da OS</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex: 123"
                                    value={filtros.id}
                                    onChange={(e) => handleFiltroChange('id', e.target.value)}
                                />
                            </Col>
                            <Col md={3} className="mb-3">
                                <Form.Label>Cliente</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nome ou documento"
                                    value={filtros.cliente}
                                    onChange={(e) => handleFiltroChange('cliente', e.target.value)}
                                />
                            </Col>
                            <Col md={3} className="mb-3">
                                <Form.Label>Modelo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Modelo do equipamento"
                                    value={filtros.modelo}
                                    onChange={(e) => handleFiltroChange('modelo', e.target.value)}
                                />
                            </Col>
                            <Col md={3} className="mb-3">
                                <Form.Label>Número de Série</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Número de série"
                                    value={filtros.numeroSerie}
                                    onChange={(e) => handleFiltroChange('numeroSerie', e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3} className="mb-3">
                                <Form.Label>Fabricante</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nome do fabricante"
                                    value={filtros.fabricante}
                                    onChange={(e) => handleFiltroChange('fabricante', e.target.value)}
                                />
                            </Col>
                            <Col md={3} className="mb-3">
                                <Form.Label>Vendedor</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nome do vendedor"
                                    value={filtros.vendedor}
                                    onChange={(e) => handleFiltroChange('vendedor', e.target.value)}
                                />
                            </Col>
                            <Col md={3} className="mb-3">
                                <Form.Label>Data de Entrega</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filtros.dataEntrega}
                                    onChange={(e) => handleFiltroChange('dataEntrega', e.target.value)}
                                />
                            </Col>
                            <Col md={3} className="mb-3">
                                <Form.Label>Valor</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Valor do serviço"
                                    value={filtros.valor}
                                    onChange={(e) => handleFiltroChange('valor', e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3} className="mb-3">
                                <Form.Label>Nota Fiscal</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Número da NF"
                                    value={filtros.notaFiscal}
                                    onChange={(e) => handleFiltroChange('notaFiscal', e.target.value)}
                                />
                            </Col>
                            <Col md={3} className="mb-3">
                                <Form.Label>Pedido de Compras</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Número do pedido"
                                    value={filtros.pedidoCompras}
                                    onChange={(e) => handleFiltroChange('pedidoCompras', e.target.value)}
                                />
                            </Col>
                            <Col md={3} className="mb-3">
                                <Form.Label>Comprovante de Aprovação</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Comprovante"
                                    value={filtros.comprovanteAprovacao}
                                    onChange={(e) => handleFiltroChange('comprovanteAprovacao', e.target.value)}
                                />
                            </Col>
                            <Col md={3} className="mb-3 d-flex align-items-end">
                                <Button 
                                    variant="primary" 
                                    onClick={fetchOrdensServico}
                                    className="w-100"
                                    size="sm"
                                >
                                    <FaSearch />
                                    Aplicar
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Tabela */}
                <div className="table-responsive">
                    <Table striped bordered hover className="table-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Modelo</th>
                                <th>Nº Série</th>
                                <th>Fabricante</th>
                                <th>Vendedor</th>
                                <th>Data Entrega</th>
                                <th>Valor</th>
                                <th>NF</th>
                                <th>Defeito Alegado</th>
                                <th>Defeito Constatado</th>
                                <th>Serviço Realizado</th>
                                <th>Pedido Compras</th>
                                <th>Comprovante</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordensServico.length > 0 ? (
                                ordensServico.map((os) => (
                                    <tr key={os.id}>
                                        <td><strong>#{os.id}</strong></td>
                                        <td>
                                            <div>
                                                <div className="fw-bold">{os.cliente?.nome || `Cliente ${os.cliente?.id}`}</div>
                                                {os.cliente?.numeroDocumento && (
                                                    <small className="text-muted">
                                                        {formatarDocumento(os.cliente.numeroDocumento)}
                                                    </small>
                                                )}
                                            </div>
                                        </td>
                                        <td>{os.modeloEquipamento?.modelo || 'N/A'}</td>
                                        <td>{os.numeroSerie || 'N/A'}</td>
                                        <td>{os.fabricante?.nome_fabricante || 'N/A'}</td>
                                        <td>{os.vendedor?.nome || 'N/A'}</td>
                                        <td>{formatarData(os.dataEntrega)}</td>
                                        <td className="text-end">{formatarValor(os.valor)}</td>
                                        <td>{os.notaFiscal || 'N/A'}</td>
                                        <td>
                                            <div className="text-truncate" style={{ maxWidth: '200px' }} title={os.defeitoAlegado}>
                                                {os.defeitoAlegado || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-truncate" style={{ maxWidth: '200px' }} title={os.defeitoConstatado}>
                                                {os.defeitoConstatado || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-truncate" style={{ maxWidth: '200px' }} title={os.servicoRealizar}>
                                                {os.servicoRealizar || 'N/A'}
                                            </div>
                                        </td>
                                        <td>{os.pedidoCompras || 'N/A'}</td>
                                        <td>
                                            {os.comprovanteAprovacao ? (
                                                <Badge bg="success">Sim</Badge>
                                            ) : (
                                                <Badge bg="secondary">Não</Badge>
                                            )}
                                        </td>
                                        <td>
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                onClick={() => handleVerDetalhes(os)}
                                            >
                                                <FaEye />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="15" className="text-center text-muted">
                                        Nenhuma ordem de serviço concluída encontrada
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                {/* Paginação */}
                {totalPaginas > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setPaginaAtual(1)}
                                        disabled={paginaAtual === 1}
                                    >
                                        Primeira
                                    </button>
                                </li>
                                <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setPaginaAtual(paginaAtual - 1)}
                                        disabled={paginaAtual === 1}
                                    >
                                        Anterior
                                    </button>
                                </li>
                                
                                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                                    let pageNum;
                                    if (totalPaginas <= 5) {
                                        pageNum = i + 1;
                                    } else if (paginaAtual <= 3) {
                                        pageNum = i + 1;
                                    } else if (paginaAtual >= totalPaginas - 2) {
                                        pageNum = totalPaginas - 4 + i;
                                    } else {
                                        pageNum = paginaAtual - 2 + i;
                                    }
                                    
                                    return (
                                        <li key={pageNum} className={`page-item ${pageNum === paginaAtual ? 'active' : ''}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={() => setPaginaAtual(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        </li>
                                    );
                                })}
                                
                                <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setPaginaAtual(paginaAtual + 1)}
                                        disabled={paginaAtual === totalPaginas}
                                    >
                                        Próxima
                                    </button>
                                </li>
                                <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setPaginaAtual(totalPaginas)}
                                        disabled={paginaAtual === totalPaginas}
                                    >
                                        Última
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}

                {/* Modal de detalhes */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Detalhes da OS #{osSelecionada?.id}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {osSelecionada && (
                            <div className="row">
                                <div className="col-md-6">
                                    <h6>Informações Básicas</h6>
                                    <p><strong>ID:</strong> {osSelecionada.id}</p>
                                    <p><strong>Cliente:</strong> {osSelecionada.cliente?.nome || `Cliente ${osSelecionada.cliente?.id}`}</p>
                                    <p><strong>Documento:</strong> {osSelecionada.cliente?.numeroDocumento ? formatarDocumento(osSelecionada.cliente.numeroDocumento) : 'N/A'}</p>
                                    <p><strong>Modelo:</strong> {osSelecionada.modeloEquipamento?.modelo || 'N/A'}</p>
                                    <p><strong>Número de Série:</strong> {osSelecionada.numeroSerie || 'N/A'}</p>
                                    <p><strong>Fabricante:</strong> {osSelecionada.fabricante?.nome_fabricante || 'N/A'}</p>
                                    <p><strong>Vendedor:</strong> {osSelecionada.vendedor?.nome || 'N/A'}</p>
                                </div>
                                <div className="col-md-6">
                                    <h6>Informações do Serviço</h6>
                                    <p><strong>Data de Entrega:</strong> {formatarData(osSelecionada.dataEntrega)}</p>
                                    <p><strong>Valor:</strong> {formatarValor(osSelecionada.valor)}</p>
                                    <p><strong>Nota Fiscal:</strong> {osSelecionada.notaFiscal || 'N/A'}</p>
                                    <p><strong>Pedido de Compras:</strong> {osSelecionada.pedidoCompras || 'N/A'}</p>
                                    <p><strong>Comprovante de Aprovação:</strong> {osSelecionada.comprovanteAprovacao || 'N/A'}</p>
                                    <p><strong>Etapa:</strong> <Badge bg="success">{osSelecionada.etapaId?.nome || osSelecionada.etapa}</Badge></p>
                                </div>
                                <div className="col-12 mt-3">
                                    <h6>Defeito Alegado</h6>
                                    <p className="border p-2 bg-light">{osSelecionada.defeitoAlegado || 'N/A'}</p>
                                </div>
                                <div className="col-12 mt-3">
                                    <h6>Defeito Constatado</h6>
                                    <p className="border p-2 bg-light">{osSelecionada.defeitoConstatado || 'N/A'}</p>
                                </div>
                                <div className="col-12 mt-3">
                                    <h6>Serviço Realizado</h6>
                                    <p className="border p-2 bg-light">{osSelecionada.servicoRealizar || 'N/A'}</p>
                                </div>
                                {osSelecionada.informacoesConfidenciais && (
                                    <div className="col-12 mt-3">
                                        <h6>Informações Confidenciais</h6>
                                        <p className="border p-2 bg-warning bg-opacity-10">{osSelecionada.informacoesConfidenciais}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
>>>>>>> 153f7dff68df0911d789a58d52adf343f27db289
        </Layout>
    );
};

export default TelaOSConcluidas;