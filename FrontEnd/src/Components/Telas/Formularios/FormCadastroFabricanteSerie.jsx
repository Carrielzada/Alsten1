
import { useState } from 'react';
import { Form, Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import Button from '../../UI/Button';
import { FaSave, FaTimes } from 'react-icons/fa';

const FormCadastroFabricante = (props) => {
  const [validado, setValidado] = useState(false);
  const [fabricante, setFabricante] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity()) {
      console.log("Fabricante e número de série cadastrados:", fabricante, numeroSerie);
      setValidado(false);
    } else {
      setValidado(true);
    }
  };

  return (
    <Container className="p-3 border rounded shadow-sm mx-auto" style={{ maxWidth: '800px' }}>
      <Form noValidate validated={validado} onSubmit={handleSubmit}>
        <h5 className="mb-3 text-center fw-bold">Cadastro de Fabricantes e Números de Série</h5>
        <hr />
        <Row className="justify-content-center">
          <Col xs={12} md={6} className="mb-2">
            <FloatingLabel controlId="fabricante" label="Fabricante">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Ex: Fabricante XYZ"
                value={fabricante}
                onChange={(e) => setFabricante(e.target.value)}
                required
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} md={6} className="mb-2">
            <FloatingLabel controlId="numeroSerie" label="Número de Série">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Ex: 123ABC456"
                value={numeroSerie}
                onChange={(e) => setNumeroSerie(e.target.value)}
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

export default FormCadastroFabricante;
