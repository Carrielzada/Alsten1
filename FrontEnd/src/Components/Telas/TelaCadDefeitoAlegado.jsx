import React, { useState, useEffect } from 'react';
import CardModerno from '../LayoutModerno/CardModerno';
import { Form, Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { buscarDefeitosAlegados, adicionarDefeitoAlegado, atualizarDefeitoAlegado, excluirDefeitoAlegado } from '../../Services/defeitoAlegadoService.js'; // Caminho corrigido e real

// Fim dos mocks removidos

const TelaCadDefeitoAlegado = () => {
  const [defeitosAlegados, setDefeitosAlegados] = useState([]);
  const [tituloAtual, setTituloAtual] = useState('');
  const [defeitoAtual, setDefeitoAtual] = useState('');
  const [idAtual, setIdAtual] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  const carregarDefeitos = async (termo = '') => {
    try {
      const resposta = await buscarDefeitosAlegados(termo);
      setDefeitosAlegados(resposta.listaDefeitosAlegados || []); 
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao carregar defeitos alegados: ${error.message}` });
      setDefeitosAlegados([]);
    }
  };

  useEffect(() => {
    carregarDefeitos();
  }, []);

  const handleChange = (e) => {
    setDefeitoAtual(e.target.value);
  };

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    carregarDefeitos(termoBusca);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tituloAtual.trim()) { // Adicionada validação para título
      setFeedback({ tipo: 'warning', mensagem: 'Por favor, informe o título do defeito.' });
      return;
    }
    if (!defeitoAtual.trim()) {
      setFeedback({ tipo: 'warning', mensagem: 'Por favor, informe a descrição do defeito.' });
      return;
    }

    const dadosDefeito = { titulo: tituloAtual,  defeito: defeitoAtual };
    if (modoEdicao && idAtual) {
      dadosDefeito.id = idAtual;
    }

    try {
      if (modoEdicao) {
        await atualizarDefeitoAlegado(dadosDefeito);
        setFeedback({ tipo: 'success', mensagem: 'Defeito alegado atualizado com sucesso!' });
      } else {
        await adicionarDefeitoAlegado(dadosDefeito);
        setFeedback({ tipo: 'success', mensagem: 'Defeito alegado adicionado com sucesso!' });
      }
      limparFormulario();
      carregarDefeitos();
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao salvar defeito alegado: ${error.message}` });
    }
  };

  const handleEditar = (defeito) => {
    setModoEdicao(true);
    setIdAtual(defeito.id);
    setTituloAtual(defeito.titulo);
    setDefeitoAtual(defeito.defeito);
    setFeedback({ tipo: '', mensagem: '' });
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este defeito alegado?')) {
      try {
        await excluirDefeitoAlegado(id);
        setFeedback({ tipo: 'info', mensagem: 'Defeito alegado excluído com sucesso!' });
        carregarDefeitos();
        limparFormulario();
      } catch (error) {
        setFeedback({ tipo: 'danger', mensagem: `Erro ao excluir defeito alegado: ${error.message}` });
      }
    }
  };

  const limparFormulario = () => {
    setDefeitoAtual('');
    setIdAtual(null);
    setModoEdicao(false);
    setFeedback({ tipo: '', mensagem: '' });
  };

  return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={12} lg={11}>
            <CardModerno titulo="Cadastro de Defeitos Alegados (Padrão)">
              <Form.Group className="mb-3">
                {feedback.mensagem && <Alert variant={feedback.tipo}>{feedback.mensagem}</Alert>}
                <Form.Label htmlFor="tituloDefeito">Título</Form.Label>
              <Form.Control
                type="text"
                id="tituloDefeito"
                value={tituloAtual}
                onChange={(e) => setTituloAtual(e.target.value)}
                placeholder="Ex: ENCODER, SENSOR, MOTOR"
                required
              />
              </Form.Group>
              {feedback.mensagem && <Alert variant={feedback.tipo}>{feedback.mensagem}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="defeitoAlegado">Descrição do Defeito</Form.Label>
                  <Form.Control
                    type="text"
                    id="defeitoAlegado"
                    value={defeitoAtual}
                    onChange={handleChange}
                    placeholder="Ex: Não liga, Tela piscando"
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
            <CardModerno titulo="Defeitos Alegados Cadastrados">
              <Form onSubmit={handleBuscar} className="mb-3">
                <Row>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      value={termoBusca}
                      onChange={handleBuscaChange}
                      placeholder="Buscar por descrição do defeito..."
                    />
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button variant="info" type="submit" className="w-100">
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </Form>
              {defeitosAlegados.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Descrição do Defeito</th>
                      <th style={{ width: '150px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defeitosAlegados.map((defeito) => (
                      <tr key={defeito.id}>
                        <td>{defeito.id}</td>
                        <td>{defeito.titulo}</td>
                        <td>{defeito.defeito}</td>
                        <td>
                          <Button variant="warning" size="sm" onClick={() => handleEditar(defeito)} className="me-1">
                            Editar
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleExcluir(defeito.id)}>
                            Excluir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">Nenhum defeito alegado encontrado.</Alert>
              )}
            </CardModerno>
          </Col>
        </Row>
      </Container>
  );
};

export default TelaCadDefeitoAlegado;

