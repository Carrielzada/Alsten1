import React, { useState, useEffect } from 'react';
import CardModerno from '../LayoutModerno/CardModerno';
import { Form, Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import servicoPadraoService from '../../Services/servicoPadraoService';

const TelaCadServicoPadrao = () => {
  const [servicosPadrao, setServicosPadrao] = useState([]);
  const [tituloAtual, setTituloAtual] = useState('');
  const [servicoAtual, setServicoAtual] = useState('');
  const [idAtual, setIdAtual] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  const carregarServicos = async (termo = '') => {
    try {
      const resposta = await servicoPadraoService.buscarServicosPadrao();
      if (resposta && resposta.listaServicosPadrao) {
        // Filtrar por termo de busca se fornecido
        let servicos = resposta.listaServicosPadrao;
        if (termo && termo.trim() !== '') {
          servicos = servicos.filter(servico => 
            servico.titulo.toLowerCase().includes(termo.toLowerCase()) ||
            servico.servico.toLowerCase().includes(termo.toLowerCase())
          );
        }
        setServicosPadrao(servicos);
      } else {
        setServicosPadrao([]);
      }
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao carregar serviços padrão: ${error.message}` });
      setServicosPadrao([]);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  const handleChange = (e) => {
    setServicoAtual(e.target.value);
  };

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    carregarServicos(termoBusca);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tituloAtual.trim()) {
      setFeedback({ tipo: 'warning', mensagem: 'Por favor, informe o título do serviço.' });
      return;
    }
    if (!servicoAtual.trim()) {
      setFeedback({ tipo: 'warning', mensagem: 'Por favor, informe a descrição do serviço.' });
      return;
    }

    const dadosServico = { titulo: tituloAtual, servico: servicoAtual };
    if (modoEdicao && idAtual) {
      dadosServico.id = idAtual;
    }

    try {
      if (modoEdicao) {
        await servicoPadraoService.atualizar(idAtual, dadosServico);
        setFeedback({ tipo: 'success', mensagem: 'Serviço padrão atualizado com sucesso!' });
      } else {
        await servicoPadraoService.criar(dadosServico);
        setFeedback({ tipo: 'success', mensagem: 'Serviço padrão adicionado com sucesso!' });
      }
      limparFormulario();
      carregarServicos();
    } catch (error) {
      setFeedback({ tipo: 'danger', mensagem: `Erro ao salvar serviço padrão: ${error.message}` });
    }
  };

  const handleEditar = (servico) => {
    setModoEdicao(true);
    setIdAtual(servico.id);
    setTituloAtual(servico.titulo);
    setServicoAtual(servico.servico);
    setFeedback({ tipo: '', mensagem: '' });
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço padrão?')) {
      try {
        await servicoPadraoService.excluir(id);
        setFeedback({ tipo: 'info', mensagem: 'Serviço padrão excluído com sucesso!' });
        carregarServicos();
        limparFormulario();
      } catch (error) {
        setFeedback({ tipo: 'danger', mensagem: `Erro ao excluir serviço padrão: ${error.message}` });
      }
    }
  };

  const limparFormulario = () => {
    setTituloAtual('');
    setServicoAtual('');
    setIdAtual(null);
    setModoEdicao(false);
    setFeedback({ tipo: '', mensagem: '' });
  };

  return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={12} lg={11}>
            <CardModerno titulo="Cadastro de Serviços Padrão">
              <Form.Group className="mb-3">
                {feedback.mensagem && <Alert variant={feedback.tipo}>{feedback.mensagem}</Alert>}
                <Form.Label htmlFor="tituloServico">Título</Form.Label>
                <Form.Control
                  type="text"
                  id="tituloServico"
                  value={tituloAtual}
                  onChange={(e) => setTituloAtual(e.target.value)}
                  placeholder="Ex: MANUTENÇÃO, REPARO, LIMPEZA"
                  required
                />
              </Form.Group>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="servicoPadrao">Descrição do Serviço</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    id="servicoPadrao"
                    value={servicoAtual}
                    onChange={handleChange}
                    placeholder="Ex: Troca de peças, Limpeza interna, Calibração"
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
            <CardModerno titulo="Serviços Padrão Cadastrados">
              <Form onSubmit={handleBuscar} className="mb-3">
                <Row className="align-items-center">
                  <Col md={9}>
                    <Form.Control
                      type="text"
                      value={termoBusca}
                      onChange={handleBuscaChange}
                      placeholder="Buscar por título ou descrição do serviço..."
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
              {servicosPadrao.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Descrição do Serviço</th>
                      <th style={{ width: '150px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicosPadrao.map((servico) => (
                      <tr key={servico.id}>
                        <td>{servico.id}</td>
                        <td>{servico.titulo}</td>
                        <td>{servico.servico}</td>
                        <td>
                          <Button 
                            variant="warning" 
                            onClick={() => handleEditar(servico)} 
                            className="btn-icon"
                            title="Editar"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="danger" 
                            onClick={() => handleExcluir(servico.id)}
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
                <Alert variant="info">Nenhum serviço padrão encontrado.</Alert>
              )}
            </CardModerno>
          </Col>
        </Row>
      </Container>
  );
};

export default TelaCadServicoPadrao; 