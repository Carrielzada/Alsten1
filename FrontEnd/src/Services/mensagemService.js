const urlBase = "https://publicidadepropaganda.thiagocamponez.site/mensagem";
export async function enviarMensagem(formData, token) {
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

export async function buscarMensagem(token) {
    const resposta = await fetch(urlBase, {
        method: "GET",
        headers: {
            "Authorization": token
        },
        credentials: "include",
    });
    return await resposta.json();
}

export async function excluirMensagem(id, token) {
    const resposta = await fetch(`${urlBase}/${id}`, { // Enviando o ID na URL
        method: "DELETE",
        headers: {
            "Authorization": token
        },
        credentials: "include",
    });
    return await resposta.json();
}

export async function baixarMensagem(userId, userName, mesAno, nomeArquivo, token) {
    try {
        const url = `${urlBase}/files/${userId}/${userName}/${mesAno}/${nomeArquivo}`;
        const resposta = await fetch(url, {
            method: "GET",
            headers: { "Authorization": token },
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

export async function atualizarStatusMensagem(id, status, token) {
    const resposta = await fetch(`${urlBase}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        credentials: "include",
        body: JSON.stringify({ id, status }),
    });

    if (!resposta.ok) {
        throw new Error("Erro ao atualizar o status da mensagem.");
    }

    return await resposta.json();
}

export const buscarMensagens = async (token, status) => {
    const url = status ? `${urlBase}?status=${status}` : urlBase; // Mantém o filtro de status
    const resposta = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": token,
        },
        credentials: "include",
    });

    if (!resposta.ok) {
        throw new Error("Erro ao buscar mensagens");
    }

    return await resposta.json();
};
