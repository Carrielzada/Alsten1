import { getToken } from "./authService";

const API_URL = "http://localhost:4000";

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

const servicoPadraoService = {
    async buscarServicosPadrao() {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/servico-padrao`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao buscar serviços padrão:', error);
            throw error;
        }
    },

    async buscarPorId(id) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/servico-padrao/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao buscar serviço padrão por ID:', error);
            throw error;
        }
    },

    async criar(servicoPadrao) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/servico-padrao`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(servicoPadrao),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao criar serviço padrão:', error);
            throw error;
        }
    },

    async atualizar(id, servicoPadrao) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/servico-padrao/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(servicoPadrao),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao atualizar serviço padrão:', error);
            throw error;
        }
    },

    async excluir(id) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/servico-padrao/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao excluir serviço padrão:', error);
            throw error;
        }
    }
};

export default servicoPadraoService; 