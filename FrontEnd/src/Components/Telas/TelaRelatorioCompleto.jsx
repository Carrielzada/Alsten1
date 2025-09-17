import React, { useState, useEffect, useCallback } from 'react';
import { Table, Form, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import Button from '../UI/Button';
import { FaFilter, FaEye, FaTimes, FaTable, FaFileExport } from 'react-icons/fa';
// Layout será fornecido pelo LayoutModerno - não importar aqui
import { buscarTodasOrdensServico } from '../../Services/ordemServicoService';
import ClienteInfoModal from '../busca/ClienteInfoModal';
import { useToast } from '../../hooks/useToast';

const TelaRelatorioCompleto = () => {
    const toast = useToast();
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

    const fetchOrdensServico = useCallback(async () => {
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
            console.error('Erro ao carregar relatório:', err);
            const errorMessage = err?.response?.data?.mensagem || 
                               err?.message || 
                               'Erro ao carregar relatório completo';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [filtros, paginaAtual, itensPorPagina]);

    useEffect(() => {
        fetchOrdensServico();
    }, [fetchOrdensServico]);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
        // Aplicar filtros automaticamente após mudança
        setPaginaAtual(1);
    };
    
    // useEffect para aplicar filtros automaticamente quando mudarem
    useEffect(() => {
        if (!loading) {
            fetchOrdensServico();
        }
    }, [filtros, paginaAtual, itensPorPagina, loading, fetchOrdensServico]);

    // Função removida - filtros são aplicados automaticamente via useEffect

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
        toast.info('Filtros limpos - exibindo todos os resultados');
        // fetchOrdensServico será chamado automaticamente pelo useEffect quando os filtros mudarem
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
        
        toast.success(`Relatório exportado com sucesso! ${ordensServico.length} registros salvos em CSV.`);
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
        <>
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
                                <Col xs={12} sm={6} md={3}>
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
                                <Col xs={12} sm={6} md={3}>
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
                                <Col xs={12} sm={6} md={3}>
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
                                <Col xs={12} sm={6} md={3}>
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
                                        variant="outline-secondary" 
                                        size="sm" 
                                        onClick={limparFiltros}
                                    >
                                        <FaTimes className="me-1" />
                                        Limpar Filtros
                                    </Button>
                                    <small className="text-muted ms-3 align-self-center">
                                        Filtros aplicados automaticamente
                                    </small>
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
                            <div className="table-responsive" style={{fontSize: '0.85rem'}}>
                                <Table striped hover size="sm" className="table-compact">
                                    <thead className="bg-light sticky-top">
                                        <tr>
                                            <th style={{width: '50px', padding: '6px'}}>ID</th>
                                            <th style={{width: '140px', padding: '6px'}}>Cliente</th>
                                            <th style={{width: '110px', padding: '6px'}}>Modelo</th>
                                            <th style={{width: '90px', padding: '6px'}}>Nº Série</th>
                                            <th style={{width: '90px', padding: '6px'}}>Fabricante</th>
                                            <th style={{width: '150px', padding: '6px'}}>Defeito Alegado</th>
                                            <th style={{width: '150px', padding: '6px'}}>Defeito Constatado</th>
                                            <th style={{width: '150px', padding: '6px'}}>Serviço Realizado</th>
                                            <th style={{width: '80px', padding: '6px'}}>Técnico</th>
                                            <th style={{width: '85px', padding: '6px'}}>Entrega</th>
                                            <th style={{width: '85px', padding: '6px'}}>Conclusão</th>
                                            <th style={{width: '80px', padding: '6px'}}>Valor</th>
                                            <th style={{width: '70px', padding: '6px'}}>Urgência</th>
                                            <th style={{width: '90px', padding: '6px'}}>Tipo Análise</th>
                                            <th style={{width: '60px', padding: '6px'}}>NF</th>
                                            <th style={{width: '70px', padding: '6px'}}>Pedido</th>
                                            <th style={{width: '50px', padding: '6px'}}>Dias</th>
                                            <th style={{width: '50px', padding: '6px'}}>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordensServico.map((os) => (
                                            <tr key={os.id}>
                                                <td style={{padding: '8px', textAlign: 'center'}}><strong className="text-primary">#{os.id}</strong></td>
                                                <td style={{padding: '8px'}}>
                                                    <span 
                                                        className="text-primary fw-semibold" 
                                                        style={{cursor: 'pointer'}} 
                                                        onClick={() => handleVerDetalhesCliente(os.cliente)}
                                                        title="Clique para ver detalhes do cliente"
                                                    >
                                                        {os.cliente?.nome || `Cliente ${os.cliente?.id}` || 'N/A'}
                                                    </span>
                                                </td>
                                                <td style={{padding: '8px'}} title={os.modeloEquipamento?.modelo}>
                                                    <div className="text-truncate" style={{maxWidth: '100px'}}>
                                                        {os.modeloEquipamento?.modelo || 'N/A'}
                                                    </div>
                                                </td>
                                                <td style={{padding: '8px'}} title={os.numeroSerie}>
                                                    <small className="text-muted">{os.numeroSerie || 'N/A'}</small>
                                                </td>
                                                <td style={{padding: '8px'}} title={os.fabricante?.nome_fabricante}>
                                                    <div className="text-truncate" style={{maxWidth: '80px'}}>
                                                        {os.fabricante?.nome_fabricante || 'N/A'}
                                                    </div>
                                                </td>
                                                <td style={{padding: '8px'}} title={os.defeitoAlegado}>
                                                    <div className="text-truncate" style={{maxWidth: '140px', fontSize: '0.8rem'}}>
                                                        {os.defeitoAlegado || 'N/A'}
                                                    </div>
                                                </td>
                                                <td style={{padding: '8px'}} title={os.defeitoConstatado}>
                                                    <div className="text-truncate" style={{maxWidth: '140px', fontSize: '0.8rem'}}>
                                                        {os.defeitoConstatado || 'N/A'}
                                                    </div>
                                                </td>
                                                <td style={{padding: '8px'}} title={os.servicoRealizar}>
                                                    <div className="text-truncate" style={{maxWidth: '140px', fontSize: '0.8rem'}}>
                                                        {os.servicoRealizar || 'N/A'}
                                                    </div>
                                                </td>
                                                <td style={{padding: '8px'}} title={os.vendedor?.nome}>
                                                    <small>{os.vendedor?.nome || 'N/A'}</small>
                                                </td>
                                                <td style={{padding: '8px', textAlign: 'center'}}>
                                                    <small>{formatarData(os.dataEntrega)}</small>
                                                </td>
                                                <td style={{padding: '8px', textAlign: 'center'}}>
                                                    <small>{formatarData(os.dataEquipamentoPronto)}</small>
                                                </td>
                                                <td style={{padding: '8px', textAlign: 'right'}}>
                                                    <small className="text-success fw-bold">
                                                        {formatarValor(os.valor)}
                                                    </small>
                                                </td>
                                                <td style={{padding: '8px', textAlign: 'center'}}>
                                                    <Badge bg="warning" text="dark" className="small">
                                                        {os.urgencia?.urgencia?.substring(0,3) || 'N/A'}
                                                    </Badge>
                                                </td>
                                                <td style={{padding: '8px'}} title={os.tipoAnalise?.tipo_analise}>
                                                    <small>{os.tipoAnalise?.tipo_analise || 'N/A'}</small>
                                                </td>
                                                <td style={{padding: '8px', textAlign: 'center'}}>
                                                    <small>{os.notaFiscal || '-'}</small>
                                                </td>
                                                <td style={{padding: '8px', textAlign: 'center'}}>
                                                    <small>{os.pedidoCompras || '-'}</small>
                                                </td>
                                                <td style={{padding: '8px', textAlign: 'center'}}>
                                                    <Badge bg="info" className="small">
                                                        {os.diasReparo ? `${os.diasReparo}d` : '-'}
                                                    </Badge>
                                                </td>
                                                <td style={{padding: '8px', textAlign: 'center'}}>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm" 
                                                        title="Visualizar detalhes da OS"
                                                        onClick={() => window.open(`/cadastrar-ordem-servico/${os.id}`, '_blank')}
                                                        style={{padding: '4px 8px'}}
                                                    >
                                                        <FaEye size={10} />
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
        </>
    );
};

export default TelaRelatorioCompleto;