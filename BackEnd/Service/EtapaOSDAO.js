import conectar from './conexao.js';
import EtapaOS from '../Model/EtapaOS.js';

class EtapaOSDAO {
    async gravar(etapaOS) {
        const conexao = await conectar();
        try {
            const sql = 'INSERT INTO etapa_os (nome, descricao) VALUES (?, ?)';
            const [result] = await conexao.execute(sql, [etapaOS.nome, etapaOS.descricao]);
            etapaOS.id = result.insertId;
            return etapaOS;
        } catch (error) {
            console.error('Erro ao gravar etapa da OS:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async atualizar(etapaOS) {
        const conexao = await conectar();
        try {
            const sql = 'UPDATE etapa_os SET nome = ?, descricao = ? WHERE id = ?';
            await conexao.execute(sql, [etapaOS.nome, etapaOS.descricao, etapaOS.id]);
            return etapaOS;
        } catch (error) {
            console.error('Erro ao atualizar etapa da OS:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async excluir(etapaOS) {
        const conexao = await conectar();
        try {
            const sql = 'DELETE FROM etapa_os WHERE id = ?';
            await conexao.execute(sql, [etapaOS.id]);
            return true;
        } catch (error) {
            console.error('Erro ao excluir etapa da OS:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async consultar(termo = '') {
        const conexao = await conectar();
        try {
            let sql = 'SELECT * FROM etapa_os';
            let params = [];

            if (termo && termo.trim() !== '') {
                sql += ' WHERE nome LIKE ? OR descricao LIKE ?';
                params = [`%${termo}%`, `%${termo}%`];
            }

            sql += ' ORDER BY id ASC';

            const [rows] = await conexao.execute(sql, params);
            return rows.map(row => new EtapaOS(
                row.id,
                row.nome,
                row.descricao,
                row.criado_em
            ));
        } catch (error) {
            console.error('Erro ao consultar etapas da OS:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async buscarPorId(id) {
        const conexao = await conectar();
        try {
            const sql = 'SELECT * FROM etapa_os WHERE id = ?';
            const [rows] = await conexao.execute(sql, [id]);
            
            if (rows.length === 0) {
                return null;
            }

            const row = rows[0];
            return new EtapaOS(
                row.id,
                row.nome,
                row.descricao,
                row.criado_em
            );
        } catch (error) {
            console.error('Erro ao buscar etapa da OS por ID:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async buscarPorNome(nome) {
        const conexao = await conectar();
        try {
            const sql = 'SELECT * FROM etapa_os WHERE nome = ?';
            const [rows] = await conexao.execute(sql, [nome]);
            
            if (rows.length === 0) {
                return null;
            }

            const row = rows[0];
            return new EtapaOS(
                row.id,
                row.nome,
                row.descricao,
                row.criado_em
            );
        } catch (error) {
            console.error('Erro ao buscar etapa da OS por nome:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async listarTodas() {
        const conexao = await conectar();
        try {
            const sql = 'SELECT * FROM etapa_os ORDER BY id ASC';
            const [rows] = await conexao.execute(sql);
            return rows.map(row => new EtapaOS(
                row.id,
                row.nome,
                row.descricao,
                row.criado_em
            ));
        } catch (error) {
            console.error('Erro ao listar todas as etapas da OS:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }
}

export default EtapaOSDAO; 