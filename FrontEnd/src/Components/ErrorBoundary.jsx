import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log do erro para monitoramento
    console.error('Error Boundary capturou um erro:', error, errorInfo);
    
    // Aqui você pode enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem('usuarioLogado') 
        ? JSON.parse(localStorage.getItem('usuarioLogado')).id 
        : 'anonymous'
    };

    // Log local para debugging
    console.error('Dados do erro:', errorData);
    
    // TODO: Enviar para serviço de monitoramento
    // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) });
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
    
    // Recarregar a página se muitas tentativas
    if (this.state.retryCount >= 3) {
      window.location.reload();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-fluid d-flex align-items-center justify-content-center" 
             style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="row justify-content-center w-100">
            <div className="col-md-6 col-lg-5">
              <Card className="shadow-lg border-0" 
                    style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)' }}>
                <Card.Body className="text-center p-5">
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
                  
                  <h3 className="fw-bold text-dark mb-3">Oops! Algo deu errado</h3>
                  
                  <p className="text-muted mb-4">
                    Encontramos um problema inesperado. Não se preocupe, 
                    nossos técnicos foram notificados e estão trabalhando para resolver.
                  </p>

                  {process.env.NODE_ENV === 'development' && (
                    <Alert variant="warning" className="text-start mb-4">
                      <small>
                        <strong>Erro:</strong> {this.state.error && this.state.error.toString()}
                        <details style={{ whiteSpace: 'pre-wrap', fontSize: '12px', marginTop: '10px' }}>
                          {this.state.errorInfo.componentStack}
                        </details>
                      </small>
                    </Alert>
                  )}

                  <div className="d-flex gap-2 justify-content-center mb-4">
                    <Button 
                      variant="primary" 
                      onClick={this.handleRetry}
                      disabled={this.state.retryCount >= 3}
                    >
                      🔄 Tentar Novamente
                    </Button>
                    
                    <Button 
                      variant="outline-secondary" 
                      onClick={this.handleReload}
                    >
                      🏠 Recarregar Página
                    </Button>
                  </div>

                  <div className="row text-center">
                    <div className="col-4">
                      <div className="text-primary mb-2">📞</div>
                      <small className="text-muted">Suporte<br/>24/7</small>
                    </div>
                    <div className="col-4">
                      <div className="text-success mb-2">💾</div>
                      <small className="text-muted">Dados<br/>Seguros</small>
                    </div>
                    <div className="col-4">
                      <div className="text-info mb-2">⚡</div>
                      <small className="text-muted">Correção<br/>Rápida</small>
                    </div>
                  </div>

                  <hr className="my-4" />
                  
                  <small className="text-muted">
                    Sistema Alsten © 2025 | 
                    Tentativa: {this.state.retryCount + 1}
                  </small>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;