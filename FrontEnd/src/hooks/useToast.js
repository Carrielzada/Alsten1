import { toast } from 'react-toastify';

// Configurações padrão para todos os toasts do sistema
const defaultConfig = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored"
};

// Hook personalizado para usar toasts padronizados
export const useToast = () => {
    // Toast de sucesso com ícone personalizado
    const success = (message, options = {}) => {
        return toast.success(message, {
            ...defaultConfig,
            autoClose: 3500,
            ...options
        });
    };

    // Toast de erro com configuração específica
    const error = (message, options = {}) => {
        return toast.error(message, {
            ...defaultConfig,
            autoClose: 6000, // Erros ficam mais tempo visíveis
            ...options
        });
    };

    // Toast de aviso/warning
    const warning = (message, options = {}) => {
        return toast.warning(message, {
            ...defaultConfig,
            autoClose: 5000,
            ...options
        });
    };

    // Toast informativo
    const info = (message, options = {}) => {
        return toast.info(message, {
            ...defaultConfig,
            autoClose: 4000,
            ...options
        });
    };

    // Toast para operações de loading (não se fecha automaticamente)
    const loading = (message = "Carregando...", options = {}) => {
        return toast.loading(message, {
            ...defaultConfig,
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            ...options
        });
    };

    // Atualizar um toast existente (útil para transformar loading em sucesso/erro)
    const update = (toastId, type, message, options = {}) => {
        const updateConfig = {
            ...defaultConfig,
            autoClose: type === 'error' ? 6000 : 3500,
            ...options
        };

        return toast.update(toastId, {
            render: message,
            type: type,
            isLoading: false,
            ...updateConfig
        });
    };

    // Método para processar resposta da API automaticamente
    const handleApiResponse = (response, successMessage = null, errorMessage = null) => {
        if (response?.status === true || response?.data?.status === true) {
            const message = successMessage || 
                           response?.mensagem || 
                           response?.data?.mensagem || 
                           'Operação realizada com sucesso!';
            return success(message);
        } else {
            const message = errorMessage || 
                           response?.mensagem || 
                           response?.data?.mensagem || 
                           response?.message ||
                           'Ocorreu um erro na operação.';
            return error(message);
        }
    };

    // Método para operações async com loading automático
    const withLoading = async (asyncFunction, messages = {}) => {
        const {
            loading: loadingMsg = "Carregando...",
            success: successMsg = "Operação realizada com sucesso!",
            error: errorMsg = "Ocorreu um erro na operação."
        } = messages;

        const toastId = loading(loadingMsg);
        
        try {
            const result = await asyncFunction();
            
            // Se a função retornou uma resposta da API, processar automaticamente
            if (result?.status !== undefined || result?.data?.status !== undefined) {
                if (result?.status === true || result?.data?.status === true) {
                    const message = result?.mensagem || result?.data?.mensagem || successMsg;
                    update(toastId, 'success', message);
                } else {
                    const message = result?.mensagem || result?.data?.mensagem || errorMsg;
                    update(toastId, 'error', message);
                }
            } else {
                // Se não tem estrutura de resposta da API, assumir sucesso
                update(toastId, 'success', successMsg);
            }
            
            return result;
        } catch (error) {
            console.error('Erro na operação:', error);
            const message = error?.response?.data?.mensagem || 
                           error?.response?.data?.message || 
                           error?.message || 
                           errorMsg;
            update(toastId, 'error', message);
            throw error; // Re-throw para permitir tratamento específico se necessário
        }
    };

    // Dismiss all toasts
    const dismissAll = () => {
        toast.dismiss();
    };

    return {
        success,
        error,
        warning,
        info,
        loading,
        update,
        handleApiResponse,
        withLoading,
        dismissAll,
        // Expose original toast for advanced usage
        toast
    };
};

export default useToast;