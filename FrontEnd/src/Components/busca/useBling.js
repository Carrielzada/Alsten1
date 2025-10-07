import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getEnvironmentInfo } from '../../utils/urlUtils';

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
            // Verificar se há um usuário logado no localStorage antes de fazer a requisição
            const usuarioSalvo = localStorage.getItem("usuarioLogado");
            if (!usuarioSalvo) {
                // Se não houver usuário logado, não faz sentido verificar o status do Bling
                setIsAuthenticated(false);
                setTokenInfo(null);
                setError(null);
                return;
            }

            const usuario = JSON.parse(usuarioSalvo);
            const userId = usuario?.id;
            
            if (!userId) {
                setIsAuthenticated(false);
                setTokenInfo(null);
                setError(null);
                return;
            }
            
            setIsLoading(true);
            // Verificar status específico do usuário
            const response = await blingApi.get(`/bling/status?userId=${userId}`);
            
            if (response.data.success) {
                setIsAuthenticated(response.data.isAuthenticated);
                setTokenInfo(response.data);
                setError(null);
            }
        } catch (err) {
            console.error('Erro ao verificar status de autenticação do Bling:', err);
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
            
            // Envia informações do ambiente atual para o backend
            const envInfo = getEnvironmentInfo();
            console.log('Enviando informações do ambiente para o backend:', envInfo);
            
            const response = await blingApi.get('/bling/auth', {
                params: {
                    frontendUrl: envInfo.frontend,
                    successUrl: envInfo.blingSuccess
                }
            });
            
            if (response.data.success && response.data.authUrl) {
                // Abre a URL de autenticação em uma nova janela
                const authWindow = window.open(
                    response.data.authUrl,
                    'bling-auth',
                    'width=600,height=700,scrollbars=yes,resizable=yes'
                );
                
                // TIMEOUT para evitar loading infinito
                const authTimeout = setTimeout(() => {
                    console.log('Timeout de autenticação atingido');
                    setIsLoading(false);
                    if (authWindow && !authWindow.closed) {
                        authWindow.close();
                    }
                }, 60000); // 60 segundos timeout

                // Listener para receber mensagem da popup
                const handleMessage = (event) => {
                    if (event.data === 'bling-auth-success') {
                        clearTimeout(authTimeout);
                        clearInterval(checkClosed);
                        window.removeEventListener('message', handleMessage);
                        if (authWindow && !authWindow.closed) authWindow.close();
                        setTimeout(() => {
                            checkAuthStatus();
                        }, 500);
                    }
                };
                window.addEventListener('message', handleMessage);

                // Monitora o fechamento da janela - COM TIMEOUT
                const checkClosed = setInterval(() => {
                    if (!authWindow || authWindow.closed) {
                        clearTimeout(authTimeout);
                        clearInterval(checkClosed);
                        window.removeEventListener('message', handleMessage);
                        console.log('Janela de autenticação fechada');
                        setIsLoading(false); // IMPORTANTE: parar o loading
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
            console.error('Erro na autenticação:', err);
            setError(err.response?.data?.message || 'Erro ao iniciar autenticação');
            return false;
        } finally {
            // Garantir que o loading pare mesmo em caso de erro
            setTimeout(() => setIsLoading(false), 1000);
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

            let url = '/bling/contatos';
            let params = new URLSearchParams();

            // NOVA LÓGICA: só envia paginação se não houver pesquisa, numeroDocumento ou idTipoContato
            if (options.pesquisa) {
                params.append('pesquisa', options.pesquisa);
            } else if (options.numeroDocumento) {
                params.append('numeroDocumento', options.numeroDocumento);
            } else if (options.idTipoContato) {
                params.append('idTipoContato', options.idTipoContato);
            } else {
                params.append('pagina', options.pagina || 1);
                params.append('limite', options.limite || 100);
            }
            if (options.tipo) params.append('tipo', options.tipo);
            if (options.situacao) params.append('situacao', options.situacao);

            const response = await blingApi.get(`${url}?${params.toString()}`);

            if (response.data.success) {
                setContatos(response.data.data);
                setPagination(response.data.meta || {});
                return response.data;
            } else {
                throw new Error(response.data.error || 'Erro ao buscar contatos');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar contatos';
            setError(errorMessage);
            setContatos([]);
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

    // Busca contatos por nome/documento
    const searchContatosByName = useCallback(async (nome, options = {}) => {
        try {
            setIsLoading(true);
            setError(null);
            const params = new URLSearchParams();
            params.append('pesquisa', nome);
            if (options.tipo) params.append('tipo', options.tipo);
            if (options.situacao) params.append('situacao', options.situacao);
            const response = await blingApi.get(`/bling/contatos?${params.toString()}`);
            if (response.data.success) {
                setContatos(response.data.data);
                setPagination(response.data.meta || {});
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

