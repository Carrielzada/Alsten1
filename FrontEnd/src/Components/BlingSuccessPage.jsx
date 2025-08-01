import React, { useEffect } from 'react';

const BlingSuccessPage = () => {
  useEffect(() => {
    // Envia mensagem para a janela pai
    if (window.opener) {
      window.opener.postMessage('bling-auth-success', '*');
    }
    
    // Fecha a janela após 4 segundos
    const timer = setTimeout(() => {
      window.close();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      margin: 0
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: '#28a745',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: 'white',
          fontSize: '40px'
        }}>
          ✓
        </div>
        <h1 style={{
          color: '#28a745',
          marginBottom: '15px',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Autenticação realizada com sucesso!
        </h1>
        <p style={{
          color: '#666',
          marginBottom: '20px',
          lineHeight: '1.5'
        }}>
          Você foi conectado ao Bling com sucesso. Esta janela será fechada automaticamente.
        </p>
        <div style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          borderLeft: '4px solid #007bff',
          fontSize: '14px',
          color: '#495057'
        }}>
          <strong>Dica:</strong> Se a janela não fechar automaticamente, você pode fechá-la manualmente.
        </div>
        <div style={{
          width: '20px',
          height: '20px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '15px auto 0'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BlingSuccessPage; 