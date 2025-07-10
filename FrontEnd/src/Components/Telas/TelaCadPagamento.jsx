import { useState, useEffect } from 'react';
import CardModerno from '../LayoutModerno/CardModerno';
import { Form, Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { buscarPagamento, atualizarPagamento, excluirPagamento, adicionarPagamento } from "../../Services/pagamentoService.js";


const TelaCadPagamento = () => {
  const [pagamento, setPagamento] = useState([]);
  const [pagamentoAtual, setPagamentoAtual] = useState('');
  const [idAtual, setIdAtual] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [feedback, setFeedback] = useState({ pagamento: '', mensagem: '' });


    const carregarPagamento = async (termo = '') => {
      try {
        const resposta = await buscarPagamento(termo);
        setPagamento(resposta.listaPagamentos || []); 
      } catch (error) {
        setFeedback({ tipo: 'danger', mensagem: `Erro ao carregar formas de pagamento: ${error.message}` });
        setPagamento([]);
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
      setFeedback({ tipo: 'warning', mensagem: 'Por favor, informe a forma de pagamento.' });
      return;
    }

    const dadosPagamento = { pagamento: pagamentoAtual };
    if (modoEdicao && idAtual) {
      dadosPagamento.id = idAtual;
    }

    try {
      if (modoEdicao) {
        await atualizarPagamento(dadosPagamento);
        setFeedback({ tipo: 'success', mensagem: 'Forma de pagamento atualizada com sucesso!' });
      } else {
        await adicionarPagamento(dadosPagamento);
        setFeedback({ tipo: 'success', mensagem: 'Forma de pagamento adicionada com sucesso!' });
      }
      limparFormulario();
      carregarPagamento();
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao salvar forma de pagamento: ${error.message}` });
    }
  };

  const handleEditar = (pagamento) => {
    setModoEdicao(true);
    setIdAtual(pagamento.id);
    setPagamentoAtual(pagamento.pagamento); 
    setFeedback({ tipo: '', mensagem: '' });
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta forma de pagamento?')) {
      try {
        await excluirPagamento(id);
        setFeedback({ tipo: 'info', mensagem: 'Forma de pagamento excluída com sucesso!' });
        carregarPagamento();
        limparFormulario();
      } catch (error) {
        setFeedback({ tipo: 'danger', mensagem: `Erro ao excluir forma de pagamento: ${error.message}` });
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
            <CardModerno titulo="Formas de Pagamento Cadastradas">
              <Form onSubmit={handleBuscar} className="mb-3">
                <Row className="align-items-center">
                  <Col md={9}>
                    <Form.Control
                      type="text"
                      value={termoBusca}
                      onChange={handleBuscaChange}
                      placeholder="Buscar por formas de pagamento..."
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
                            onClick={() => handleExcluir(pagamento.id)}
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

