import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Configuração base do axios para a API do Bling
const blingApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para tratamento de erros
blingApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Erro na API do Bling:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const useBling = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tokenInfo, setTokenInfo] = useState(null);

    // Verifica o status da autenticação
    const checkAuthStatus = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await blingApi.get('/bling/status');
            
            if (response.data.success) {
                setIsAuthenticated(response.data.isAuthenticated);
                setTokenInfo(response.data);
                setError(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao verificar status de autenticação');
            setIsAuthenticated(false);
            setTokenInfo(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Inicia o processo de autenticação
    const authenticate = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await blingApi.get('/bling/auth');
            
            if (response.data.success && response.data.authUrl) {
                // Abre a URL de autenticação em uma nova janela
                const authWindow = window.open(
                    response.data.authUrl,
                    'bling-auth',
                    'width=600,height=700,scrollbars=yes,resizable=yes'
                );

                // Monitora o fechamento da janela de autenticação
                const checkClosed = setInterval(() => {
                    if (authWindow.closed) {
                        clearInterval(checkClosed);
                        // Verifica o status após o fechamento da janela
                        setTimeout(() => {
                            checkAuthStatus();
                        }, 1000);
                    }
                }, 1000);

                return true;
            } else {
                throw new Error('Não foi possível obter URL de autenticação');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao iniciar autenticação');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [checkAuthStatus]);

    // Faz logout
    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            await blingApi.post('/bling/logout');
            setIsAuthenticated(false);
            setTokenInfo(null);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer logout');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Renova o token
    const refreshToken = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await blingApi.post('/bling/refresh');
            
            if (response.data.success) {
                setTokenInfo(response.data.tokenInfo);
                setError(null);
                return true;
            }
            return false;
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao renovar token');
            setIsAuthenticated(false);
            setTokenInfo(null);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Verifica status na inicialização
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    return {
        isAuthenticated,
        isLoading,
        error,
        tokenInfo,
        authenticate,
        logout,
        refreshToken,
        checkAuthStatus
    };
};

export const useBlingContatos = () => {
    const [contatos, setContatos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        pagina: 1,
        limite: 100,
        total: 0,
        totalPaginas: 0
    });

    // Busca contatos com filtros
    const fetchContatos = useCallback(async (options = {}) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const params = new URLSearchParams({
                pagina: options.pagina || 1,
                limite: options.limite || 100,
                ...(options.criterio && { criterio: options.criterio }),
                ...(options.tipo && { tipo: options.tipo }),
                ...(options.situacao && { situacao: options.situacao })
            });

            const response = await blingApi.get(`/bling/contatos?${params}`);
            
            if (response.data.success) {
                setContatos(response.data.data);
                setPagination(response.data.meta);
                return response.data;
            } else {
                throw new Error(response.data.error || 'Erro ao buscar contatos');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar contatos';
            setError(errorMessage);
            setContatos([]);
            
            // Se for erro de autenticação, limpa os dados
            if (err.response?.status === 401) {
                setContatos([]);
                setPagination({ pagina: 1, limite: 100, total: 0, totalPaginas: 0 });
            }
            
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Busca contatos formatados para select
    const fetchContatosForSelect = useCallback(async (options = {}) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const params = new URLSearchParams({
                pagina: options.pagina || 1,
                limite: options.limite || 100,
                ...(options.criterio && { criterio: options.criterio }),
                ...(options.tipo && { tipo: options.tipo })
            });

            const response = await blingApi.get(`/bling/contatos/select?${params}`);
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.error || 'Erro ao buscar contatos');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar contatos';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Busca apenas clientes
    const fetchClientes = useCallback(async (options = {}) => {
        return fetchContatos({ ...options, tipo: 'cliente' });
    }, [fetchContatos]);

    // Busca apenas fornecedores
    const fetchFornecedores = useCallback(async (options = {}) => {
        return fetchContatos({ ...options, tipo: 'fornecedor' });
    }, [fetchContatos]);

    // Busca contato por ID
    const fetchContatoById = useCallback(async (id) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await blingApi.get(`/bling/contatos/${id}`);
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.error || 'Contato não encontrado');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar contato';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Busca contatos por nome
    const searchContatosByName = useCallback(async (nome, options = {}) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const params = new URLSearchParams({
                pagina: options.pagina || 1,
                limite: options.limite || 100,
                ...(options.tipo && { tipo: options.tipo })
            });

            const response = await blingApi.get(`/bling/contatos/search/${encodeURIComponent(nome)}?${params}`);
            
            if (response.data.success) {
                setContatos(response.data.data);
                setPagination(response.data.meta);
                return response.data;
            } else {
                throw new Error(response.data.error || 'Erro na busca');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Erro na busca';
            setError(errorMessage);
            setContatos([]);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Testa conexão com a API
    const testConnection = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await blingApi.get('/bling/contatos/test/connection');
            
            if (response.data.success) {
                return true;
            } else {
                throw new Error(response.data.error || 'Falha no teste de conexão');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Erro no teste de conexão';
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        contatos,
        isLoading,
        error,
        pagination,
        fetchContatos,
        fetchContatosForSelect,
        fetchClientes,
        fetchFornecedores,
        fetchContatoById,
        searchContatosByName,
        testConnection
    };
};

