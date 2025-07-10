class DiasPagamento {
    constructor(id, descricao, dias, criadoEm = null) {
        this.id = id;
        this.descricao = descricao;
        this.dias = dias;
        this.criadoEm = criadoEm;
    }

    static validar(diasPagamento) {
        if (!diasPagamento.descricao || diasPagamento.descricao.trim() === "") {
            throw new Error("A descrição dos dias de pagamento é obrigatória.");
        }
        if (diasPagamento.dias === null || diasPagamento.dias === undefined || diasPagamento.dias < 0) {
            throw new Error("O número de dias deve ser um valor válido maior ou igual a zero.");
        }
        return true;
    }

    async gravar() {
        const DiasPagamentoDAO = (await import("../Service/DiasPagamentoDAO.js")).default;
        const diasPagamentoDAO = new DiasPagamentoDAO();
        await diasPagamentoDAO.gravar(this);
    }

    async atualizar() {
        const DiasPagamentoDAO = (await import("../Service/DiasPagamentoDAO.js")).default;
        const diasPagamentoDAO = new DiasPagamentoDAO();
        await diasPagamentoDAO.atualizar(this);
    }

    async excluir() {
        const DiasPagamentoDAO = (await import("../Service/DiasPagamentoDAO.js")).default;
        const diasPagamentoDAO = new DiasPagamentoDAO();
        await diasPagamentoDAO.excluir(this);
    }

    async consultar(termo) {
        const DiasPagamentoDAO = (await import("../Service/DiasPagamentoDAO.js")).default;
        const diasPagamentoDAO = new DiasPagamentoDAO();
        return await diasPagamentoDAO.consultar(termo);
    }

    toJSON() {
        return {
            id: this.id,
            descricao: this.descricao,
            dias: this.dias,
            criadoEm: this.criadoEm
        };
    }
}

export default DiasPagamento; 