const urlBasePublicidade = "https://publicidadepropaganda.thiagocamponez.site/publicidade_pj";
const urlBasePropaganda = "https://publicidadepropaganda.thiagocamponez.site/propaganda_pj";
const urlBasePropagandaPF = "https://publicidadepropaganda.thiagocamponez.site/propaganda_pf";

export async function obterPublicidadesCliente(id_dados, token) {
    const url = `${urlBasePublicidade}?id_dados=${id_dados}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`Erro ao buscar publicidades: ${response.statusText}`);
    }

    return await response.json();
}

export async function obterPropagandasCliente(id_dados, token) {
    const url = `${urlBasePropaganda}?id_dados=${id_dados}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`Erro ao buscar publicidades: ${response.statusText}`);
    }

    return await response.json();
}

export async function obterPropagandasPFCliente(id_dados, token) {
    const url = `${urlBasePropagandaPF}?id_dados=${id_dados}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`Erro ao buscar publicidades: ${response.statusText}`);
    }

    return await response.json();
}
