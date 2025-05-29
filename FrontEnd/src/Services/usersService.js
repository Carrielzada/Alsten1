const urlBase = "http://localhost:4000/users";


export async function registrar(token, nome, email, password, role_id, id_dados) {
    const resposta = await fetch(urlBase + "/registrar", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nome, email, password, role_id, id_dados }),
    });
    return await resposta.json();
}

export async function alterarSenha(token, email, senhaAtual, novaSenha, confirmarSenha) {
    const resposta = await fetch(`${urlBase}/alterarSenha`, {
        method: "PUT",
        credentials: "include",
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
    return await resposta.json();
}

export async function consultarUsuarios(token) {
    const resposta = await fetch(`${urlBase}/`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(erro);
    }

    return await resposta.json();
}

export async function deletarUsuario(id, token) {
    const resposta = await fetch(`${urlBase}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(erro);
    }

    return await resposta.json();
}

export async function atualizarMeuPerfil(token, dadosAtualizados) {
    const resposta = await fetch(`${urlBase}/meuPerfil`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dadosAtualizados),
    });

    if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(erro);
    }

    return await resposta.json();
}


export async function atualizarUsuarioPorId(id, token, dadosAtualizados) {
    const resposta = await fetch(`${urlBase}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dadosAtualizados),
    });

    if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(erro);
    }

    return await resposta.json();
}


export async function consultarPorRole(role_id, token) {
    const resposta = await fetch(`${urlBase}/role?role_id=${role_id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(erro);
    }

    return await resposta.json();
}

