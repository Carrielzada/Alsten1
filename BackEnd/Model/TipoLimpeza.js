class TipoLimpeza {
    constructor(id, tipo_limpeza) {
        this.id = id;
        this.tipo_limpeza = tipo_limpeza; // Ex: "Apenas orçamento", "Consertar e orçar", "Consertar", "Orçar e finalizar"
    }

    static validar(tipoLimpeza) {
        if (!tipoLimpeza.tipo_limpeza || tipoLimpeza.tipo_limpeza.trim() === "") {
            throw new Error("O tipo de análise é obrigatório.");
        }
        // Outras validações específicas podem ser adicionadas aqui
        return true;
    }

    // Métodos para interagir com o DAO (simulando o padrão do projeto)
    async gravar() {
        const TipoLimpezaDAO = (await import("../Service/TipoLimpezaDAO.js")).default;
        const tipoLimpezaDAO = new TipoLimpezaDAO();
        await tipoLimpezaDAO.gravar(this);
    }

    async atualizar() {
        const TipoLimpezaDAO = (await import("../Service/TipoLimpezaDAO.js")).default;
        const tipoLimpezaDAO = new TipoLimpezaDAO();
        await tipoLimpezaDAO.atualizar(this);
    }

    async excluir() {
        const TipoLimpezaDAO = (await import("../Service/TipoLimpezaDAO.js")).default;
        const tipoLimpezaDAO = new TipoLimpezaDAO();
        await tipoLimpezaDAO.excluir(this);
    }

    async consultar(termo) {
        const TipoLimpezaDAO = (await import("../Service/TipoLimpezaDAO.js")).default;
        const tipoLimpezaDAO = new TipoLimpezaDAO();
        return await tipoLimpezaDAO.consultar(termo);
    }
}

export default TipoLimpeza;
