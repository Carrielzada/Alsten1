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

export async function registrar(nome, email, password, role_id, id_dados) {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/registrar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nome, email, password, role_id, id_dados }),
    });
    return handleResponse(response);
}

export async function alterarSenha(email, senhaAtual, novaSenha, confirmarSenha) {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/alterarSenha`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            email,
            oldPassword: senhaAtual,
            newPassword: novaSenha,
            confirmPassword: confirmarSenha,
        }),
    });
    return handleResponse(response);
}

export async function consultarUsuarios() {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return handleResponse(response);
}

export async function deletarUsuario(id) {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return handleResponse(response);
}

export async function atualizarMeuPerfil(dadosAtualizados) {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/meuPerfil`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dadosAtualizados),
    });
    return handleResponse(response);
}

export async function atualizarUsuarioPorId(id, dadosAtualizados) {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dadosAtualizados),
    });
    return handleResponse(response);
}

export async function consultarPorRole(role_id) {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/role?role_id=${role_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return handleResponse(response);
}

// Buscar roles disponíveis
export async function buscarRoles() {
    // Retorna os roles fixos baseados na estrutura do banco
    return {
        status: true,
        listaRoles: [
            { id: 1, name: 'Admin' },
            { id: 2, name: 'Diretoria' },
            { id: 3, name: 'PCM' },
            { id: 4, name: 'Comercial' },
            { id: 5, name: 'Logística' },
            { id: 6, name: 'Técnico' }
        ]
    };
}

