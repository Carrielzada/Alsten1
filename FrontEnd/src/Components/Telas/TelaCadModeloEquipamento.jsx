import { useState, useEffect } from 'react';
import CardModerno from '../LayoutModerno/CardModerno';
import { Form, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Button from '../UI/Button'; // Nosso Button moderno
import { buscarModelo, atualizarModelo, excluirModelo, adicionarModelo } from "../../Services/modeloService.js";
import { useToast } from '../../hooks/useToast';


const TelaCadModeloEquipamento = () => {
  const toast = useToast();
  const [modelo, setModelo] = useState([]);
  const [modeloAtual, setModeloAtual] = useState('');
  const [idAtual, setIdAtual] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });


    const carregarModelo = async (termo = '') => {
      try {
        setLoading(true);
        const resposta = await buscarModelo(termo);
        setModelo(resposta.listaModelos || []); 
        
        if (termo && termo.trim()) {
          toast.success(`${resposta.listaModelos?.length || 0} modelos encontrados para "${termo}"`);
        }
      } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        const errorMsg = `Erro ao carregar modelos: ${error.message}`;
        setFeedback({ tipo: 'danger', mensagem: errorMsg });
        toast.error(errorMsg);
        setModelo([]);
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    carregarModelo();
  }, []);

  const handleChange = (e) => {
    setModeloAtual(e.target.value);
  };

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    carregarModelo(termoBusca);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modeloAtual.trim()) {
      toast.warning('Por favor, informe o modelo de equipamento.');
      return;
    }

    const dadosModelo = { modelo: modeloAtual };
    if (modoEdicao && idAtual) {
      dadosModelo.id = idAtual;
    }

    try {
      setSaving(true);
      if (modoEdicao) {
        await atualizarModelo(dadosModelo);
        toast.success('Modelo de equipamento atualizado com sucesso!');
      } else {
        await adicionarModelo(dadosModelo);
        toast.success('Modelo de equipamento adicionado com sucesso!');
      }
      limparFormulario();
      carregarModelo();
    } catch (error) {
      console.error('Erro ao salvar modelo:', error);
      const errorMsg = `Erro ao salvar modelo: ${error.message}`;
      toast.error(errorMsg);
      setFeedback({ tipo: 'danger', mensagem: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleEditar = (modelo) => {
    setModoEdicao(true);
    setIdAtual(modelo.id);
    setModeloAtual(modelo.modelo); 
    setFeedback({ tipo: '', mensagem: '' });
  };

  const handleExcluir = async (id, nomeModelo) => {
    if (window.confirm(`Tem certeza que deseja excluir o modelo "${nomeModelo}"?\n\nEsta ação não pode ser desfeita.`)) {
      try {
        await excluirModelo(id);
        toast.success(`Modelo "${nomeModelo}" excluído com sucesso!`);
        carregarModelo();
        limparFormulario();
      } catch (error) {
        console.error('Erro ao excluir modelo:', error);
        const errorMsg = `Erro ao excluir modelo: ${error.message}`;
        toast.error(errorMsg);
        setFeedback({ tipo: 'danger', mensagem: errorMsg });
      }
    }
  };

  const limparFormulario = () => {
    setModeloAtual('');
    setIdAtual(null);
    setModoEdicao(false);
    setFeedback({ tipo: '', mensagem: '' });
  };

  return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={12} lg={11}>
            <CardModerno titulo="Cadastro de Modelos de Equipamento">
              {feedback.mensagem && <Alert variant={feedback.tipo}>{feedback.mensagem}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="modelo">Modelo de equipamento</Form.Label>
                  <Form.Control
                    type="text"
                    id="modelo"
                    value={modeloAtual}
                    onChange={handleChange}
                    placeholder="Insira aqui os dados"
                    required
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button 
                    variant="secondary" 
                    type="button" 
                    onClick={limparFormulario} 
                    className="btn-cad me-2"
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="btn-cad"
                    disabled={saving}
                  >
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
            <CardModerno titulo="Formas de Modelo Cadastradas">
              <Form onSubmit={handleBuscar} className="mb-3">
                <Row className="align-items-end">
                  <Col xs={12} md={9}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        value={termoBusca}
                        onChange={handleBuscaChange}
                        placeholder="Buscar por modelos de equipamentos..."
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
              {modelo.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Modelo de Equipamento</th>
                      <th style={{ width: '120px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelo.map((modelo) => (
                      <tr key={modelo.id}>
                        <td>{modelo.id}</td>
                        <td>{modelo.modelo}</td>
                        <td>
                          <Button 
                            variant="warning" 
                            onClick={() => handleEditar(modelo)} 
                            className="btn-icon"
                            title="Editar"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="danger" 
                            onClick={() => handleExcluir(modelo.id, modelo.modelo)} 
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
                <Alert variant="info">Nenhum modelo de equipamento encontrado.</Alert>
              )}
            </CardModerno>
          </Col>
        </Row>
      </Container>
  );
};

export default TelaCadModeloEquipamento;

