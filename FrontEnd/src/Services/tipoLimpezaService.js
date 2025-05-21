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

export const buscarTiposLimpeza = async (termo = "") => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-limpeza/${termo}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const adicionarTipoLimpeza = async (tipoLimpeza) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-limpeza`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(tipoLimpeza),
    });
    return handleResponse(response);
};

export const atualizarTipoLimpeza = async (tipoLimpeza) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-limpeza`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(tipoLimpeza),
    });
    return handleResponse(response);
};

export const excluirTipoLimpeza = async (id) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-limpeza`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
    });
    return handleResponse(response);
};

