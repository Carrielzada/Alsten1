import { useState, useEffect } from 'react';
import CardModerno from '../LayoutModerno/CardModerno';
import { Form, Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { buscarModelo, atualizarModelo, excluirModelo, adicionarModelo } from "../../Services/modeloService.js";


const TelaCadModeloEquipamento = () => {
  const [modelo, setModelo] = useState([]);
  const [modeloAtual, setModeloAtual] = useState('');
  const [idAtual, setIdAtual] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [feedback, setFeedback] = useState({ modelo: '', mensagem: '' });


    const carregarModelo = async (termo = '') => {
      try {
        const resposta = await buscarModelo(termo);
        setModelo(resposta.listaModelos || []); 
      } catch (error) {
        setFeedback({ tipo: 'danger', mensagem: `Erro ao carregar formas de modelo: ${error.message}` });
        setModelo([]);
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
      setFeedback({ tipo: 'warning', mensagem: 'Por favor, informe a forma de modelo.' });
      return;
    }

    const dadosModelo = { modelo: modeloAtual };
    if (modoEdicao && idAtual) {
      dadosModelo.id = idAtual;
    }

    try {
      if (modoEdicao) {
        await atualizarModelo(dadosModelo);
        setFeedback({ tipo: 'success', mensagem: 'Forma de modelo atualizada com sucesso!' });
      } else {
        await adicionarModelo(dadosModelo);
        setFeedback({ tipo: 'success', mensagem: 'Forma de modelo adicionada com sucesso!' });
      }
      limparFormulario();
      carregarModelo();
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao salvar forma de modelo: ${error.message}` });
    }
  };

  const handleEditar = (modelo) => {
    setModoEdicao(true);
    setIdAtual(modelo.id);
    setModeloAtual(modelo.modelo); 
    setFeedback({ tipo: '', mensagem: '' });
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta forma de modelo?')) {
      try {
        await excluirModelo(id);
        setFeedback({ tipo: 'info', mensagem: 'Forma de modelo excluída com sucesso!' });
        carregarModelo();
        limparFormulario();
      } catch (error) {
        setFeedback({ tipo: 'danger', mensagem: `Erro ao excluir forma de modelo: ${error.message}` });
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
            <CardModerno titulo="Formas de Modelo Cadastradas">
              <Form onSubmit={handleBuscar} className="mb-3">
                <Row>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      value={termoBusca}
                      onChange={handleBuscaChange}
                      placeholder="Buscar por modelos de equipamentos..."
                    />
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button variant="info" type="submit" className="w-100">
                      Buscar
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
                          <Button variant="warning" size="sm" onClick={() => handleEditar(modelo)} className="me-1">
                            Editar
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleExcluir(modelo.id)}>
                            Excluir
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

