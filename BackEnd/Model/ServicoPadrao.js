class ServicoPadrao {
    constructor(id, titulo, servico, criadoEm = null) {
        this.id = id;
        this.titulo = titulo;
        this.servico = servico;
        this.criadoEm = criadoEm;
    }

    static validar(servicoPadrao) {
        if (!servicoPadrao.titulo || servicoPadrao.titulo.trim() === "") {
            throw new Error("O título do serviço é obrigatório.");
        }
        if (!servicoPadrao.servico || servicoPadrao.servico.trim() === "") {
            throw new Error("A descrição do serviço é obrigatória.");
        }
        return true;
    }

    async gravar() {
        const ServicoPadraoDAO = (await import("../Service/ServicoPadraoDAO.js")).default;
        const servicoPadraoDAO = new ServicoPadraoDAO();
        await servicoPadraoDAO.gravar(this);
    }

    async atualizar() {
        const ServicoPadraoDAO = (await import("../Service/ServicoPadraoDAO.js")).default;
        const servicoPadraoDAO = new ServicoPadraoDAO();
        await servicoPadraoDAO.atualizar(this);
    }

    async excluir() {
        const ServicoPadraoDAO = (await import("../Service/ServicoPadraoDAO.js")).default;
        const servicoPadraoDAO = new ServicoPadraoDAO();
        await servicoPadraoDAO.excluir(this);
    }

    async consultar(termo) {
        const ServicoPadraoDAO = (await import("../Service/ServicoPadraoDAO.js")).default;
        const servicoPadraoDAO = new ServicoPadraoDAO();
        return await servicoPadraoDAO.consultar(termo);
    }

    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            servico: this.servico,
            criadoEm: this.criadoEm
        };
    }
}

export default ServicoPadrao; 