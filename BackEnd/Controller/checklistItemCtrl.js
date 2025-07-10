import ChecklistItem from '../Model/ChecklistItem.js';

class ChecklistItemController {
    async listarTodos(req, res) {
        try {
            const checklistItem = new ChecklistItem();
            const lista = await checklistItem.consultar('');
            
            res.json({
                status: true,
                mensagem: "Itens do checklist listados com sucesso",
                listaChecklistItems: lista
            });
        } catch (error) {
            console.error('Erro ao listar itens do checklist:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const checklistItem = new ChecklistItem();
            const resultado = await checklistItem.consultar(id);
            
            if (resultado.length > 0) {
                res.json({
                    status: true,
                    mensagem: "Item do checklist encontrado",
                    checklistItem: resultado[0]
                });
            } else {
                res.status(404).json({
                    status: false,
                    mensagem: "Item do checklist não encontrado"
                });
            }
        } catch (error) {
            console.error('Erro ao buscar item do checklist:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }

    async gravar(req, res) {
        try {
            const { item } = req.body;
            
            if (!item) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Item é obrigatório"
                });
            }

            const checklistItem = new ChecklistItem(null, item);
            
            // Validar antes de gravar
            ChecklistItem.validar(checklistItem);
            
            await checklistItem.gravar();
            
            res.status(201).json({
                status: true,
                mensagem: "Item do checklist criado com sucesso",
                checklistItem: checklistItem
            });
        } catch (error) {
            console.error('Erro ao gravar item do checklist:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { item } = req.body;
            
            if (!item) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Item é obrigatório"
                });
            }

            const checklistItem = new ChecklistItem(parseInt(id), item);
            
            // Validar antes de atualizar
            ChecklistItem.validar(checklistItem);
            
            await checklistItem.atualizar();
            
            res.json({
                status: true,
                mensagem: "Item do checklist atualizado com sucesso",
                checklistItem: checklistItem
            });
        } catch (error) {
            console.error('Erro ao atualizar item do checklist:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const checklistItem = new ChecklistItem(parseInt(id));
            
            await checklistItem.excluir();
            
            res.json({
                status: true,
                mensagem: "Item do checklist excluído com sucesso"
            });
        } catch (error) {
            console.error('Erro ao excluir item do checklist:', error);
            res.status(500).json({
                status: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }
}

export default new ChecklistItemController(); 