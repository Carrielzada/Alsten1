class Fabricante {
    constructor(id, nome_fabricante) {
        this.id = id;
        this.nome_fabricante = nome_fabricante;
    }

    static validar(fabricante) {
        if (!fabricante.nome_fabricante || fabricante.nome_fabricante.trim() === "") {
            throw new Error("O nome do fabricante é obrigatório.");
        }
        return true;
    }

    async gravar() {
        const FabricanteDAO = (await import("../Service/FabricanteDAO.js")).default;
        const fabricanteDAO = new FabricanteDAO();
        await fabricanteDAO.gravar(this);
    }

    async atualizar() {
        const FabricanteDAO = (await import("../Service/FabricanteDAO.js")).default;
        const fabricanteDAO = new FabricanteDAO();
        await fabricanteDAO.atualizar(this);
    }

    async excluir() {
        const FabricanteDAO = (await import("../Service/FabricanteDAO.js")).default;
        const fabricanteDAO = new FabricanteDAO();
        await fabricanteDAO.excluir(this);
    }

    async consultar(termo) {
        const FabricanteDAO = (await import("../Service/FabricanteDAO.js")).default;
        const fabricanteDAO = new FabricanteDAO();
        return await fabricanteDAO.consultar(termo);
    }
}

export default Fabricante;
