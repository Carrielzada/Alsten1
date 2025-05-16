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

