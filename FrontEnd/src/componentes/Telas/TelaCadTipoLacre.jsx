import React, { useState, useEffect } from 'react';
import LayoutModerno from '../LayoutModerno/LayoutModerno';
import CardModerno from '../LayoutModerno/CardModerno';
import { Form, Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { buscarTiposLacre, adicionarTipoLacre, atualizarTipoLacre, excluirTipoLacre } from '../../servicos/tipoLacreService.js'; // Caminho corrigido e real

// Fim dos mocks removidos

const TelaCadTipoLacre = () => {
  const [tiposLacre, setTiposLacre] = useState([]);
  const [tipoLacreAtual, setTipoLacreAtual] = useState('');
  const [idAtual, setIdAtual] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  const carregarTiposLacre = async (termo = '') => {
    try {
      // Ajuste para o formato de resposta da API real
      const resposta = await buscarTiposLacre(termo);
      setTiposLacre(resposta.listaTiposLacre || []); 
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao carregar tipos de lacre: ${error.message}` });
      setTiposLacre([]);
    }
  };

  useEffect(() => {
    carregarTiposLacre();
  }, []);

  const handleChange = (e) => {
    setTipoLacreAtual(e.target.value);
  };

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    carregarTiposLacre(termoBusca);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipoLacreAtual.trim()) {
      setFeedback({ tipo: 'warning', mensagem: 'Por favor, informe o tipo de lacre.' });
      return;
    }

    const dadosTipoLacre = { tipo_lacre: tipoLacreAtual };
    if (modoEdicao && idAtual) {
      dadosTipoLacre.id = idAtual;
    }

    try {
      if (modoEdicao) {
        await atualizarTipoLacre(dadosTipoLacre);
        setFeedback({ tipo: 'success', mensagem: 'Tipo de lacre atualizado com sucesso!' });
      } else {
        await adicionarTipoLacre(dadosTipoLacre);
        setFeedback({ tipo: 'success', mensagem: 'Tipo de lacre adicionado com sucesso!' });
      }
      limparFormulario();
      carregarTiposLacre(); // Recarrega a lista após salvar
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao salvar tipo de lacre: ${error.message}` });
    }
  };

  const handleEditar = (tipoLacre) => {
    setModoEdicao(true);
    setIdAtual(tipoLacre.id);
    setTipoLacreAtual(tipoLacre.tipo_lacre);
    setFeedback({ tipo: '', mensagem: '' });
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo de lacre?')) {
      try {
        await excluirTipoLacre(id);
        setFeedback({ tipo: 'info', mensagem: 'Tipo de lacre excluído com sucesso!' });
        carregarTiposLacre(); // Recarrega a lista após excluir
        limparFormulario(); // Limpa o formulário caso o item excluído estivesse em edição
      } catch (error) {
        setFeedback({ tipo: 'danger', mensagem: `Erro ao excluir tipo de lacre: ${error.message}` });
      }
    }
  };

  const limparFormulario = () => {
    setTipoLacreAtual('');
    setIdAtual(null);
    setModoEdicao(false);
    setFeedback({ tipo: '', mensagem: '' });
  };

  return (
    <LayoutModerno>
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <CardModerno titulo="Cadastro de Tipos de Lacre">
              {feedback.mensagem && <Alert variant={feedback.tipo}>{feedback.mensagem}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="tipoLacre">Tipo de Lacre</Form.Label>
                  <Form.Control
                    type="text"
                    id="tipoLacre"
                    value={tipoLacreAtual}
                    onChange={handleChange}
                    placeholder="Ex: Alsten, Neutro"
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
            <CardModerno titulo="Tipos de Lacre Cadastrados">
              <Form onSubmit={handleBuscar} className="mb-3">
                <Row>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      value={termoBusca}
                      onChange={handleBuscaChange}
                      placeholder="Buscar por tipo de lacre..."
                    />
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button variant="info" type="submit" className="w-100">
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </Form>
              {tiposLacre.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tipo de Lacre</th>
                      <th style={{ width: '120px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiposLacre.map((tipo) => (
                      <tr key={tipo.id}>
                        <td>{tipo.id}</td>
                        <td>{tipo.tipo_lacre}</td>
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
                <Alert variant="info">Nenhum tipo de lacre encontrado.</Alert>
              )}
            </CardModerno>
          </Col>
        </Row>
      </Container>
    </LayoutModerno>
  );
};

export default TelaCadTipoLacre;

