const urlBase = process.env.REACT_APP_API_URL + "/clientepj"; 
// Função para gravar um novo ClientePJ
export async function gravarClientePJ(clientePJ, token) {
    const resposta = await fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(clientePJ)
    });
    return await resposta.json();
}

// Função para buscar todos os ClientePJ
export async function buscarTodosClientePJ(token) {
    const resposta = await fetch(urlBase, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
    });
    return await resposta.json();
}

// Função para excluir um ClientePJ pelo ID
export async function excluirClientePJ(cnpj, token) {
    const resposta = await fetch(`${urlBase}/${cnpj}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
    });
    return await resposta.json();
}

// Função para alterar um ClientePJ existente
export async function alterarClientePJ(clientePJ, token) {
    return fetch(`${urlBase}/${clientePJ.cnpj}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        credentials: 'include',
        body: JSON.stringify(clientePJ)
    }).then((res) => res.json());
}
