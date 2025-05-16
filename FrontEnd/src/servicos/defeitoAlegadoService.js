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

export const buscarDefeitosAlegados = async (termo = "") => {
    const token = getToken();
    const response = await fetch(`${API_URL}/defeito-alegado/${termo}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const adicionarDefeitoAlegado = async (defeitoAlegado) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/defeito-alegado`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(defeitoAlegado),
    });
    return handleResponse(response);
};

export const atualizarDefeitoAlegado = async (defeitoAlegado) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/defeito-alegado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(defeitoAlegado),
    });
    return handleResponse(response);
};

export const excluirDefeitoAlegado = async (id) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/defeito-alegado`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
    });
    return handleResponse(response);
};

