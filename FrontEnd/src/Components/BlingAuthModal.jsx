import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

const BlingAuthModal = ({ show, onAuthenticate, isLoading }) => {
  // Estado para controlar se o modal deve ser exibido
  const [shouldShow, setShouldShow] = useState(false);
  
  // Atrasa a exibição do modal para evitar que ele apareça desnecessariamente
  useEffect(() => {
    if (show) {
      // Verifica se o usuário está realmente logado antes de mostrar o modal
      const usuarioSalvo = localStorage.getItem("usuarioLogado");
      if (usuarioSalvo) {
        // Atrasa a exibição do modal para dar tempo de verificar o status do Bling
        const timer = setTimeout(() => {
          setShouldShow(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      setShouldShow(false);
    }
  }, [show]);
  
  return (
    <Modal show={shouldShow} backdrop="static" keyboard={false} centered>
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
};

export default BlingAuthModal;