class ChecklistItem {
    constructor(id, item, criadoEm = null) {
        this.id = id;
        this.item = item;
        this.criadoEm = criadoEm;
    }

    static validar(checklistItem) {
        if (!checklistItem.item || checklistItem.item.trim() === "") {
            throw new Error("O item do checklist é obrigatório.");
        }
        return true;
    }

    async gravar() {
        const ChecklistItemDAO = (await import("../Service/ChecklistItemDAO.js")).default;
        const checklistItemDAO = new ChecklistItemDAO();
        await checklistItemDAO.gravar(this);
    }

    async atualizar() {
        const ChecklistItemDAO = (await import("../Service/ChecklistItemDAO.js")).default;
        const checklistItemDAO = new ChecklistItemDAO();
        await checklistItemDAO.atualizar(this);
    }

    async excluir() {
        const ChecklistItemDAO = (await import("../Service/ChecklistItemDAO.js")).default;
        const checklistItemDAO = new ChecklistItemDAO();
        await checklistItemDAO.excluir(this);
    }

    async consultar(termo) {
        const ChecklistItemDAO = (await import("../Service/ChecklistItemDAO.js")).default;
        const checklistItemDAO = new ChecklistItemDAO();
        return await checklistItemDAO.consultar(termo);
    }

    toJSON() {
        return {
            id: this.id,
            item: this.item,
            criadoEm: this.criadoEm
        };
    }
}

export default ChecklistItem; 