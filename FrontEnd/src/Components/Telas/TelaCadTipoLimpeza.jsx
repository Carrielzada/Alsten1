        import { useState, useEffect } from 'react';
        import Pagina from "../Templates2/Pagina.jsx";
        import LayoutModerno from '../LayoutModerno/LayoutModerno.jsx';
        import CardModerno from '../LayoutModerno/CardModerno.jsx';
        import { Form, Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
        import { buscarTiposLimpeza, adicionarTipoLimpeza, atualizarTipoLimpeza, excluirTipoLimpeza } from '../../Services/tipoLimpezaService.js';

        const TelaCadTipoLimpeza = () => {
          const [tiposLimpeza, setTiposLimpeza] = useState([]);
          const [tipoLimpezaAtual, setTipoLimpezaAtual] = useState('');
          const [idAtual, setIdAtual] = useState(null);
          const [modoEdicao, setModoEdicao] = useState(false);
          const [termoBusca, setTermoBusca] = useState('');
          const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

          const carregarTiposLimpeza = async (termo = '') => {
            try {
              const resposta = await buscarTiposLimpeza(termo);
              setTiposLimpeza(resposta.listaTiposLimpeza || []); 
            } catch (error) {
              setFeedback({ tipo: 'danger', mensagem: `Erro ao carregar tipos de limpeza: ${error.message}` });
              setTiposLimpeza([]);
            }
          };

          useEffect(() => {
            carregarTiposLimpeza();
          }, []);

          const handleChange = (e) => {
            setTipoLimpezaAtual(e.target.value);
          };

          const handleBuscaChange = (e) => {
            setTermoBusca(e.target.value);
          };

          const handleBuscar = (e) => {
            e.preventDefault();
            carregarTiposLimpeza(termoBusca);
          };

          const handleSubmit = async (e) => {
            e.preventDefault();
            if (!tipoLimpezaAtual.trim()) {
              setFeedback({ tipo: 'warning', mensagem: 'Por favor, informe o tipo de Limpeza.' });
              return;
            }

            const dadosTipoLimpeza = { tipo_limpeza: tipoLimpezaAtual }; // Corrigido para tipo_limpeza
            if (modoEdicao && idAtual) {
              dadosTipoLimpeza.id = idAtual;
            }

            try {
              if (modoEdicao) {
                await atualizarTipoLimpeza(dadosTipoLimpeza);
                setFeedback({ tipo: 'success', mensagem: 'Tipo de limpeza atualizado com sucesso!' });
              } else {
                await adicionarTipoLimpeza(dadosTipoLimpeza);
                setFeedback({ tipo: 'success', mensagem: 'Tipo de limpeza adicionado com sucesso!' });
              }
              limparFormulario();
              carregarTiposLimpeza();
            } catch (error) {
              setFeedback({ tipo: 'danger', mensagem: `Erro ao salvar tipo de limpeza: ${error.message}` });
            }
          };

          const handleEditar = (tipoLimpeza) => {
            setModoEdicao(true);
            setIdAtual(tipoLimpeza.id);
            setTipoLimpezaAtual(tipoLimpeza.tipo_limpeza); // Corrigido para tipo_limpeza
            setFeedback({ tipo: '', mensagem: '' });
          };

          const handleExcluir = async (id) => {
            if (window.confirm('Tem certeza que deseja excluir este tipo de limpeza?')) {
              try {
                await excluirTipoLimpeza(id);
                setFeedback({ tipo: 'info', mensagem: 'Tipo de limpeza excluído com sucesso!' });
                carregarTiposLimpeza();
                limparFormulario();
              } catch (error) {
                setFeedback({ tipo: 'danger', mensagem: `Erro ao excluir tipo de limpeza: ${error.message}` });
              }
            }
          };

          const limparFormulario = () => {
            setTipoLimpezaAtual('');
            setIdAtual(null);
            setModoEdicao(false);
            setFeedback({ tipo: '', mensagem: '' });
          };

          return (
          <Pagina>
            <LayoutModerno>
              <Container fluid>
                <Row className="justify-content-center">
                  <Col md={8} lg={6}>
                    <CardModerno titulo="Cadastro de Tipos de Limpeza">
                      {feedback.mensagem && <Alert variant={feedback.tipo}>{feedback.mensagem}</Alert>}
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="tipoLimpeza">Tipo de Limpeza</Form.Label>
                          <Form.Control
                            type="text"
                            id="tipoLimpeza"
                            value={tipoLimpezaAtual}
                            onChange={handleChange}
                            placeholder="Ex: Apenas orçamento, Consertar e orçar"
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
                    <CardModerno titulo="Tipos de Limpeza Cadastrados">
                      <Form onSubmit={handleBuscar} className="mb-3">
                        <Row>
                          <Col md={8}>
                            <Form.Control
                              type="text"
                              value={termoBusca}
                              onChange={handleBuscaChange}
                              placeholder="Buscar por tipo de limpeza..."
                            />
                          </Col>
                          <Col md={4} className="d-flex align-items-end">
                            <Button variant="info" type="submit" className="w-100">
                              Buscar
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                      {tiposLimpeza.length > 0 ? (
                        <Table striped bordered hover responsive size="sm">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Tipo de Limpeza</th>
                              <th style={{ width: '120px' }}>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tiposLimpeza.map((tipo) => (
                              <tr key={tipo.id}>
                                <td>{tipo.id}</td>
                                <td>{tipo.tipo_limpeza}</td>
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
                        <Alert variant="info">Nenhum tipo de limpeza encontrado.</Alert>
                      )}
                    </CardModerno>
                  </Col>
                </Row>
              </Container>
            </LayoutModerno>
            </Pagina>
          );
        };

        export default TelaCadTipoLimpeza;

                                                                    