import { getToken } from './authService';

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Busca todos os defeitos alegados.
 */
export const buscarDefeitosAlegados = async () => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Token não encontrado');
        }

        const response = await fetch(`${API_URL}/defeito-alegado`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar defeitos alegados:', error);
        throw error;
    }
};

/**
 * Adiciona um novo defeito alegado.
 * @param {object} defeitoAlegado - O objeto do defeito a ser adicionado.
 */
export const adicionarDefeitoAlegado = async (defeitoAlegado) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Token não encontrado');
        }

        const response = await fetch(`${API_URL}/defeito-alegado`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(defeitoAlegado)
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao adicionar defeito alegado:', error);
        throw error;
    }
};

/**
 * Atualiza um defeito alegado existente.
 * @param {object} defeitoAlegado - O objeto do defeito com o ID para atualizar.
 */
export const atualizarDefeitoAlegado = async (defeitoAlegado) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Token não encontrado');
        }

        const response = await fetch(`${API_URL}/defeito-alegado`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(defeitoAlegado)
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar defeito alegado:', error);
        throw error;
    }
};

/**
 * Exclui um defeito alegado pelo ID.
 * @param {string} id - O ID do defeito a ser excluído.
 */
export const excluirDefeitoAlegado = async (id) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Token não encontrado');
        }

        const response = await fetch(`${API_URL}/defeito-alegado`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao excluir defeito alegado:', error);
        throw error;
    }
};