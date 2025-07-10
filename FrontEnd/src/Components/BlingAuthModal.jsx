import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

const BlingAuthModal = ({ show, onAuthenticate, isLoading }) => (
  <Modal show={show} backdrop="static" keyboard={false} centered>
    <Modal.Header style={{ border: 'none', paddingBottom: 0 }}>
      <Modal.Title style={{ fontWeight: 500, fontSize: 18, letterSpacing: 0.5 }}>
        <span role="img" aria-label="cadeado" style={{ marginRight: 8, fontSize: 20 }}>🔒</span>
        Login Bling
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="text-center" style={{ paddingTop: 8 }}>
      <p style={{ fontSize: 14, marginBottom: 18, color: '#555' }}>
        Para acessar o sistema, faça login no Bling.<br/>
        <span style={{ fontSize: 12, color: '#888' }}>
          (Sua senha nunca é armazenada.)
        </span>
      </p>
      <Button
        onClick={onAuthenticate}
        disabled={isLoading}
        variant="outline-primary"
        size="sm"
        style={{ borderRadius: 16, padding: '6px 24px', fontWeight: 500, fontSize: 15, minWidth: 80 }}
      >
        {isLoading ? <Spinner size="sm" animation="border" /> : 'Login'}
      </Button>
    </Modal.Body>
  </Modal>
);

export default BlingAuthModal; 