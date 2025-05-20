class TipoLacre {
    constructor(id, tipo_lacre) {
        this.id = id;
        this.tipo_lacre = tipo_lacre; 
    }

    static validar(tipoAnalise) {
        if (!tipoAnalise.tipo_lacre || tipoAnalise.tipo_lacre.trim() === "") {
            throw new Error("O tipo de análise é obrigatório.");
        }
        // Outras validações específicas podem ser adicionadas aqui
        return true;
    }

    // Métodos para interagir com o DAO (simulando o padrão do projeto)
    async gravar() {
        const TipoLacreDAO = (await import("../Persistencia/TipoLacreDAO.js")).default;
        const tipoLacreDAO = new TipoLacreDAO();
        await tipoLacreDAO.gravar(this);
    }

    async atualizar() {
        const TipoLacreDAO = (await import("../Persistencia/TipoLacreDAO.js")).default;
        const tipoLacreDAO = new TipoLacreDAO();
        await tipoLacreDAO.atualizar(this);
    }

    async excluir() {
        const TipoLacreDAO = (await import("../Persistencia/TipoLacreDAO.js")).default;
        const tipoLacreDAO = new TipoLacreDAO();
        await tipoLacreDAO.excluir(this);
    }

    async consultar(termo) {
        const TipoLacreDAO = (await import("../Persistencia/TipoLacreDAO.js")).default;
        const tipoLacreDAO = new TipoLacreDAO();
        return await tipoLacreDAO.consultar(termo);
    }
}

export default TipoLacre;