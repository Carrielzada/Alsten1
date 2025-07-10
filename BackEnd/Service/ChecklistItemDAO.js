import conectar from './conexao.js';
import ChecklistItem from '../Model/ChecklistItem.js';

class ChecklistItemDAO {
    async gravar(checklistItem) {
        const conexao = await conectar();
        try {
            const sql = 'INSERT INTO checklist_item (item) VALUES (?)';
            const [result] = await conexao.execute(sql, [checklistItem.item]);
            checklistItem.id = result.insertId;
            return checklistItem;
        } catch (error) {
            console.error('Erro ao gravar item do checklist:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async atualizar(checklistItem) {
        const conexao = await conectar();
        try {
            const sql = 'UPDATE checklist_item SET item = ? WHERE id = ?';
            await conexao.execute(sql, [checklistItem.item, checklistItem.id]);
            return checklistItem;
        } catch (error) {
            console.error('Erro ao atualizar item do checklist:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async excluir(checklistItem) {
        const conexao = await conectar();
        try {
            const sql = 'DELETE FROM checklist_item WHERE id = ?';
            await conexao.execute(sql, [checklistItem.id]);
            return true;
        } catch (error) {
            console.error('Erro ao excluir item do checklist:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async consultar(termo = '') {
        const conexao = await conectar();
        try {
            let sql = 'SELECT * FROM checklist_item';
            let params = [];

            if (termo && termo.trim() !== '') {
                sql += ' WHERE item LIKE ?';
                params = [`%${termo}%`];
            }

            sql += ' ORDER BY item ASC';

            const [rows] = await conexao.execute(sql, params);
            return rows.map(row => new ChecklistItem(
                row.id,
                row.item,
                row.criado_em
            ));
        } catch (error) {
            console.error('Erro ao consultar itens do checklist:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async buscarPorId(id) {
        const conexao = await conectar();
        try {
            const sql = 'SELECT * FROM checklist_item WHERE id = ?';
            const [rows] = await conexao.execute(sql, [id]);
            
            if (rows.length === 0) {
                return null;
            }

            const row = rows[0];
            return new ChecklistItem(
                row.id,
                row.item,
                row.criado_em
            );
        } catch (error) {
            console.error('Erro ao buscar item do checklist por ID:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async listarTodos() {
        const conexao = await conectar();
        try {
            const sql = 'SELECT * FROM checklist_item ORDER BY item ASC';
            const [rows] = await conexao.execute(sql);
            return rows.map(row => new ChecklistItem(
                row.id,
                row.item,
                row.criado_em
            ));
        } catch (error) {
            console.error('Erro ao listar todos os itens do checklist:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }
}

export default ChecklistItemDAO; 