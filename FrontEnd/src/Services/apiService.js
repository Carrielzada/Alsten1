import { getToken } from './authService'; // <-- IMPORTANDO SUA FUNÇÃO!
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Uma função genérica para fazer requisições autenticadas para a API.
 * @param {string} endpoint O endpoint da API (ex: '/clientepj').
 * @param {object} options As opções do fetch (method, body, etc.).
 * @returns {Promise<any>} Os dados da resposta em JSON.
 */
const fetchAutenticado = async (endpoint, options = {}) => {
    const token = getToken(); // <-- USANDO SUA FUNÇÃO!
    if (!token) {
        toast.error("Sessão expirada. Por favor, faça o login novamente.");
        // Redireciona para a tela de login após um breve momento
        setTimeout(() => { window.location.href = '/'; }, 2000); 
        throw new Error('Token de autenticação não encontrado. Faça o login novamente.');
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    if (options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.body);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ 
                mensagem: `Erro no servidor: ${response.status} ${response.statusText}` 
            }));
            throw new Error(errorData.mensagem);
        }

        if (response.status === 204) {
            return {};
        }

        return response.json();
    } catch (error) {
        console.error(`Erro na chamada da API para ${endpoint}:`, error);
        toast.error(error.message || 'Erro de comunicação com o servidor.');
        throw error; // Propaga o erro para quem chamou a função
    }
};

export default fetchAutenticado;