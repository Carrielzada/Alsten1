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

export const buscarTiposAnalise = async (termo = "") => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-analise/${termo}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const adicionarTipoAnalise = async (tipoAnalise) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-analise`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(tipoAnalise),
    });
    return handleResponse(response);
};

export const atualizarTipoAnalise = async (tipoAnalise) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-analise`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(tipoAnalise),
    });
    return handleResponse(response);
};

export const excluirTipoAnalise = async (id) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-analise`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
    });
    return handleResponse(response);
};

