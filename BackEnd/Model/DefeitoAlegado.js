class DefeitoAlegado {
    constructor(id, defeito_alegado_padrao) {
        this.id = id;
        this.defeito_alegado_padrao = defeito_alegado_padrao;
    }

    static validar(defeitoAlegado) {
        if (!defeitoAlegado.defeito_alegado_padrao || defeitoAlegado.defeito_alegado_padrao.trim() === "") {
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
