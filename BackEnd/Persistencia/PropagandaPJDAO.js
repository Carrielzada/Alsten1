import PropagandaPJ from '../Modelo/propagandaPJ.js';
import conectar from './conexao.js';

export default class PropagandaPJDAO {
    async incluir(propagandaPJ) {
        if (propagandaPJ instanceof PropagandaPJ) {
            const conexao = await conectar();
    
            const sql = `
                INSERT INTO propaganda_pj 
                (cliente_cnpj, nome, canal, valor, data_emissao, data_encerramento, duracao, 
                 representante1_nome, representante1_contato, representante2_nome, representante2_contato, 
                 contrato_digital, arquivos_adicionais, criado_em) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;
    
            // Certifique-se de que a variável `valores` é declarada antes de ser utilizada
            const valores = [
                propagandaPJ.clientePJ_cnpj, 
                propagandaPJ.nome, 
                propagandaPJ.canal, 
                propagandaPJ.valor, 
                propagandaPJ.data_emissao, 
                propagandaPJ.data_encerramento, 
                propagandaPJ.duracao,
                propagandaPJ.representante1_nome, 
                propagandaPJ.representante1_contato,
                propagandaPJ.representante2_nome, 
                propagandaPJ.representante2_contato,
                propagandaPJ.contrato_digital, 
                propagandaPJ.arquivos_adicionais
            ];
    
            try {
                await conexao.query(sql, valores);
            } catch (erro) {
                console.error('Erro ao inserir propaganda PJ:', erro.message);
                throw erro; // Reenvia o erro para a camada de controle
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }
    
    async alterar(propagandaPJ) {
        if (propagandaPJ instanceof PropagandaPJ) {
            const conexao = await conectar();
            const sql = `
                UPDATE propaganda_pj 
                SET cliente_cnpj = ?, nome = ?, canal = ?, valor = ?, data_emissao = ?, data_encerramento = ?, duracao = ?, representante1_nome = ?, representante1_contato = ?, representante2_nome = ?, representante2_contato = ?, atualizado_em = NOW() 
                WHERE id = ?
            `;
            const valores = [
                propagandaPJ.clientePJ_cnpj, propagandaPJ.nome, propagandaPJ.canal, propagandaPJ.valor, propagandaPJ.data_emissao, propagandaPJ.data_encerramento, propagandaPJ.duracao, propagandaPJ.representante1_nome, propagandaPJ.representante1_contato,
                propagandaPJ.representante2_nome, propagandaPJ.representante2_contato,
                propagandaPJ.id
            ];
            try {
                await conexao.query(sql, valores);
            } catch (erro) {
                console.error("Erro ao atualizar propaganda PJ:", erro.message);
                throw erro; // Reenvia o erro para a camada de controle
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async excluir(id) {        
        const conexao = await conectar();
        const sql = `DELETE FROM propaganda_pj WHERE id = ?`;
        const valores = [id];
        try {
            const [resultado] = await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);

            if (resultado.affectedRows === 0) {
                throw new Error("Propaganda não encontrada ou não excluída.");
            }
        } catch (erro) {
            global.poolConexoes.releaseConnection(conexao);
            console.error('Erro ao excluir propaganda PJ:', erro.message);
            throw erro; // Reenvia o erro para o controle
        }
    }

    async consultar(termo = "") {
        const conexao = await conectar();
        const sql = `
            SELECT p.id, p.cliente_cnpj, c.nome AS cliente_nome, p.nome, p.canal, p.valor, p.duracao, p.data_emissao, p.data_encerramento, p.contrato_digital, p.arquivos_adicionais, p.representante1_nome, p.representante1_contato, p.representante2_nome, p.representante2_contato, p.criado_em, p.atualizado_em
            FROM propaganda_pj p
            INNER JOIN cliente_pj c ON p.cliente_cnpj = c.cnpj
            WHERE p.nome LIKE ? OR p.canal LIKE ? OR c.nome LIKE ?
            ORDER BY p.criado_em DESC
        `;
        const valores = [`%${termo}%`, `%${termo}%`, `%${termo}%`];
        try {
            const [rows] = await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
    
            return rows.map(row => ({
                id: row.id,
                clientePJ_cnpj: row.cliente_cnpj,
                cliente_nome: row.cliente_nome, // Nome do cliente PJ
                nome: row.nome,
                canal: row.canal,
                valor: row.valor,
                data_emissao: row.data_emissao,
                data_encerramento: row.data_encerramento,
                duracao: row.duracao,
                representante1_nome: row.representante1_nome,
                representante1_contato: row.representante1_contato,
                representante2_nome: row.representante2_nome,
                representante2_contato: row.representante2_contato,
                contrato_digital: row.contrato_digital, 
                arquivos_adicionais:row.arquivos_adicionais, 
                atualizado_em: row.atualizado_em
            }));
        } catch (erro) {
            console.error('Erro ao consultar propagandas PJ:', erro.message);
            global.poolConexoes.releaseConnection(conexao);
            throw erro; // Reenvia o erro para o controle
        }
    }
    
    
    async consultarPorId(id) {
        const conexao = await conectar();
        const sql = `
            SELECT id, cliente_cnpj, nome, canal, valor, duracao, data_emissao, data_encerramento, 
                   contrato_digital, arquivos_adicionais, representante1_nome, representante1_contato, 
                   representante2_nome, representante2_contato, criado_em, atualizado_em
            FROM propaganda_pj
            WHERE id = ?
        `;
        try {
            const [rows] = await conexao.query(sql, [id]);
            global.poolConexoes.releaseConnection(conexao);

            if (rows.length > 0) {
                const row = rows[0];
                return new PropagandaPJ(
                    row.id, row.cliente_cnpj, row.nome, row.canal, row.valor, row.duracao,
                    row.data_emissao, row.data_encerramento, row.contrato_digital, row.archivos_adicionais,
                    row.representante1_nome, row.representante1_contato, row.representante2_nome,
                    row.representante2_contato
                );
            } else {
                return null;
            }
        } catch (erro) {
            console.error('Erro ao consultar propaganda PJ por ID:', erro.message);
            global.poolConexoes.releaseConnection(conexao);
            throw erro; // Reenvia o erro para o controle
        }
    }

    async atualizarArquivosAdicionais(id, novosArquivos) {
        const conexao = await conectar();
    
        const sql = `
            UPDATE propaganda_pj 
            SET arquivos_adicionais = 
                CASE 
                    WHEN arquivos_adicionais IS NOT NULL AND arquivos_adicionais != '' 
                    THEN CONCAT(arquivos_adicionais, ',', ?) 
                    ELSE ? 
                END,
                atualizado_em = NOW()
            WHERE id = ?
        `;
    
        const valores = [novosArquivos, novosArquivos, id];
    
        try {
            const [resultado] = await conexao.query(sql, valores);
            if (resultado.affectedRows === 0) {
                throw new Error("Nenhuma linha foi atualizada. Verifique o ID fornecido.");
            }
        } catch (erro) {
            console.error("Erro ao atualizar arquivos adicionais:", erro.message);
            throw erro;
        } finally {
            global.poolConexoes.releaseConnection(conexao);
        }
    }
}
