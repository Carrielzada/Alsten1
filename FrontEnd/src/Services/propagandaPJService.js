const urlBase = "https://publicidadepropaganda.thiagocamponez.site/propaganda_pj";

// Função para gravar uma nova PropagandaPF
export async function gravarPropagandaPJ(formData, token) {
    const resposta = await fetch(urlBase, {
        method: "POST",
        headers: {
            "Authorization": token
        },
        credentials: "include",
        body: formData,
    });
    return await resposta.json();
}

// Função para alterar uma PropagandaPF existente
export async function alterarPropagandaPJ(formData, token) {
    const resposta = await fetch(`${urlBase}/${formData.get("id")}`, {
        method: "PUT",
        headers: {
            "Authorization": token
        },
        credentials: "include",
        body: formData,
    });
    return await resposta.json();
}

// Função para buscar todas as PropagandasPF
export async function buscarTodasPropagandasPJ(token) {
    const resposta = await fetch(urlBase, {
        method: "GET",
        headers: {
            "Authorization": token
        },
        credentials: "include"
    });
    return await resposta.json();
}

// Função para excluir uma PropagandaPF
export async function excluirPropagandaPJ(propaganda, token) {
    const resposta = await fetch(`${urlBase}/${propaganda.id}`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        },
        credentials: "include"
    });
    return await resposta.json();
}

export async function baixarArquivo(nomeArquivo, cnpj, token) {
    try {
        const resposta = await fetch(`${urlBase}/files/${cnpj}/${nomeArquivo}`, {
            method: "GET",
            headers: {
               "Authorization": token
            },
            credentials: "include",
        });

        if (!resposta.ok) {
            throw new Error("Erro ao fazer o download do arquivo.");
        }

        const blob = await resposta.blob();
        const link = document.createElement("a");
        const fileURL = window.URL.createObjectURL(blob);
        link.href = fileURL;
        link.setAttribute("download", nomeArquivo);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        throw new Error("Erro ao baixar o arquivo: " + error.message);
    }
}

export async function atualizarArquivosAdicionais(formData, id, token) {
    const resposta = await fetch(`${urlBase}/arquivos-adicionais/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": token
        },
        credentials: "include",
        body: formData,
    });
    return await resposta.json();
}
