const urlBase = "https://publicidadepropaganda.thiagocamponez.site/users";

export async function registrar(nome, email, password, role_id, id_dados) {
    const resposta = await fetch(urlBase + "/registrar", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
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
            "Authorization": token
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

export async function consultarPorRole(role_id, token) {
    const resposta = await fetch(`${urlBase}/role?role_id=${role_id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
    });

    if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(erro);
    }

    return await resposta.json();
}

export async function vincularUsuarioPublicidade(userId, idDados, propPubl, token) {
    const resposta = await fetch(`${urlBase}/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        credentials: "include",
        body: JSON.stringify({ id_dados: idDados, prop_publ: propPubl }),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao vincular usuário: ${resposta.statusText}`);
    }

    return await resposta.json();
}

export async function vincularUsuarioPropaganda(userId, idDados, propPubl, token) {
    const resposta = await fetch(`${urlBase}/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        credentials: "include",
        body: JSON.stringify({ id_dados: idDados, prop_publ: propPubl }),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao vincular usuário: ${resposta.statusText}`);
    }

    return await resposta.json();
}
