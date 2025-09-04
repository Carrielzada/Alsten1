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

export const buscarModelo = async (termo = "") => {
    const token = getToken();
    const url = termo
        ? `${API_URL}/modelo/filtrar/${encodeURIComponent(termo)}`
        : `${API_URL}/modelo`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    return handleResponse(response);
};



export const adicionarModelo = async (modelo) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/modelo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(modelo),
    });
    return handleResponse(response);
};

export const atualizarModelo = async (modelo) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/modelo/${modelo.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(modelo),
    });
    return handleResponse(response);
};

export const excluirModelo = async (id) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/modelo/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};


