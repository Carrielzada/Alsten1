import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Card, Row, Col, Badge, Spinner, InputGroup } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaDownload, FaTimes, FaTable, FaFileExport } from 'react-icons/fa';
import Layout from '../Templates2/Layout';
import { buscarTodasOrdensServico } from '../../Services/ordemServicoService';
import ClienteInfoModal from '../busca/ClienteInfoModal';

const TelaRelatorioCompleto = () => {
    const [ordensServico, setOrdensServico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtros, setFiltros] = useState({
        cliente: '',
        modelo: '',
        numeroSerie: '',
        fabricante: '',
        defeitoAlegado: '',
        defeitoConstatado: '',
        servicoRealizado: '',
        tecnico: '',
        dataInicio: '',
        dataFim: '',
        valorMin: '',
        valorMax: '',
        urgencia: '',
        tipoAnalise: '',
        tipoLacre: '',
        tipoLimpeza: '',
        tipoTransporte: '',
        formaPagamento: '',
        notaFiscal: '',
        pedidoCompras: '',
        diasReparo: ''
    });
    const [showClienteModal, setShowClienteModal] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [showFiltros, setShowFiltros] = useState(false);
    
    // Estados para paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(50);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);

    useEffect(() => {
        fetchOrdensServico();
    }, [paginaAtual, itensPorPagina]);

    const fetchOrdensServico = async () => {
        try {
            setLoading(true);
            // Filtro apenas OS concluídas
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
        setPaginaAtual(1);
        fetchOrdensServico();
    };

    const limparFiltros = () => {
        setFiltros({
            cliente: '',
            modelo: '',
            numeroSerie: '',
            fabricante: '',
            defeitoAlegado: '',
            defeitoConstatado: '',
            servicoRealizado: '',
            tecnico: '',
            dataInicio: '',
            dataFim: '',
            valorMin: '',
            valorMax: '',
            urgencia: '',
            tipoAnalise: '',
            tipoLacre: '',
            tipoLimpeza: '',
            tipoTransporte: '',
            formaPagamento: '',
            notaFiscal: '',
            pedidoCompras: '',
            diasReparo: ''
        });
        setPaginaAtual(1);
        fetchOrdensServico();
    };

    const handleVerDetalhesCliente = (cliente) => {
        setClienteSelecionado(cliente);
        setShowClienteModal(true);
    };

    const formatarData = (dataString) => {
        if (!dataString) return 'N/A';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    const formatarValor = (valor) => {
        if (!valor && valor !== 0) return 'N/A';
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const exportarDados = () => {
        // Simples exportação CSV
        const headers = [
            'ID', 'Cliente', 'Modelo', 'Nº Série', 'Fabricante', 'Defeito Alegado', 
            'Defeito Constatado', 'Serviço Realizado', 'Técnico', 'Data Entrega', 
            'Data Conclusão', 'Valor', 'Urgência', 'Tipo Análise', 'Nota Fiscal', 
            'Pedido Compras', 'Dias Reparo'
        ];
        
        const csvData = [
            headers,
            ...ordensServico.map(os => [
                os.id,
                os.cliente?.nome || 'N/A',
                os.modeloEquipamento?.modelo || 'N/A',
                os.numeroSerie || 'N/A',
                os.fabricante?.nome_fabricante || 'N/A',
                os.defeitoAlegado || 'N/A',
                os.defeitoConstatado || 'N/A',
                os.servicoRealizar || 'N/A',
                os.vendedor?.nome || 'N/A',
                formatarData(os.dataEntrega),
                formatarData(os.dataEquipamentoPronto),
                os.valor || 0,
                os.urgencia?.urgencia || 'N/A',
                os.tipoAnalise?.tipo_analise || 'N/A',
                os.notaFiscal || 'N/A',
                os.pedidoCompras || 'N/A',
                os.diasReparo || 'N/A'
            ])
        ];

        const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `relatorio_completo_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            <div className="d-flex justify-content-between align-items-center mt-4">
                <div>
                    <span className="text-muted">
                        Mostrando {ordensServico.length} de {totalRegistros} registros
                    </span>
                </div>
                <div className="d-flex align-items-center">
                    <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
                        disabled={paginaAtual === 1}
                        className="me-2"
                    >
                        Anterior
                    </Button>
                    {paginas}
                    <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
                        disabled={paginaAtual === totalPaginas}
                        className="ms-2"
                    >
                        Próxima
                    </Button>
                </div>
                <div>
                    <Form.Select 
                        size="sm" 
                        value={itensPorPagina} 
                        onChange={(e) => setItensPorPagina(Number(e.target.value))}
                        style={{ width: '80px' }}
                    >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                    </Form.Select>
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <FaTable className="me-2" />
                        <h5 className="mb-0">Relatório Completo - Ordens de Serviço Concluídas</h5>
                    </div>
                    <div>
                        <Button 
                            variant="light" 
                            size="sm" 
                            className="me-2"
                            onClick={() => setShowFiltros(!showFiltros)}
                        >
                            <FaFilter className="me-1" />
                            {showFiltros ? 'Ocultar Filtros' : 'Filtros Avançados'}
                        </Button>
                        <Button 
                            variant="success" 
                            size="sm" 
                            onClick={exportarDados}
                            disabled={ordensServico.length === 0}
                        >
                            <FaFileExport className="me-1" />
                            Exportar CSV
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {showFiltros && (
                        <div className="filtros-container mb-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Cliente</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="cliente" 
                                            value={filtros.cliente} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Nome do cliente"
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
                                        <Form.Label>Nº Série</Form.Label>
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
                                        <Form.Label>Fabricante</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="fabricante" 
                                            value={filtros.fabricante} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Fabricante"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Defeito Alegado</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="defeitoAlegado" 
                                            value={filtros.defeitoAlegado} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Defeito alegado pelo cliente"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Defeito Constatado</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="defeitoConstatado" 
                                            value={filtros.defeitoConstatado} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Defeito encontrado pelo técnico"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Serviço Realizado</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="servicoRealizado" 
                                            value={filtros.servicoRealizado} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Serviço executado"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
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
                                        <Form.Label>Valor Mín</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            name="valorMin" 
                                            value={filtros.valorMin} 
                                            onChange={handleFiltroChange} 
                                            placeholder="0,00"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Valor Máx</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            name="valorMax" 
                                            value={filtros.valorMax} 
                                            onChange={handleFiltroChange} 
                                            placeholder="9999,99"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
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
                                <Col md={2}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Dias Reparo</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            name="diasReparo" 
                                            value={filtros.diasReparo} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Ex: 5"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nota Fiscal</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="notaFiscal" 
                                            value={filtros.notaFiscal} 
                                            onChange={handleFiltroChange} 
                                            placeholder="Número da NF"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Pedido Compras</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="pedidoCompras" 
                                            value={filtros.pedidoCompras} 
                                            onChange={handleFiltroChange} 
                                            placeholder="ID Pedido"
                                            size="sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="d-flex align-items-end justify-content-end mb-3">
                                    <Button 
                                        variant="secondary" 
                                        size="sm" 
                                        onClick={limparFiltros} 
                                        className="me-2"
                                    >
                                        <FaTimes className="me-1" />
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
                            <p className="mt-2">Carregando relatório completo...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : ordensServico.length === 0 ? (
                        <div className="alert alert-info">
                            <FaTable className="me-2" />
                            Nenhuma ordem de serviço concluída encontrada com os filtros aplicados.
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <Table striped bordered hover size="sm">
                                    <thead className="bg-light">
                                        <tr>
                                            <th style={{minWidth: '60px'}}>ID</th>
                                            <th style={{minWidth: '150px'}}>Cliente</th>
                                            <th style={{minWidth: '120px'}}>Modelo</th>
                                            <th style={{minWidth: '100px'}}>Nº Série</th>
                                            <th style={{minWidth: '100px'}}>Fabricante</th>
                                            <th style={{minWidth: '200px'}}>Defeito Alegado</th>
                                            <th style={{minWidth: '200px'}}>Defeito Constatado</th>
                                            <th style={{minWidth: '200px'}}>Serviço Realizado</th>
                                            <th style={{minWidth: '100px'}}>Técnico</th>
                                            <th style={{minWidth: '100px'}}>Data Entrega</th>
                                            <th style={{minWidth: '100px'}}>Data Conclusão</th>
                                            <th style={{minWidth: '100px'}}>Valor</th>
                                            <th style={{minWidth: '100px'}}>Urgência</th>
                                            <th style={{minWidth: '120px'}}>Tipo Análise</th>
                                            <th style={{minWidth: '100px'}}>NF</th>
                                            <th style={{minWidth: '100px'}}>Pedido</th>
                                            <th style={{minWidth: '80px'}}>Dias</th>
                                            <th style={{minWidth: '80px'}}>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordensServico.map((os) => (
                                            <tr key={os.id}>
                                                <td><strong>#{os.id}</strong></td>
                                                <td>
                                                    <Button 
                                                        variant="link" 
                                                        size="sm" 
                                                        onClick={() => handleVerDetalhesCliente(os.cliente)}
                                                        className="p-0 text-decoration-none text-start"
                                                    >
                                                        {os.cliente?.nome || `Cliente ${os.cliente?.id}` || 'N/A'}
                                                    </Button>
                                                </td>
                                                <td>{os.modeloEquipamento?.modelo || 'N/A'}</td>
                                                <td>{os.numeroSerie || 'N/A'}</td>
                                                <td>{os.fabricante?.nome_fabricante || 'N/A'}</td>
                                                <td>
                                                    <div style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis'}} title={os.defeitoAlegado}>
                                                        {os.defeitoAlegado || 'N/A'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis'}} title={os.defeitoConstatado}>
                                                        {os.defeitoConstatado || 'N/A'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis'}} title={os.servicoRealizar}>
                                                        {os.servicoRealizar || 'N/A'}
                                                    </div>
                                                </td>
                                                <td>{os.vendedor?.nome || 'N/A'}</td>
                                                <td>{formatarData(os.dataEntrega)}</td>
                                                <td>{formatarData(os.dataEquipamentoPronto)}</td>
                                                <td>
                                                    <strong className="text-success">
                                                        {formatarValor(os.valor)}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <Badge bg="warning" text="dark">
                                                        {os.urgencia?.urgencia || 'N/A'}
                                                    </Badge>
                                                </td>
                                                <td>{os.tipoAnalise?.tipo_analise || 'N/A'}</td>
                                                <td>{os.notaFiscal || 'N/A'}</td>
                                                <td>{os.pedidoCompras || 'N/A'}</td>
                                                <td>
                                                    <Badge bg="info">
                                                        {os.diasReparo ? `${os.diasReparo}d` : 'N/A'}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm" 
                                                        title="Visualizar detalhes da OS"
                                                        onClick={() => window.open(`/cadastrar-ordem-servico/${os.id}`, '_blank')}
                                                    >
                                                        <FaEye size={12} />
                                                    </Button>
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

export default TelaRelatorioCompleto;