class TipoTransporte {
    constructor(id, tipo_transporte) {
        this.id = id;
        this.tipo_transporte = tipo_transporte; // Ex: "Apenas orçamento", "Consertar e orçar", "Consertar", "Orçar e finalizar"
    }

    static validar(tipoTransporte) {
        if (!tipoTransporte.tipo_transporte || tipoTransporte.tipo_transporte.trim() === "") {
            throw new Error("O tipo de análise é obrigatório.");
        }
        // Outras validações específicas podem ser adicionadas aqui
        return true;
    }

    // Métodos para interagir com o DAO (simulando o padrão do projeto)
    async gravar() {
        const TipoTransporteDAO = (await import("../Service/TipoTransporteDAO.js")).default;
        const tipoTransporteDAO = new TipoTransporteDAO();
        await tipoTransporteDAO.gravar(this);
    }

    async atualizar() {
        const TipoTransporteDAO = (await import("../Service/TipoTransporteDAO.js")).default;
        const tipoTransporteDAO = new TipoTransporteDAO();
        await tipoTransporteDAO.atualizar(this);
    }

    async excluir() {
        const TipoTransporteDAO = (await import("../Service/TipoTransporteDAO.js")).default;
        const tipoTransporteDAO = new TipoTransporteDAO();
        await tipoTransporteDAO.excluir(this);
    }

    async consultar(termo) {
        const TipoTransporteDAO = (await import("../Service/TipoTransporteDAO.js")).default;
        const tipoTransporteDAO = new TipoTransporteDAO();
        return await tipoTransporteDAO.consultar(termo);
    }
}

export default TipoTransporte;
