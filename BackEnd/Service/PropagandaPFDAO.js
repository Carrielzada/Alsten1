import PropagandaPF from '../Model/propagandaPF.js';
import conectar from './conexao.js';

export default class PropagandaPFDAO {
    async incluir(propagandaPF) {
        if (propagandaPF instanceof PropagandaPF) {
    
            const conexao = await conectar();
            const sqlVerificarCPF = `SELECT cpf FROM cliente_pf WHERE cpf = ?`;
    
            try {
                // Verificar se o CPF existe
                console.log("Verificando se o CPF existe na tabela cliente_pf:", propagandaPF.cliente_cpf);
                const [result] = await conexao.query(sqlVerificarCPF, [propagandaPF.cliente_cpf]);
                console.log("Resultado da verificação do CPF:", result);
    
                if (result.length === 0) {
                    global.poolConexoes.releaseConnection(conexao);
                    throw new Error("O CPF informado não existe na tabela cliente_pf.");
                }
    
                const sql = `
                    INSERT INTO propaganda_pf 
                    (cliente_cpf, nome, canal, valor, data_emissao, data_encerramento, duracao, representante1_nome, representante1_contato, representante2_nome, representante2_contato, contrato_digital, arquivos_adicionais) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const valores = [
                    propagandaPF.cliente_cpf, propagandaPF.nome, propagandaPF.canal, propagandaPF.valor, propagandaPF.data_emissao, propagandaPF.data_encerramento, propagandaPF.duracao, propagandaPF.representante1_nome, propagandaPF.representante1_contato, propagandaPF.representante2_nome, propagandaPF.representante2_contato, propagandaPF.contrato_digital, propagandaPF.arquivos_adicionais
                ];
    
    
                await conexao.query(sql, valores);
                console.log("Propaganda inserida com sucesso!");
            } catch (erro) {
                console.error("Erro ao inserir propaganda:", erro.message, erro.stack);
                throw erro;
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }       
    async alterar(propagandaPF) {
        if (propagandaPF instanceof PropagandaPF) {
            const conexao = await conectar();
            const sql = `
                UPDATE propaganda_pf 
                SET cliente_cpf = ?, nome = ?, canal = ?, valor = ?, data_emissao = ?, data_encerramento = ?, duracao = ?, representante1_nome = ?, representante1_contato = ?, representante2_nome = ?, representante2_contato = ?, atualizado_em = NOW() 
                WHERE id = ?
            `;
            const valores = [
                propagandaPF.cliente_cpf, propagandaPF.nome, propagandaPF.canal, propagandaPF.valor,
                propagandaPF.data_emissao, propagandaPF.data_encerramento, propagandaPF.duracao,
                propagandaPF.representante1_nome, propagandaPF.representante1_contato,
                propagandaPF.representante2_nome, propagandaPF.representante2_contato, propagandaPF.id
            ];
            
            try {
                await conexao.query(sql, valores);
            } catch (erro) {
                console.error("Erro ao atualizar propaganda:", erro.message);
                throw erro; // Reenvia o erro para a camada de controle
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }    

    async excluir(id) {        
            const conexao = await conectar();
            const sql = `DELETE FROM propaganda_pf WHERE id = ?`;
            const valores = [id];
            const resultado = await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);

            if (resultado.affectedRows === 0) {
                throw new Error("Propaganda não encontrada ou não excluída.");
            }
        
    }

    async consultar(termo = "") {
        const conexao = await conectar();
        const sql = `
            SELECT p.id, p.cliente_cpf, c.nome AS cliente_nome, p.nome, p.canal, p.valor, p.data_emissao, p.data_encerramento, p.duracao, p.representante1_nome, p.representante1_contato, p.representante2_nome, p.representante2_contato, p.contrato_digital, p.arquivos_adicionais, p.criado_em, p.atualizado_em
            FROM propaganda_pf p
            INNER JOIN cliente_pf c ON p.cliente_cpf = c.cpf
            WHERE p.nome LIKE ? OR p.canal LIKE ? OR c.nome LIKE ?
            ORDER BY p.criado_em DESC
        `;
        const valores = [`%${termo}%`, `%${termo}%`, `%${termo}%`];
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
    
        return rows.map(row => new PropagandaPF(
            row.id, row.cliente_cpf, row.cliente_nome, row.nome, row.canal, row.valor, row.data_emissao, row.data_encerramento, row.duracao, row.representante1_nome, row.representante1_contato, row.representante2_nome, row.representante2_contato, row.contrato_digital, row.arquivos_adicionais, row.criado_em, row.atualizado_em
        ));
    }    

    async consultarPorId(id) {
        const conexao = await conectar();
        const sql = `
            SELECT id, cliente_cpf, nome, canal, valor, duracao, data_emissao, data_encerramento, 
                   contrato_digital, arquivos_adicionais, representante1_nome, representante1_contato, 
                   representante2_nome, representante2_contato, criado_em, atualizado_em
            FROM propaganda_pf
            WHERE id = ?
        `;
        const [rows] = await conexao.query(sql, [id]);
        global.poolConexoes.releaseConnection(conexao);

        if (rows.length > 0) {
            const row = rows[0];
            return new PropagandaPF(
                row.id, row.cliente_cpf, row.nome, row.canal, row.valor, row.duracao,
                row.data_emissao, row.data_encerramento, row.contrato_digital, row.arquivos_adicionais,
                row.representante1_nome, row.representante1_contato, row.representante2_nome,
                row.representante2_contato, row.criado_em, row.atualizado_em
            );
        } else {
            return null;
        }
    }

    async atualizarArquivosAdicionais(id, novosArquivos) {
        const conexao = await conectar();
    
        const sql = `
            UPDATE propaganda_pf 
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
