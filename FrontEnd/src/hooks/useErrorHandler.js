import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const executeAsync = useCallback(async (asyncFunction, options = {}) => {
    const { 
      showErrorAlert = true, 
      fallbackMessage = 'Ocorreu um erro inesperado. Tente novamente.',
      onError,
      onSuccess,
      onFinally
    } = options;

    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      console.error('Erro capturado pelo useErrorHandler:', err);
      
      let errorMessage = fallbackMessage;
      
      // Tratamento específico para diferentes tipos de erro
      if (err.response) {
        // Erro de resposta da API
        const status = err.response.status;
        const data = err.response.data;
        
        switch (status) {
          case 401:
            errorMessage = 'Sessão expirada. Faça login novamente.';
            // Limpar dados do usuário e redirecionar para login
            localStorage.removeItem('usuarioLogado');
            window.location.href = '/login';
            break;
          case 403:
            errorMessage = 'Você não tem permissão para executar esta ação.';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado.';
            break;
          case 422:
            errorMessage = data?.message || 'Dados inválidos. Verifique os campos preenchidos.';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor. Tente novamente em alguns minutos.';
            break;
          default:
            errorMessage = data?.message || fallbackMessage;
        }
      } else if (err.code === 'NETWORK_ERROR' || !navigator.onLine) {
        errorMessage = 'Problema de conexão. Verifique sua internet e tente novamente.';
      } else if (err.name === 'ValidationError') {
        errorMessage = err.message;
      }
      
      setError({
        message: errorMessage,
        originalError: err,
        timestamp: new Date().toISOString()
      });

      if (showErrorAlert) {
        // Aqui você pode usar sua biblioteca de toast/alert preferida
        alert(errorMessage);
      }

      if (onError) {
        onError(err, errorMessage);
      }

      // Re-throw para permitir que o componente trate se necessário
      throw err;
    } finally {
      setIsLoading(false);
      
      if (onFinally) {
        onFinally();
      }
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isLoading,
    executeAsync,
    clearError
  };
};

export default useErrorHandler;