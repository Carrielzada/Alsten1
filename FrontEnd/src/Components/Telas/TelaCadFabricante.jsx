import React, { useState, useEffect } from 'react';
import CardModerno from '../LayoutModerno/CardModerno';
import { Form, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import Button from '../UI/Button'; // Nosso Button moderno
import { buscarFabricantes, adicionarFabricante, atualizarFabricante, excluirFabricante } from '../../Services/fabricanteService.js'; // Caminho corrigido e real

// Fim dos mocks removidos

const TelaCadFabricante = () => {
  const [fabricantes, setFabricantes] = useState([]);
  const [nomeFabricanteAtual, setNomeFabricanteAtual] = useState('');
  const [idAtual, setIdAtual] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  const carregarFabricantes = async (termo = '') => {
    try {
      const resposta = await buscarFabricantes(termo);
      setFabricantes(resposta.listaFabricantes || []); 
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao carregar fabricantes: ${error.message}` });
      setFabricantes([]);
    }
  };

  useEffect(() => {
    carregarFabricantes();
  }, []);

  const handleChange = (e) => {
    setNomeFabricanteAtual(e.target.value);
  };

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    carregarFabricantes(termoBusca);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeFabricanteAtual.trim()) {
      setFeedback({ tipo: 'warning', mensagem: 'Por favor, informe o nome do fabricante.' });
      return;
    }

    const dadosFabricante = { nome_fabricante: nomeFabricanteAtual };
    if (modoEdicao && idAtual) {
      dadosFabricante.id = idAtual;
    }

    try {
      if (modoEdicao) {
        await atualizarFabricante(dadosFabricante);
        setFeedback({ tipo: 'success', mensagem: 'Fabricante atualizado com sucesso!' });
      } else {
        await adicionarFabricante(dadosFabricante);
        setFeedback({ tipo: 'success', mensagem: 'Fabricante adicionado com sucesso!' });
      }
      limparFormulario();
      carregarFabricantes();
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao salvar fabricante: ${error.message}` });
    }
  };

  const handleEditar = (fabricante) => {
    setModoEdicao(true);
    setIdAtual(fabricante.id);
    setNomeFabricanteAtual(fabricante.nome_fabricante);
    setFeedback({ tipo: '', mensagem: '' });
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fabricante?')) {
      try {
        await excluirFabricante(id);
        setFeedback({ tipo: 'info', mensagem: 'Fabricante excluído com sucesso!' });
        carregarFabricantes();
        limparFormulario();
      } catch (error) {
        setFeedback({ tipo: 'danger', mensagem: `Erro ao excluir fabricante: ${error.message}` });
      }
    }
  };

  const limparFormulario = () => {
    setNomeFabricanteAtual('');
    setIdAtual(null);
    setModoEdicao(false);
    setFeedback({ tipo: '', mensagem: '' });
  };

  return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={12} lg={11}>
            <CardModerno titulo="Cadastro de Fabricantes">
              {feedback.mensagem && <Alert variant={feedback.tipo}>{feedback.mensagem}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="nomeFabricante">Nome do Fabricante</Form.Label>
                  <Form.Control
                    type="text"
                    id="nomeFabricante"
                    value={nomeFabricanteAtual}
                    onChange={handleChange}
                    placeholder="Ex: Dell, HP, Lenovo"
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
            <CardModerno titulo="Fabricantes Cadastrados">
              <Form onSubmit={handleBuscar} className="mb-3">
                <Row>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      value={termoBusca}
                      onChange={handleBuscaChange}
                      placeholder="Buscar por nome do fabricante..."
                    />
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button variant="info" type="submit" className="w-100">
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </Form>
              {fabricantes.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome do Fabricante</th>
                      <th style={{ width: '120px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fabricantes.map((fab) => (
                      <tr key={fab.id}>
                        <td>{fab.id}</td>
                        <td>{fab.nome_fabricante}</td>
                        <td>
                          <Button variant="warning" size="sm" onClick={() => handleEditar(fab)} className="me-1">
                            Editar
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleExcluir(fab.id)}>
                            Excluir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">Nenhum fabricante encontrado.</Alert>
              )}
            </CardModerno>
          </Col>
        </Row>
      </Container>
  );
};

export default TelaCadFabricante;

