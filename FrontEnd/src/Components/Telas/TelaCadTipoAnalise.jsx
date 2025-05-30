import { useState, useEffect } from 'react';
import LayoutModerno from '../LayoutModerno/LayoutModerno';
import CardModerno from '../LayoutModerno/CardModerno';
import { Form, Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { buscarTiposAnalise, adicionarTipoAnalise, atualizarTipoAnalise, excluirTipoAnalise } from '../../Services/tipoAnaliseService.js';

const TelaCadTipoAnalise = () => {
  const [tiposAnalise, setTiposAnalise] = useState([]);
  const [tipoAnaliseAtual, setTipoAnaliseAtual] = useState('');
  const [idAtual, setIdAtual] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  const carregarTiposAnalise = async (termo = '') => {
    try {
      const resposta = await buscarTiposAnalise(termo);
      setTiposAnalise(resposta.listaTiposAnalise || []); 
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao carregar tipos de análise: ${error.message}` });
      setTiposAnalise([]);
    }
  };

  useEffect(() => {
    carregarTiposAnalise();
  }, []);

  const handleChange = (e) => {
    setTipoAnaliseAtual(e.target.value);
  };

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    carregarTiposAnalise(termoBusca);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipoAnaliseAtual.trim()) {
      setFeedback({ tipo: 'warning', mensagem: 'Por favor, informe o tipo de análise.' });
      return;
    }

    const dadosTipoAnalise = { tipo_analise: tipoAnaliseAtual }; // Corrigido para tipo_analise
    if (modoEdicao && idAtual) {
      dadosTipoAnalise.id = idAtual;
    }

    try {
      if (modoEdicao) {
        await atualizarTipoAnalise(dadosTipoAnalise);
        setFeedback({ tipo: 'success', mensagem: 'Tipo de análise atualizado com sucesso!' });
      } else {
        await adicionarTipoAnalise(dadosTipoAnalise);
        setFeedback({ tipo: 'success', mensagem: 'Tipo de análise adicionado com sucesso!' });
      }
      limparFormulario();
      carregarTiposAnalise();
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao salvar tipo de análise: ${error.message}` });
    }
  };

  const handleEditar = (tipoAnalise) => {
    setModoEdicao(true);
    setIdAtual(tipoAnalise.id);
    setTipoAnaliseAtual(tipoAnalise.tipo_analise); // Corrigido para tipo_analise
    setFeedback({ tipo: '', mensagem: '' });
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo de análise?')) {
      try {
        await excluirTipoAnalise(id);
        setFeedback({ tipo: 'info', mensagem: 'Tipo de análise excluído com sucesso!' });
        carregarTiposAnalise();
        limparFormulario();
      } catch (error) {
        setFeedback({ tipo: 'danger', mensagem: `Erro ao excluir tipo de análise: ${error.message}` });
      }
    }
  };

  const limparFormulario = () => {
    setTipoAnaliseAtual('');
    setIdAtual(null);
    setModoEdicao(false);
    setFeedback({ tipo: '', mensagem: '' });
  };

  return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={12} lg={11}>
            <CardModerno titulo="Cadastro de Tipos de Análise">
              {feedback.mensagem && <Alert variant={feedback.tipo}>{feedback.mensagem}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="tipoAnalise">Tipo de Análise</Form.Label>
                  <Form.Control
                    type="text"
                    id="tipoAnalise"
                    value={tipoAnaliseAtual}
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
          <Col md={12} lg={11}>
            <CardModerno titulo="Tipos de Análise Cadastrados">
              <Form onSubmit={handleBuscar} className="mb-3">
                <Row>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      value={termoBusca}
                      onChange={handleBuscaChange}
                      placeholder="Buscar por tipo de análise..."
                    />
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button variant="info" type="submit" className="w-100">
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </Form>
              {tiposAnalise.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tipo de Análise</th>
                      <th style={{ width: '120px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiposAnalise.map((tipo) => (
                      <tr key={tipo.id}>
                        <td>{tipo.id}</td>
                        <td>{tipo.tipo_analise}</td>
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
                <Alert variant="info">Nenhum tipo de análise encontrado.</Alert>
              )}
            </CardModerno>
          </Col>
        </Row>
      </Container>
  );
};

export default TelaCadTipoAnalise;

