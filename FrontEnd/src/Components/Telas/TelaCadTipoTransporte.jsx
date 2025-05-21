import { useState, useEffect } from 'react';
import LayoutModerno from '../LayoutModerno/LayoutModerno.jsx';
import CardModerno from '../LayoutModerno/CardModerno.jsx';
import { Form, Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { buscarTiposTransporte, adicionarTipoTransporte, atualizarTipoTransporte, excluirTipoTransporte } from '../../Services/tipoTransporteService.js';

const TelaCadTipoTransporte = () => {
  const [tiposTransporte, setTiposTransporte] = useState([]);
  const [tipoTransporteAtual, setTipoTransporteAtual] = useState('');
  const [idAtual, setIdAtual] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  const carregarTiposTransporte = async (termo = '') => {
    try {
      const resposta = await buscarTiposTransporte(termo);
      setTiposTransporte(resposta.listaTiposTransporte || []); 
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao carregar tipos de transporte: ${error.message}` });
      setTiposTransporte([]);
    }
  };

  useEffect(() => {
    carregarTiposTransporte();
  }, []);

  const handleChange = (e) => {
    setTipoTransporteAtual(e.target.value);
  };

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    carregarTiposTransporte(termoBusca);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipoTransporteAtual.trim()) {
      setFeedback({ tipo: 'warning', mensagem: 'Por favor, informe o tipo de Transporte.' });
      return;
    }

    const dadosTipoTransporte = { tipo_transporte: tipoTransporteAtual }; // Corrigido para tipo_transporte
    if (modoEdicao && idAtual) {
      dadosTipoTransporte.id = idAtual;
    }

    try {
      if (modoEdicao) {
        await atualizarTipoTransporte(dadosTipoTransporte);
        setFeedback({ tipo: 'success', mensagem: 'Tipo de transporte atualizado com sucesso!' });
      } else {
        await adicionarTipoTransporte(dadosTipoTransporte);
        setFeedback({ tipo: 'success', mensagem: 'Tipo de transporte adicionado com sucesso!' });
      }
      limparFormulario();
      carregarTiposTransporte();
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao salvar tipo de transporte: ${error.message}` });
    }
  };

  const handleEditar = (tipoTransporte) => {
    setModoEdicao(true);
    setIdAtual(tipoTransporte.id);
    setTipoTransporteAtual(tipoTransporte.tipo_transporte); // Corrigido para tipo_transporte
    setFeedback({ tipo: '', mensagem: '' });
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo de transporte?')) {
      try {
        await excluirTipoTransporte(id);
        setFeedback({ tipo: 'info', mensagem: 'Tipo de transporte excluído com sucesso!' });
        carregarTiposTransporte();
        limparFormulario();
      } catch (error) {
        setFeedback({ tipo: 'danger', mensagem: `Erro ao excluir tipo de transporte: ${error.message}` });
      }
    }
  };

  const limparFormulario = () => {
    setTipoTransporteAtual('');
    setIdAtual(null);
    setModoEdicao(false);
    setFeedback({ tipo: '', mensagem: '' });
  };

  return (
    <LayoutModerno>
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <CardModerno titulo="Cadastro de Tipos de Transporte">
              {feedback.mensagem && <Alert variant={feedback.tipo}>{feedback.mensagem}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="tipoTransporte">Tipo de Transporte</Form.Label>
                  <Form.Control
                    type="text"
                    id="tipoTransporte"
                    value={tipoTransporteAtual}
                    onChange={handleChange}
                    placeholder="Ex: Apenas orçamento, Consertar e orçar"
                    required
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button variant="secondary" type="button" onClick={limparFormulario} className="me-2">
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit">
                    {modoEdicao ? 'Atualizar' : 'Salvar'}
                  </Button>
                </div>
              </Form>
            </CardModerno>
          </Col>
        </Row>

        <Row className="mt-4 justify-content-center">
          <Col md={10} lg={8}>
            <CardModerno titulo="Tipos de Transporte Cadastrados">
              <Form onSubmit={handleBuscar} className="mb-3">
                <Row>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      value={termoBusca}
                      onChange={handleBuscaChange}
                      placeholder="Buscar por tipo de transporte..."
                    />
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button variant="info" type="submit" className="w-100">
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </Form>
              {tiposTransporte.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tipo de Transporte</th>
                      <th style={{ width: '120px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiposTransporte.map((tipo) => (
                      <tr key={tipo.id}>
                        <td>{tipo.id}</td>
                        <td>{tipo.tipo_transporte}</td>
                        <td>
                          <Button variant="warning" size="sm" onClick={() => handleEditar(tipo)} className="me-1">
                            Editar
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleExcluir(tipo.id)}>
                            Excluir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">Nenhum tipo de transporte encontrado.</Alert>
              )}
            </CardModerno>
          </Col>
        </Row>
      </Container>
    </LayoutModerno>
  );
};

export default TelaCadTipoTransporte;

