import conectar from './conexao.js';
import ServicoPadrao from '../Model/ServicoPadrao.js';

class ServicoPadraoDAO {
    async gravar(servicoPadrao) {
        const conexao = await conectar();
        try {
            const sql = 'INSERT INTO servico_padrao (titulo, servico) VALUES (?, ?)';
            const [result] = await conexao.execute(sql, [servicoPadrao.titulo, servicoPadrao.servico]);
            servicoPadrao.id = result.insertId;
            return servicoPadrao;
        } catch (error) {
            console.error('Erro ao gravar serviço padrão:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async atualizar(servicoPadrao) {
        const conexao = await conectar();
        try {
            const sql = 'UPDATE servico_padrao SET titulo = ?, servico = ? WHERE id = ?';
            await conexao.execute(sql, [servicoPadrao.titulo, servicoPadrao.servico, servicoPadrao.id]);
            return servicoPadrao;
        } catch (error) {
            console.error('Erro ao atualizar serviço padrão:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async excluir(servicoPadrao) {
        const conexao = await conectar();
        try {
            const sql = 'DELETE FROM servico_padrao WHERE id = ?';
            await conexao.execute(sql, [servicoPadrao.id]);
            return true;
        } catch (error) {
            console.error('Erro ao excluir serviço padrão:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async consultar(termo = '') {
        const conexao = await conectar();
        try {
            let sql = 'SELECT * FROM servico_padrao';
            let params = [];

            if (termo && termo.trim() !== '') {
                sql += ' WHERE titulo LIKE ? OR servico LIKE ?';
                params = [`%${termo}%`, `%${termo}%`];
            }

            sql += ' ORDER BY titulo ASC';

            const [rows] = await conexao.execute(sql, params);
            return rows.map(row => new ServicoPadrao(
                row.id,
                row.titulo,
                row.servico,
                row.criado_em
            ));
        } catch (error) {
            console.error('Erro ao consultar serviços padrão:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async buscarPorId(id) {
        const conexao = await conectar();
        try {
            const sql = 'SELECT * FROM servico_padrao WHERE id = ?';
            const [rows] = await conexao.execute(sql, [id]);
            
            if (rows.length === 0) {
                return null;
            }

            const row = rows[0];
            return new ServicoPadrao(
                row.id,
                row.titulo,
                row.servico,
                row.criado_em
            );
        } catch (error) {
            console.error('Erro ao buscar serviço padrão por ID:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async listarTodos() {
        const conexao = await conectar();
        try {
            const sql = 'SELECT * FROM servico_padrao ORDER BY titulo ASC';
            const [rows] = await conexao.execute(sql);
            return rows.map(row => new ServicoPadrao(
                row.id,
                row.titulo,
                row.servico,
                row.criado_em
            ));
        } catch (error) {
            console.error('Erro ao listar todos os serviços padrão:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }
}

export default ServicoPadraoDAO; 