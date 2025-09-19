import React, { useEffect, useState } from 'react';

const BlingSuccessPage = () => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Envia mensagem para a janela pai imediatamente e depois de um pequeno delay
    const sendMessage = () => {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage('bling-auth-success', '*');
      }
    };
    
    // Envia a mensagem imediatamente
    sendMessage();
    
    // Tenta enviar novamente após 300ms
    const messageTimer = setTimeout(sendMessage, 300);
    
    // Countdown de 3 segundos
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          tryToClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const tryToClose = () => {
      try {
        // Tenta fechar a janela
        window.close();
        
        // Se chegou até aqui e não fechou, significa que não conseguiu fechar
        setTimeout(() => {
          // Redireciona para a página principal após 1 segundo
          if (!window.closed) {
            window.location.href = '/';
          }
        }, 1000);
      } catch (error) {
        console.log('Não foi possível fechar automaticamente:', error);
        // Redireciona imediatamente em caso de erro
        window.location.href = '/';
      }
    };

    return () => {
      clearTimeout(messageTimer);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleManualClose = () => {
    try {
      window.close();
    } catch (error) {
      // Se não conseguir fechar, redireciona para a página principal
      window.location.href = '/';
    }
  };

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
          ✅ Autenticação realizada com sucesso!
        </h1>
        <p style={{
          color: '#666',
          marginBottom: '20px',
          lineHeight: '1.5'
        }}>
          Você foi conectado ao Bling com sucesso!
        </p>
        
        {countdown > 0 ? (
          <>
            <div style={{
              background: '#e7f3ff',
              padding: '15px',
              borderRadius: '8px',
              borderLeft: '4px solid #007bff',
              fontSize: '16px',
              color: '#0056b3',
              marginBottom: '20px'
            }}>
              <strong>Fechando automaticamente em {countdown} segundo{countdown !== 1 ? 's' : ''}...</strong>
            </div>
            <div style={{
              width: '30px',
              height: '30px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
          </>
        ) : (
          <div style={{
            background: '#fff3cd',
            padding: '15px',
            borderRadius: '8px',
            borderLeft: '4px solid #ffc107',
            fontSize: '14px',
            color: '#856404',
            marginBottom: '20px'
          }}>
            <strong>Não foi possível fechar automaticamente.</strong><br/>
            Redirecionando para a página principal...
          </div>
        )}
        
        <button 
          onClick={handleManualClose}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            marginTop: '10px'
          }}
          onMouseOver={(e) => e.target.style.background = '#0056b3'}
          onMouseOut={(e) => e.target.style.background = '#007bff'}
        >
          Fechar Janela Manualmente
        </button>
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