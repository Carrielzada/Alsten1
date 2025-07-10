import axios from 'axios';
import { URLSearchParams } from 'url'; // Adicionado para garantir que o construtor esteja disponível

// Controle de taxa simples (rate limit) para Bling: máximo 3 req/s
const BLING_RATE_LIMIT = 3; // 3 requisições por segundo
const BLING_RATE_WINDOW = 1000; // janela de 1 segundo
let blingRequestTimestamps = [];

async function rateLimitBling() {
    const now = Date.now();
    // Remove timestamps fora da janela
    blingRequestTimestamps = blingRequestTimestamps.filter(ts => now - ts < BLING_RATE_WINDOW);
    if (blingRequestTimestamps.length >= BLING_RATE_LIMIT) {
        // Espera até o mais antigo sair da janela
        const waitTime = BLING_RATE_WINDOW - (now - blingRequestTimestamps[0]);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return rateLimitBling(); // Chama recursivamente para garantir
    }
    blingRequestTimestamps.push(Date.now());
}

class BlingApiService {
    constructor(blingAuth) {
        this.blingAuth = blingAuth;
        this.baseUrl = process.env.BLING_BASE_URL || 'https://api.bling.com.br/Api/v3';
    }

    // Método genérico para fazer requisições autenticadas
    async makeAuthenticatedRequest(endpoint, options = {}) {
        await rateLimitBling(); // Aplica o controle de taxa antes de cada requisição
        try {
            const token = await this.blingAuth.getValidToken();
            
            const config = {
                method: options.method || 'GET',
                url: `${this.baseUrl}${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                },
                ...options
            };

            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error(`Erro na requisição para ${endpoint}:`, error.response?.data || error.message);
            
            if (error.response?.status === 401) {
                try {
                    console.log('Token expirado, tentando renovar...');
                    await this.blingAuth.refreshAccessToken();
                    
                    const newToken = await this.blingAuth.getValidToken();
                    const retryConfig = { ...config, headers: { ...config.headers, 'Authorization': `Bearer ${newToken}` } };
                    
                    const retryResponse = await axios(retryConfig);
                    return retryResponse.data;
                } catch (refreshError) {
                    console.error('Erro ao renovar token:', refreshError);
                    throw new Error('Token expirado e não foi possível renovar. Faça login novamente.');
                }
            }
            
            throw error;
        }
    }

    // Busca contatos com paginação e filtros
    async getContatos(options = {}) {
        // ==================== CORREÇÃO 1: Adicionar 'pesquisa' às opções ====================
        const {
            pagina = 1,
            limite = 100,
            criterio = '',
            pesquisa = '', // <-- Adicionamos o novo parâmetro de busca aqui
            tipo = '', 
            situacao = ''
        } = options;

        try {
            const params = new URLSearchParams({
                pagina: pagina.toString(),
                limite: limite.toString()
            });

            // Adiciona filtros opcionais
            if (criterio) params.append('criterio', criterio);
            if (pesquisa) params.append('pesquisa', pesquisa); // <-- Usamos o parâmetro 'pesquisa'
            if (tipo) params.append('tipos[]', tipo); // Bling API espera 'tipos[]' para filtro de tipo
            if (situacao) params.append('situacao', situacao);

            const endpoint = `/contatos?${params.toString()}`;
            const responseData = await this.makeAuthenticatedRequest(endpoint);

            // A API do Bling retorna os dados dentro de um objeto 'data'
            const data = responseData.data || [];
            const meta = responseData.meta || {};

            return {
                success: true,
                data: data,
                meta: {
                    pagina: meta.pagina || pagina,
                    limite: meta.limite || limite,
                    total: meta.total || 0,
                    totalPaginas: meta.total ? Math.ceil(meta.total / limite) : 0
                }
            };
        } catch (error) {
            console.error('Erro ao buscar contatos:', error);
            return {
                success: false,
                error: error.message,
                data: [],
                meta: { pagina, limite, total: 0, totalPaginas: 0 }
            };
        }
    }

    // Busca um contato específico por ID
    async getContato(id) {
        try {
            const response = await this.makeAuthenticatedRequest(`/contatos/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`Erro ao buscar contato ${id}:`, error);
            return { success: false, error: error.message, data: null };
        }
    }

    // Busca contatos por nome (busca parcial)
    async searchContatosByName(nome, options = {}) {
        // ==================== CORREÇÃO 2: Usar 'pesquisa' em vez de 'criterio' ====================
        return this.getContatos({
            ...options,
            pesquisa: nome // <-- Passamos o termo de busca para o parâmetro correto
        });
    }

    // Busca apenas clientes
    async getClientes(options = {}) {
        return this.getContatos({ ...options, tipo: 'cliente' });
    }

    // Busca apenas fornecedores
    async getFornecedores(options = {}) {
        return this.getContatos({ ...options, tipo: 'fornecedor' });
    }
    
    // ... O restante do arquivo não precisa de alterações ...

    // Busca todos os contatos (com paginação automática)
    async getAllContatos(options = {}) {
        //...
    }

    // Cria um novo contato
    async createContato(contatoData) {
        //...
    }

    // Atualiza um contato existente
    async updateContato(id, contatoData) {
        //...
    }

    // Busca contatos formatados para uso em select/dropdown
    async getContatosForSelect(options = {}) {
        try {
            const response = await this.getContatos(options);
            if (!response.success) { return response; }

            const formattedContatos = response.data.map(contato => ({
                id: contato.id,
                nome: contato.nome,
                email: contato.email,
                telefone: contato.telefone,
                documento: contato.numeroDocumento,
                tipo: contato.tipo,
                label: `${contato.nome} ${contato.numeroDocumento ? `(${contato.numeroDocumento})` : ''}`,
                value: contato.id
            }));

            return { success: true, data: formattedContatos, meta: response.meta };
        } catch (error) {
            console.error('Erro ao formatar contatos para select:', error);
            return { success: false, error: error.message, data: [] };
        }
    }

    // Testa a conexão com a API
    async testConnection() {
        //...
    }
}

export default BlingApiService;