import { Form, Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import CardModerno from '../LayoutModerno/CardModerno';
import { useState, useEffect} from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { buscarUrgencia, adicionarUrgencia, atualizarUrgencia, excluirUrgencia } from '../../Services/urgenciaService.js'; // Caminho corrigido e real


const TelaCadUrgencia = () => {
  const [urgencia, setUrgencia] = useState([]);
  const [urgenciaAtual, setUrgenciaAtual] = useState('');
  const [idAtual, setIdAtual] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [feedback, setFeedback] = useState({ urgencia: '', mensagem: '' });

  const carregarUrgencia = async (termo = '') => {
    try {
      const resposta = await buscarUrgencia(termo);
      setUrgencia(resposta.listaUrgencias || []); 
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao carregar urgências: ${error.message}` });
      setUrgencia([]);
    }
  };

  useEffect(() => {
    carregarUrgencia();
  }, []);

  const handleChange = (e) => {
    setUrgenciaAtual(e.target.value);
  };

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    carregarUrgencia(termoBusca);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!urgenciaAtual.trim()) {
      setFeedback({ tipo: 'warning', mensagem: 'Por favor, informe a urgência.' });
      return;
    }

    const dadosUrgencia = { urgencia: urgenciaAtual }; // Corrigido para urgencia
    if (modoEdicao && idAtual) {
      dadosUrgencia.id = idAtual;
    }

    try {
      if (modoEdicao) {
        await atualizarUrgencia(dadosUrgencia);
        setFeedback({ tipo: 'success', mensagem: 'Urgencia atualizada com sucesso!' });
      } else {
        await adicionarUrgencia(dadosUrgencia);
        setFeedback({ tipo: 'success', mensagem: 'Urgencia adicionada com sucesso!' });
      }
      limparFormulario();
      carregarUrgencia();
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao salvar urgencia: ${error.message}` });
    }
  };

  const handleEditar = (urgencia) => {
    setModoEdicao(true);
    setIdAtual(urgencia.id);
    setUrgenciaAtual(urgencia.urgencia); // Corrigido para urgencia
    setFeedback({ tipo: '', mensagem: '' });
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta urgência?')) {
      try {
        await excluirUrgencia(id);
        setFeedback({ tipo: 'info', mensagem: 'Urgência excluído com sucesso!' });
        carregarUrgencia();
        limparFormulario();
      } catch (error) {
        setFeedback({ tipo: 'danger', mensagem: `Erro ao excluir urgência: ${error.message}` });
      }
    }
  };

  const limparFormulario = () => {
    setUrgenciaAtual('');
    setIdAtual(null);
    setModoEdicao(false);
    setFeedback({ tipo: '', mensagem: '' });
  };

  return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={12} lg={11}>
            <CardModerno titulo="Cadastro de Níveis de Urgência">
              {feedback.mensagem && <Alert variant={feedback.tipo}>{feedback.mensagem}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="urgencia">Nível de Urgencia</Form.Label>
                  <Form.Control
                    type="text"
                    id="urgencia"
                    value={urgenciaAtual}
                    onChange={handleChange}
                    placeholder="Ex: Alta, baixíssima"
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
            <CardModerno titulo="Níveis de Urgência Cadastrados">
              <Form onSubmit={handleBuscar} className="mb-3">
                <Row className="align-items-center">
                  <Col md={9}>
                    <Form.Control
                      type="text"
                      value={termoBusca}
                      onChange={handleBuscaChange}
                      placeholder="Buscar por nível de urgência..."
                      className="form-control-lg"
                    />
                  </Col>
                  <Col md={3} className="d-flex justify-content-start">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="btn-lg w-100"
                      style={{ backgroundColor: "#191970", borderColor: "#191970" }}
                    >
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </Form>
              {urgencia.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Urgencia</th>
                      <th style={{ width: '120px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urgencia.map((urgencia) => (
                      <tr key={urgencia.id}>
                        <td>{urgencia.id}</td>
                        <td>{urgencia.urgencia}</td>
                        <td>
                          <Button 
                            variant="warning" 
                            onClick={() => handleEditar(urgencia)} 
                            className="btn-icon"
                            title="Editar"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="danger" 
                            onClick={() => handleExcluir(urgencia.id)}
                            className="btn-icon"
                            title="Excluir"
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">Nenhum nível de urgência encontrado.</Alert>
              )}
            </CardModerno>
          </Col>
        </Row>
      </Container>
  );
};

export default TelaCadUrgencia;
