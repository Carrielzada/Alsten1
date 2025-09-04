import { getToken } from "./authService";

const API_URL = process.env.REACT_APP_API_URL;

async function handleResponse(response) {
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
    } else {
        data = await response.text(); 
    }

    if (!response.ok) {
        const error = (data && data.mensagem) || data || response.statusText;
        console.error("Erro na API:", error, "Status:", response.status, "Data:", data);
        throw new Error(error);
    }
    return data;
}

const checklistItemService = {
    async buscarChecklistItems() {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/checklist-item`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao buscar itens do checklist:', error);
            throw error;
        }
    },

    async buscarPorId(id) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/checklist-item/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao buscar item do checklist por ID:', error);
            throw error;
        }
    },

    async criar(checklistItem) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/checklist-item`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(checklistItem),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao criar item do checklist:', error);
            throw error;
        }
    },

    async atualizar(id, checklistItem) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/checklist-item/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(checklistItem),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao atualizar item do checklist:', error);
            throw error;
        }
    },

    async excluir(id) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/checklist-item`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao excluir item do checklist:', error);
            throw error;
        }
    }
};

export default checklistItemService; 