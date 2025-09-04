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

export const buscarUrgencia = async (termo = "") => {
    const token = getToken();
    const url = termo ? `${API_URL}/urgencia/${termo}` : `${API_URL}/urgencia`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const adicionarUrgencia = async (urgencia) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/urgencia`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(urgencia),
    });
    return handleResponse(response);
};

export const atualizarUrgencia = async (urgencia) => {
  const token = getToken();
  const metodo = urgencia.id ? "PUT" : "POST";
  const url = urgencia.id 
    ? `${API_URL}/urgencia/${urgencia.id}`
    : `${API_URL}/urgencia`;

  const response = await fetch(url, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(urgencia),
  });

  return await handleResponse(response);
};

export const excluirUrgencia = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/urgencia/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  return await handleResponse(response);
};