export const getToken = () => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
        try {
            const usuario = JSON.parse(usuarioSalvo);
            if (usuario && usuario.token) {
                return usuario.token;
            }
        } catch (error) {
            console.error("Erro ao parsear usuário do localStorage:", error);
            return null;
        }
    }

    if (process.env.NODE_ENV === "development") {
        console.warn("Usando token de desenvolvimento (mock).");
        return "seu_token_mock_aqui";
    }

    return null;
};
