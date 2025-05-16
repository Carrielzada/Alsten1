class TipoAnalise {
    constructor(id, tipo_analise) {
        this.id = id;
        this.tipo_analise = tipo_analise; // Ex: "Apenas orçamento", "Consertar e orçar", "Consertar", "Orçar e finalizar"
    }

    static validar(tipoAnalise) {
        if (!tipoAnalise.tipo_analise || tipoAnalise.tipo_analise.trim() === "") {
            throw new Error("O tipo de análise é obrigatório.");
        }
        // Outras validações específicas podem ser adicionadas aqui
        return true;
    }

    // Métodos para interagir com o DAO (simulando o padrão do projeto)
    async gravar() {
        const TipoAnaliseDAO = (await import("../Persistencia/TipoAnaliseDAO.js")).default;
        const tipoAnaliseDAO = new TipoAnaliseDAO();
        await tipoAnaliseDAO.gravar(this);
    }

    async atualizar() {
        const TipoAnaliseDAO = (await import("../Persistencia/TipoAnaliseDAO.js")).default;
        const tipoAnaliseDAO = new TipoAnaliseDAO();
        await tipoAnaliseDAO.atualizar(this);
    }

    async excluir() {
        const TipoAnaliseDAO = (await import("../Persistencia/TipoAnaliseDAO.js")).default;
        const tipoAnaliseDAO = new TipoAnaliseDAO();
        await tipoAnaliseDAO.excluir(this);
    }

    async consultar(termo) {
        const TipoAnaliseDAO = (await import("../Persistencia/TipoAnaliseDAO.js")).default;
        const tipoAnaliseDAO = new TipoAnaliseDAO();
        return await tipoAnaliseDAO.consultar(termo);
    }
}

export default TipoAnalise;
