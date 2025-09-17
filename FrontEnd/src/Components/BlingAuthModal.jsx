import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { FaShieldAlt, FaBolt, FaCheck, FaTimes, FaStore } from 'react-icons/fa';
import './BlingAuthModal.css';

const BlingAuthModal = ({ show, onAuthenticate, isLoading }) => {
  // Estado para controlar se o modal deve ser exibido
  const [shouldShow, setShouldShow] = useState(false);
  const [authAttempts, setAuthAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  
  // Atrasa a exibição do modal para evitar que ele apareça desnecessariamente
  useEffect(() => {
    if (show) {
      // Verifica se o usuário está realmente logado antes de mostrar o modal
      const usuarioSalvo = localStorage.getItem("usuarioLogado");
      if (usuarioSalvo) {
        // Atrasa a exibição do modal para dar tempo de verificar o status do Bling
        const timer = setTimeout(() => {
          setShouldShow(true);
        }, 800); // Reduzido de 1000ms para 800ms
        return () => clearTimeout(timer);
      }
    } else {
      setShouldShow(false);
    }
  }, [show]);
  
  const handleAuthenticate = () => {
    setAuthAttempts(prev => prev + 1);
    onAuthenticate();
  };
  
  return (
    <Modal 
      show={shouldShow} 
      backdrop="static" 
      keyboard={false} 
      centered 
      className="bling-auth-modal"
      size="md"
    >
      <Modal.Header className="bling-modal-header" style={{ border: 'none' }}>
        <div className="d-flex align-items-center">
          <div className="bling-icon-container me-3">
            <FaStore className="bling-icon" />
          </div>
          <div>
            <Modal.Title className="bling-modal-title mb-1">
              Integração Bling ERP
            </Modal.Title>
            <small className="text-muted">Conecte-se ao seu sistema Bling</small>
          </div>
        </div>
      </Modal.Header>
      
      <Modal.Body className="bling-modal-body">
        <div className="text-center mb-4">
          <div className="bling-connection-status">
            <div className="status-indicator offline">
              <FaTimes className="status-icon" />
              <span>Desconectado do Bling</span>
            </div>
          </div>
        </div>
        
        <div className="bling-benefits mb-4">
          <h6 className="mb-3">🚀 Recursos disponíveis:</h6>
          <div className="benefit-list">
            <div className="benefit-item">
              <FaCheck className="benefit-icon" />
              <span>Busca automática de dados de clientes</span>
            </div>
            <div className="benefit-item">
              <FaCheck className="benefit-icon" />
              <span>Sincronização em tempo real</span>
            </div>
            <div className="benefit-item">
              <FaCheck className="benefit-icon" />
              <span>Dados sempre atualizados</span>
            </div>
          </div>
        </div>
        
        {authAttempts > 2 && (
          <Alert variant="info" className="mb-3">
            <small>
              <strong>Dificuldades para conectar?</strong><br/>
              Verifique se você tem acesso ao Bling e tente novamente.
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 ms-1"
                onClick={() => setShowHelp(!showHelp)}
              >
                {showHelp ? 'Ocultar ajuda' : 'Ver ajuda'}
              </Button>
            </small>
          </Alert>
        )}
        
        {showHelp && (
          <Alert variant="light" className="mb-3">
            <small>
              <strong>Como conectar:</strong><br/>
              1. Clique em "Conectar ao Bling"<br/>
              2. Será aberta uma nova aba do Bling<br/>
              3. Faça login com suas credenciais<br/>
              4. Autorize o acesso ao sistema<br/>
              5. Retorne para esta aba
            </small>
          </Alert>
        )}
        
        <div className="text-center">
          <Button
            onClick={handleAuthenticate}
            disabled={isLoading}
            variant="primary"
            size="lg"
            className="bling-auth-button"
          >
            {isLoading ? (
              <>
                <Spinner 
                  animation="border" 
                  size="sm" 
                  className="me-2" 
                />
                Conectando...
              </>
            ) : (
              <>
                <FaBolt className="me-2" />
                CONECTAR AO BLING
              </>
            )}
          </Button>
          
          <div className="mt-3">
            <small className="text-muted">
              <FaShieldAlt className="me-1" style={{ fontSize: '0.8em' }} />
              Conexão segura - suas credenciais não são armazenadas
            </small>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BlingAuthModal;