import { useState } from 'react';
import { Form, Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import Button from '../UI/Button';
import { FaSave, FaTimes } from 'react-icons/fa';

const FormCadastroUrgencia = (props) => {
  const [validado, setValidado] = useState(false);
  const [urgencia, setUrgencia] = useState('');

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity()) {
      console.log("Nível de urgência cadastrado:", urgencia);
      setValidado(false);
    } else {
      setValidado(true);
    }
  };

  return (
    <Container className="p-3 border rounded shadow-sm mx-auto" style={{ maxWidth: '800px' }}>
      <Form noValidate validated={validado} onSubmit={handleSubmit}>
        <h5 className="mb-3 text-center fw-bold">Cadastro de Níveis de Urgência</h5>
        <hr />
        <Row className="justify-content-center">
          <Col xs={12} md={6} className="mb-2">
            <FloatingLabel controlId="nivelUrgencia" label="Nível de Urgência">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Ex: Não urgente, Pouco urgente"
                value={urgencia}
                onChange={(e) => setUrgencia(e.target.value)}
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

export default FormCadastroUrgencia;
