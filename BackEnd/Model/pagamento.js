class PagamentoModel {
    constructor(id, pagamento) {
        this.id = id;
        this.pagamento = pagamento; 
    }

    static validar(pagamento) {
        if (!pagamento.pagamento || pagamento.pagamento.trim() === "") {
            throw new Error("O tipo de análise é obrigatório.");
        }

        return true;
    }
    async gravar() {
        const PagamentoDAO = (await import("../Service/PagamentoDAO.js")).default;
        const pagamentoDAO = new PagamentoDAO();
        await pagamentoDAO.gravar(this);
    }

    async atualizar() {
        const PagamentoDAO = (await import("../Service/PagamentoDAO.js")).default;
        const pagamentoDAO = new PagamentoDAO();
        await pagamentoDAO.atualizar(this);
    }

    async excluir() {
        const PagamentoDAO = (await import("../Service/PagamentoDAO.js")).default;
        const pagamentoDAO = new PagamentoDAO();
        await pagamentoDAO.excluir(this);
    }

    async consultar(termo) {
        const PagamentoDAO = (await import("../Service/PagamentoDAO.js")).default;
        const pagamentoDAO = new PagamentoDAO();
        return await pagamentoDAO.consultar(termo);
    }
}

export default PagamentoModel;
