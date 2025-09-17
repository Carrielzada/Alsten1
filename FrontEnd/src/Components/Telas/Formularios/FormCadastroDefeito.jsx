import { useState } from 'react';
import { Form, Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import Button from '../../UI/Button';
import { FaSave, FaTimes } from 'react-icons/fa';

const FormCadastroDefeito = (props) => {
  const [validado, setValidado] = useState(false);
  const [defeito, setDefeito] = useState('');

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity()) {
      console.log("Defeito alegado cadastrado:", defeito);
      setValidado(false);
    } else {
      setValidado(true);
    }
  };

  return (
    <Container className="p-3 border rounded shadow-sm mx-auto" style={{ maxWidth: '800px' }}>
      <Form noValidate validated={validado} onSubmit={handleSubmit}>
        <h5 className="mb-3 text-center fw-bold">Cadastro de Defeitos Alegados</h5>
        <hr />
        <Row className="justify-content-center">
          <Col xs={12} md={6} className="mb-2">
            <FloatingLabel controlId="defeitoAlegado" label="Defeito Alegado">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Ex: Tela quebrada"
                value={defeito}
                onChange={(e) => setDefeito(e.target.value)}
                required
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mt-3 d-flex justify-content-center">
          <Col xs="auto">
            <Button type="submit" size="sm" className="px-3" style={{ backgroundColor: '#191970' }}>
              <FaSave className="me-1" /> Cadastrar
            </Button>
          </Col>
          <Col xs="auto">
            <Button variant="secondary" size="sm" className="px-3" onClick={() => props.setExibirTabela(true)}>
              <FaTimes className="me-1" /> Cancelar
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default FormCadastroDefeito;
