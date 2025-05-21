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

export const buscarTiposTransporte = async (termo = "") => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-transporte/${termo}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const adicionarTipoTransporte = async (tipoTransporte) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-transporte`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(tipoTransporte),
    });
    return handleResponse(response);
};

export const atualizarTipoTransporte = async (tipoTransporte) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-transporte`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(tipoTransporte),
    });
    return handleResponse(response);
};

export const excluirTipoTransporte = async (id) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/tipo-transporte`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
    });
    return handleResponse(response);
};

