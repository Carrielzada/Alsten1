const urlBase = "https://publicidadepropaganda.thiagocamponez.site/propaganda_pf";

// Função para gravar uma nova PropagandaPF
export async function gravarPropagandaPF(formData, token) {
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

export async function alterarPropagandaPF(formData, token) {
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
export async function buscarTodasPropagandasPF(token) {
    const resposta = await fetch(urlBase, {
        method: "GET",
        headers: {
            "Authorization": token
        },
        credentials: "include",
    });
    const dados = await resposta.json();
    console.log("Resposta buscarTodasPropagandasPF:", dados); // Log para depuração
    return dados;
}

// Função para excluir uma PropagandaPF
export async function excluirPropagandaPF(propaganda, token) {
    const resposta = await fetch(`${urlBase}/${propaganda.id}`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        },
        credentials: "include",
    });
    return await resposta.json();
}

// Função para baixar um arquivo
export async function baixarArquivo(nomeArquivo, cpf, token) {
    try {
        const resposta = await fetch(`${urlBase}/files/${cpf}/${nomeArquivo}`, {
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
