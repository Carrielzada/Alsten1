const urlBase = "https://publicidadepropaganda.thiagocamponez.site/clientes/pf"; 

// Função para gravar um novo ClientePF
export async function gravarClientePF(clientePF, token) {
    const resposta = await fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        credentials: 'include',
        body: JSON.stringify(clientePF)
    });
    return await resposta.json();
}

// Função para buscar todos os ClientePF
export async function buscarTodosClientePF(token) {
    const resposta = await fetch(urlBase, {
        method: "GET",
        headers: {
            "Authorization": token
        },
        credentials: 'include'
    });
    return await resposta.json();
}

// Função para excluir um ClientePF pelo ID
export async function excluirClientePF(id, token) {
    const resposta = await fetch(`${urlBase}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        },
        credentials: 'include'
    });
    return await resposta.json();
}

// Função para alterar um ClientePF existente
export async function alterarClientePF(clientePF, token) {
    return fetch(`${urlBase}/${clientePF.cpf}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        credentials: 'include',
        body: JSON.stringify(clientePF)
    }).then((res) => res.json());
}
