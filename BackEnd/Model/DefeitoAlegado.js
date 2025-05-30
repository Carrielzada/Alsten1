class DefeitoAlegado {
    constructor(id, titulo, defeito) {
        this.id = id;
        this.titulo = titulo; // Adicionado
        this.defeito = defeito;
    }

    static validar(defeitoAlegado) {
        if (!defeitoAlegado.defeito || defeitoAlegado.defeito.trim() === "") {
            throw new Error("A descrição do defeito alegado é obrigatória.");
        }
        return true;
    }

    async gravar() {
        const DefeitoAlegadoDAO = (await import("../Service/DefeitoAlegadoDAO.js")).default;
        const defeitoAlegadoDAO = new DefeitoAlegadoDAO();
        await defeitoAlegadoDAO.gravar(this);
    }

    async atualizar() {
        const DefeitoAlegadoDAO = (await import("../Service/DefeitoAlegadoDAO.js")).default;
        const defeitoAlegadoDAO = new DefeitoAlegadoDAO();
        await defeitoAlegadoDAO.atualizar(this);
    }

    async excluir() {
        const DefeitoAlegadoDAO = (await import("../Service/DefeitoAlegadoDAO.js")).default;
        const defeitoAlegadoDAO = new DefeitoAlegadoDAO();
        await defeitoAlegadoDAO.excluir(this);
    }

    async consultar(termo) {
        const DefeitoAlegadoDAO = (await import("../Service/DefeitoAlegadoDAO.js")).default;
        const defeitoAlegadoDAO = new DefeitoAlegadoDAO();
        return await defeitoAlegadoDAO.consultar(termo);
    }
}

export default DefeitoAlegado;
