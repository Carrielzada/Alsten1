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

const diasPagamentoService = {
    async buscarDiasPagamento() {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/dias-pagamento`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao buscar dias de pagamento:', error);
            throw error;
        }
    },

    async buscarPorId(id) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/dias-pagamento/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao buscar dias de pagamento por ID:', error);
            throw error;
        }
    },

    async criar(diasPagamento) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/dias-pagamento`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(diasPagamento),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao criar dias de pagamento:', error);
            throw error;
        }
    },

    async atualizar(id, diasPagamento) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/dias-pagamento/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(diasPagamento),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao atualizar dias de pagamento:', error);
            throw error;
        }
    },

    async excluir(id) {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/dias-pagamento`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Erro ao excluir dias de pagamento:', error);
            throw error;
        }
    }
};

export default diasPagamentoService; 