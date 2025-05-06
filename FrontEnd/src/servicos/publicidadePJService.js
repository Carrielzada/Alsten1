const urlBase = "https://publicidadepropaganda.thiagocamponez.site/publicidade_pj";

// Função para gravar uma nova PublicidadePJ
export async function gravarPublicidadePJ(formData, token) {
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

// Função para alterar uma PublicidadePJ existente
export async function alterarPublicidadePJ(formData, token) {
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

// Função para buscar todas as PublicidadePJ
export async function buscarTodasPublicidadePJ(token) {
    const resposta = await fetch(urlBase, {
        method: "GET",
        headers: {
            "Authorization": token
        },
        credentials: "include"
    });
    return await resposta.json();
}

// Função para excluir uma PublicidadePJ
export async function excluirPublicidadePJ(propaganda, token) {
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

export async function consultarPorIdDados(id, token) {
    const resposta = await fetch(`${urlBase}/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": token,
        },
    });

    if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(erro);
    }

    return await resposta.json();
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

export async function atualizarComprovante(formData, id, token) {
    const resposta = await fetch(`${urlBase}/comprovante/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": token
        },
        credentials: "include",
        body: formData,
    });
    return await resposta.json();
}

export async function buscarComprovantes(idPublicidade, token) {
    const resposta = await fetch(`http://thiagocamponez.tech/publicidade_pj/${idPublicidade}/comprovantes`, {
        method: "GET",
        headers: {
            "Authorization": token,
        },
        credentials: "include",
    });

    if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(erro);
    }

    return await resposta.json();
}

export async function baixarComprovante(id, ano, mes, nomeArquivo, token) {
    try {
        const url = `${urlBase}/comprovantes/${id}/${ano}/${mes}/${nomeArquivo}`;
        const resposta = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": token
            },
            credentials: "include",
        });

        if (!resposta.ok) {
            throw new Error("Erro ao fazer o download do comprovante.");
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
        throw new Error("Erro ao baixar o comprovante: " + error.message);
    }
}
