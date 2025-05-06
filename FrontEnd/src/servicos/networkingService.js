const urlBase = "https://publicidadepropaganda.thiagocamponez.site/networking";  

// Função para gravar um novo networking
export async function gravarNetworking(networking, token) {
    const resposta = await fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        credentials: 'include',
        body: JSON.stringify(networking)
    });
    return await resposta.json();
}

// Função para buscar todos os networking
export async function buscarTodosNetworking(token) {
    const resposta = await fetch(urlBase, {
        method: "GET",
        headers: {
            "Authorization": token
        },
        credentials: 'include'
    });
    return await resposta.json();
}

// Função para excluir um networking pelo ID
export async function excluirNetworking(id, token) {
    const resposta = await fetch(`${urlBase}/${id}`, { 
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        credentials: 'include'
    });

    return await resposta.json();
}

// Função para alterar um networking existente
export async function alterarNetworking(networking, token) {
    return fetch(`${urlBase}/${networking.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        credentials: 'include',
        body: JSON.stringify(networking)
    }).then((res) => res.json());
}
