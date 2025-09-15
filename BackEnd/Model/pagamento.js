import PagamentoDAO from "../Service/PagamentoDAO.js";

export default class Pagamento {
    constructor(id, pagamento) {
        this.id = id;
        this.pagamento = pagamento;
    }

    static validar(pagamento) {
        if (!pagamento.pagamento || pagamento.pagamento.trim() === "") {
            throw new Error("O pagamento é obrigatório.");
        }
        return true;
    }

    async gravar() {
        const pagamentoDAO = new PagamentoDAO();
        await pagamentoDAO.gravar(this);
    }

    async atualizar() {
        const pagamentoDAO = new PagamentoDAO();
        await pagamentoDAO.atualizar(this);
    }

    async excluir() {
        const pagamentoDAO = new PagamentoDAO();
        await pagamentoDAO.excluir(this);
    }

    async consultar(termo) {
        const pagamentoDAO = new PagamentoDAO();
        return await pagamentoDAO.consultar(termo);
    }
}