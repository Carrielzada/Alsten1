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

const etapaOSService = {
    async buscarEtapasOS() {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/etapa-os`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao buscar etapas da OS:', error);
            throw error;
        }
    },

    async buscarPorId(id) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/etapa-os/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao buscar etapa da OS por ID:', error);
            throw error;
        }
    },

    async buscarPorNome(nome) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/etapa-os/nome/${nome}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao buscar etapa da OS por nome:', error);
            throw error;
        }
    },

    async criar(etapaOS) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/etapa-os`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(etapaOS),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao criar etapa da OS:', error);
            throw error;
        }
    },

    async atualizar(id, etapaOS) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/etapa-os/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(etapaOS),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao atualizar etapa da OS:', error);
            throw error;
        }
    },

    async excluir(id) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/etapa-os`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao excluir etapa da OS:', error);
            throw error;
        }
    }
};

export default etapaOSService; 