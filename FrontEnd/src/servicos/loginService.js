const urlBase = "http://localhost:4000/autenticacao";

export async function login(email, password){
    const resposta = await fetch(urlBase + "/login", 
        { 
        method: "POST",
        credentials: 'include', 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email, password})
    });
    const dados = await resposta.json();
    return dados;
}

export async function registrar(nome, email, password, role_id) {
    const resposta = await fetch(urlBase + "/registrar", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, password, role_id }),
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