class EtapaOS {
    constructor(id, nome, descricao, criadoEm = null) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.criadoEm = criadoEm;
    }

    static validar(etapaOS) {
        if (!etapaOS.nome || etapaOS.nome.trim() === "") {
            throw new Error("O nome da etapa é obrigatório.");
        }
        return true;
    }

    async gravar() {
        const EtapaOSDAO = (await import("../Service/EtapaOSDAO.js")).default;
        const etapaOSDAO = new EtapaOSDAO();
        await etapaOSDAO.gravar(this);
    }

    async atualizar() {
        const EtapaOSDAO = (await import("../Service/EtapaOSDAO.js")).default;
        const etapaOSDAO = new EtapaOSDAO();
        await etapaOSDAO.atualizar(this);
    }

    async excluir() {
        const EtapaOSDAO = (await import("../Service/EtapaOSDAO.js")).default;
        const etapaOSDAO = new EtapaOSDAO();
        await etapaOSDAO.excluir(this);
    }

    async consultar(termo) {
        const EtapaOSDAO = (await import("../Service/EtapaOSDAO.js")).default;
        const etapaOSDAO = new EtapaOSDAO();
        return await etapaOSDAO.consultar(termo);
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            descricao: this.descricao,
            criadoEm: this.criadoEm
        };
    }
}

export default EtapaOS; 