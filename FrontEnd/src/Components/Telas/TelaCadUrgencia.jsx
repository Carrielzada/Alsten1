import { Form, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import Button from '../UI/Button';
import CardModerno from '../LayoutModerno/CardModerno';
import { useState, useEffect} from "react";
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { buscarUrgencia, adicionarUrgencia, atualizarUrgencia, excluirUrgencia } from '../../Services/urgenciaService.js'; // Caminho corrigido e real
import { useToast } from '../../hooks/useToast';


const TelaCadUrgencia = () => {
  const toast = useToast();
  const [urgencia, setUrgencia] = useState([]);
  const [urgenciaAtual, setUrgenciaAtual] = useState('');
  const [idAtual, setIdAtual] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  const carregarUrgencia = async (termo = '') => {
    try {
      setLoading(true);
      const resposta = await buscarUrgencia(termo);
      setUrgencia(resposta.listaUrgencias || []); 
      
      if (termo && termo.trim()) {
        toast.success(`${resposta.listaUrgencias?.length || 0} urgências encontradas para "${termo}"`);
      }
    } catch (error) {
      console.error('Erro ao carregar urgências:', error);
      const errorMsg = `Erro ao carregar urgências: ${error.message}`;
      setFeedback({ tipo: 'danger', mensagem: errorMsg });
      toast.error(errorMsg);
      setUrgencia([]);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
        carregarUrgencia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast.warning('Por favor, informe o nível de urgência.');
      return;
    }

    const dadosUrgencia = { urgencia: urgenciaAtual };
    if (modoEdicao && idAtual) {
      dadosUrgencia.id = idAtual;
    }

    try {
      setSaving(true);
      if (modoEdicao) {
        await atualizarUrgencia(dadosUrgencia);
        toast.success('Nível de urgência atualizado com sucesso!');
      } else {
        await adicionarUrgencia(dadosUrgencia);
        toast.success('Nível de urgência adicionado com sucesso!');
      }
      limparFormulario();
      carregarUrgencia();
    } catch (error) {
      console.error('Erro ao salvar urgência:', error);
      const errorMsg = `Erro ao salvar urgência: ${error.message}`;
      toast.error(errorMsg);
      setFeedback({ tipo: 'danger', mensagem: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleEditar = (urgencia) => {
    setModoEdicao(true);
    setIdAtual(urgencia.id);
    setUrgenciaAtual(urgencia.urgencia);
    setFeedback({ tipo: '', mensagem: '' });
  };

  const handleExcluir = async (id, nomeUrgencia) => {
    if (window.confirm(`Tem certeza que deseja excluir "${nomeUrgencia}"?\n\nEsta ação não pode ser desfeita.`)) {
      try {
        await excluirUrgencia(id);
        toast.success(`Nível de urgência "${nomeUrgencia}" excluído com sucesso!`);
        carregarUrgencia();
        limparFormulario();
      } catch (error) {
        console.error('Erro ao excluir urgência:', error);
        const errorMsg = `Erro ao excluir urgência: ${error.message}`;
        toast.error(errorMsg);
        setFeedback({ tipo: 'danger', mensagem: errorMsg });
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
                  <Button variant="secondary" type="button" onClick={limparFormulario} className="me-2" disabled={saving}>
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Salvando...</span>
                        </div>
                        Salvando...
                      </>
                    ) : (
                      modoEdicao ? 'Atualizar' : 'Salvar'
                    )}
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
                <Row className="align-items-end">
                  <Col xs={12} md={9}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        value={termoBusca}
                        onChange={handleBuscaChange}
                        placeholder="Buscar por nível de urgência..."
                        size="lg"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100"
                      size="lg"
                      disabled={loading}
                      style={{ backgroundColor: "#191970", borderColor: "#191970" }}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Buscando...</span>
                          </div>
                          Buscando...
                        </>
                      ) : (
                        <>
                          <FaSearch className="me-2" />
                          Buscar
                        </>
                      )}
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
                            onClick={() => handleExcluir(urgencia.id, urgencia.urgencia)}
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
