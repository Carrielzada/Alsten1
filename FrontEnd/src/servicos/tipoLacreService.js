import { getToken } from "./authService"; // Supondo que você tenha um authService para pegar o token

const API_URL = "http://localhost:4000"; // Ou a URL do seu backend

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

export const buscarTiposLacre = async (termo = "") => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-lacre/${termo}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const adicionarTipoLacre = async (tipoLacre) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-lacre`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(tipoLacre),
    });
    return handleResponse(response);
};

export const atualizarTipoLacre = async (tipoLacre) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-lacre`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(tipoLacre),
    });
    return handleResponse(response);
};

export const excluirTipoLacre = async (id) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-lacre`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
    });
    return handleResponse(response);
};

