import conectar from './conexao.js';
import DiasPagamento from '../Model/DiasPagamento.js';

class DiasPagamentoDAO {
    async gravar(diasPagamento) {
        const conexao = await conectar();
        try {
            const sql = 'INSERT INTO dias_pagamento (descricao, dias) VALUES (?, ?)';
            const [result] = await conexao.execute(sql, [diasPagamento.descricao, diasPagamento.dias]);
            diasPagamento.id = result.insertId;
            return diasPagamento;
        } catch (error) {
            console.error('Erro ao gravar dias de pagamento:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async atualizar(diasPagamento) {
        const conexao = await conectar();
        try {
            const sql = 'UPDATE dias_pagamento SET descricao = ?, dias = ? WHERE id = ?';
            await conexao.execute(sql, [diasPagamento.descricao, diasPagamento.dias, diasPagamento.id]);
            return diasPagamento;
        } catch (error) {
            console.error('Erro ao atualizar dias de pagamento:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async excluir(diasPagamento) {
        const conexao = await conectar();
        try {
            const sql = 'DELETE FROM dias_pagamento WHERE id = ?';
            await conexao.execute(sql, [diasPagamento.id]);
            return true;
        } catch (error) {
            console.error('Erro ao excluir dias de pagamento:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async consultar(termo = '') {
        const conexao = await conectar();
        try {
            let sql = 'SELECT * FROM dias_pagamento';
            let params = [];

            if (termo && termo.trim() !== '') {
                sql += ' WHERE descricao LIKE ? OR dias LIKE ?';
                params = [`%${termo}%`, `%${termo}%`];
            }

            sql += ' ORDER BY dias ASC';

            const [rows] = await conexao.execute(sql, params);
            return rows.map(row => new DiasPagamento(
                row.id,
                row.descricao,
                row.dias,
                row.criado_em
            ));
        } catch (error) {
            console.error('Erro ao consultar dias de pagamento:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async buscarPorId(id) {
        const conexao = await conectar();
        try {
            const sql = 'SELECT * FROM dias_pagamento WHERE id = ?';
            const [rows] = await conexao.execute(sql, [id]);
            
            if (rows.length === 0) {
                return null;
            }

            const row = rows[0];
            return new DiasPagamento(
                row.id,
                row.descricao,
                row.dias,
                row.criado_em
            );
        } catch (error) {
            console.error('Erro ao buscar dias de pagamento por ID:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async listarTodos() {
        const conexao = await conectar();
        try {
            const sql = 'SELECT * FROM dias_pagamento ORDER BY dias ASC';
            const [rows] = await conexao.execute(sql);
            return rows.map(row => new DiasPagamento(
                row.id,
                row.descricao,
                row.dias,
                row.criado_em
            ));
        } catch (error) {
            console.error('Erro ao listar todos os dias de pagamento:', error);
            throw error;
        } finally {
            conexao.release();
        }
    }
}

export default DiasPagamentoDAO; 