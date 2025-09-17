import { useState, useEffect } from 'react';
import CardModerno from '../LayoutModerno/CardModerno';
import { Form, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import Button from '../UI/Button';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { buscarPagamento, atualizarPagamento, excluirPagamento, adicionarPagamento } from "../../Services/pagamentoService.js";
import { useToast } from '../../hooks/useToast';


const TelaCadPagamento = () => {
  const toast = useToast();
  const [pagamento, setPagamento] = useState([]);
  const [pagamentoAtual, setPagamentoAtual] = useState('');
  const [idAtual, setIdAtual] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });


    const carregarPagamento = async (termo = '') => {
      try {
        setLoading(true);
        const resposta = await buscarPagamento(termo);
        setPagamento(resposta.listaPagamentos || []); 
        
        if (termo && termo.trim()) {
          toast.success(`${resposta.listaPagamentos?.length || 0} formas de pagamento encontradas para "${termo}"`);
        }
      } catch (error) {
        console.error('Erro ao carregar pagamentos:', error);
        const errorMsg = `Erro ao carregar formas de pagamento: ${error.message}`;
        setFeedback({ tipo: 'danger', mensagem: errorMsg });
        toast.error(errorMsg);
        setPagamento([]);
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    carregarPagamento();
  }, []);

  const handleChange = (e) => {
    setPagamentoAtual(e.target.value);
  };

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    carregarPagamento(termoBusca);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pagamentoAtual.trim()) {
      toast.warning('Por favor, informe a forma de pagamento.');
      return;
    }

    const dadosPagamento = { pagamento: pagamentoAtual };
    if (modoEdicao && idAtual) {
      dadosPagamento.id = idAtual;
    }

    try {
      setSaving(true);
      if (modoEdicao) {
        await atualizarPagamento(dadosPagamento);
        toast.success('Forma de pagamento atualizada com sucesso!');
      } else {
        await adicionarPagamento(dadosPagamento);
        toast.success('Forma de pagamento adicionada com sucesso!');
      }
      limparFormulario();
      carregarPagamento();
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
      const errorMsg = `Erro ao salvar forma de pagamento: ${error.message}`;
      toast.error(errorMsg);
      setFeedback({ tipo: 'danger', mensagem: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleEditar = (pagamento) => {
    setModoEdicao(true);
    setIdAtual(pagamento.id);
    setPagamentoAtual(pagamento.pagamento); 
    setFeedback({ tipo: '', mensagem: '' });
  };

  const handleExcluir = async (id, nomePagamento) => {
    if (window.confirm(`Tem certeza que deseja excluir "${nomePagamento}"?\n\nEsta ação não pode ser desfeita.`)) {
      try {
        await excluirPagamento(id);
        toast.success(`Forma de pagamento "${nomePagamento}" excluída com sucesso!`);
        carregarPagamento();
        limparFormulario();
      } catch (error) {
        console.error('Erro ao excluir pagamento:', error);
        const errorMsg = `Erro ao excluir forma de pagamento: ${error.message}`;
        toast.error(errorMsg);
        setFeedback({ tipo: 'danger', mensagem: errorMsg });
      }
    }
  };

  const limparFormulario = () => {
    setPagamentoAtual('');
    setIdAtual(null);
    setModoEdicao(false);
    setFeedback({ tipo: '', mensagem: '' });
  };

  return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={12} lg={11}>
            <CardModerno titulo="Cadastro de Formas de Pagamento">
              {feedback.mensagem && <Alert variant={feedback.tipo}>{feedback.mensagem}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="pagamento">Formas de Pagamento</Form.Label>
                  <Form.Control
                    type="text"
                    id="pagamento"
                    value={pagamentoAtual}
                    onChange={handleChange}
                    placeholder="Insira aqui os dados"
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
            <CardModerno titulo="Formas de Pagamento Cadastradas">
              <Form onSubmit={handleBuscar} className="mb-3">
                <Row className="align-items-end">
                  <Col xs={12} md={9}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        value={termoBusca}
                        onChange={handleBuscaChange}
                        placeholder="Buscar por formas de pagamento..."
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
              {pagamento.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Forma de Pagamento</th>
                      <th style={{ width: '120px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagamento.map((pagamento) => (
                      <tr key={pagamento.id}>
                        <td>{pagamento.id}</td>
                        <td>{pagamento.pagamento}</td>
                        <td>
                          <Button 
                            variant="warning" 
                            onClick={() => handleEditar(pagamento)} 
                            className="btn-icon"
                            title="Editar"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="danger" 
                            onClick={() => handleExcluir(pagamento.id, pagamento.pagamento)}
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
                <Alert variant="info">Nenhuma forma de pagamento encontrada.</Alert>
              )}
            </CardModerno>
          </Col>
        </Row>
      </Container>
  );
};

export default TelaCadPagamento;

