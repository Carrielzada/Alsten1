import PublicidadePJ from '../Model/publicidadePJ.js';
import conectar from './conexao.js';

export default class PublicidadePJDAO {
    async incluir(publicidadePJ) {
        if (publicidadePJ instanceof PublicidadePJ) {
            const conexao = await conectar();
    
            const sql = `
                INSERT INTO publicidade_pj 
                (cliente_cnpj, nome, canal, valor, data_emissao, data_encerramento, duracao, 
                 representante1_nome, representante1_contato, representante2_nome, representante2_contato, representante3_nome, representante3_contato, contrato_digital, arquivos_adicionais, criado_em) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;
    
            const valores = [
                publicidadePJ.clientePJ_cnpj, 
                publicidadePJ.nome, 
                publicidadePJ.canal, 
                publicidadePJ.valor, 
                publicidadePJ.data_emissao, 
                publicidadePJ.data_encerramento, 
                publicidadePJ.duracao,
                publicidadePJ.representante1_nome, 
                publicidadePJ.representante1_contato,
                publicidadePJ.representante2_nome, 
                publicidadePJ.representante2_contato,
                publicidadePJ.representante3_nome,
                publicidadePJ.representante3_contato,
                publicidadePJ.contrato_digital, 
                publicidadePJ.arquivos_adicionais
            ];
    
            try {
                await conexao.query(sql, valores);
            } catch (erro) {
                console.error('Erro ao inserir publicidade PJ:', erro.message);
                throw erro; // Reenvia o erro para a camada de controle
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }
    
    async alterar(publicidadePJ) {
        if (publicidadePJ instanceof PublicidadePJ) {
            const conexao = await conectar();
            
            const sql = `
                UPDATE publicidade_pj 
                SET
                    cliente_cnpj = ?,
                    nome = ?,
                    canal = ?,
                    valor = ?,
                    data_emissao = ?,
                    data_encerramento = ?,
                    duracao = ?,
                    representante1_nome = ?,
                    representante1_contato = ?,
                    representante2_nome = ?,
                    representante2_contato = ?,
                    representante3_nome = ?,
                    representante3_contato = ?,
                    atualizado_em = NOW()
                WHERE id = ?
            `;
            
            const valores = [
                publicidadePJ.clientePJ_cnpj,
                publicidadePJ.nome,
                publicidadePJ.canal,
                publicidadePJ.valor,
                publicidadePJ.data_emissao,
                publicidadePJ.data_encerramento,
                publicidadePJ.duracao,
                publicidadePJ.representante1_nome,
                publicidadePJ.representante1_contato,
                publicidadePJ.representante2_nome,
                publicidadePJ.representante2_contato,
                publicidadePJ.representante3_nome,
                publicidadePJ.representante3_contato,
                publicidadePJ.id
            ];
    
            try {
                await conexao.query(sql, valores);
            } catch (erro) {
                console.error("Erro ao atualizar publicidade PJ:", erro.message);
                throw erro;
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }
    
    

    async excluir(id) {        
        const conexao = await conectar();
        const sql = `DELETE FROM publicidade_pj WHERE id = ?`;
        const valores = [id];
        try {
            const [resultado] = await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);

            if (resultado.affectedRows === 0) {
                throw new Error("Publicidade não encontrada ou não excluída.");
            }
        } catch (erro) {
            global.poolConexoes.releaseConnection(conexao);
            console.error('Erro ao excluir publicidade PJ:', erro.message);
            throw erro; // Reenvia o erro para o controle
        }
    }

    async consultar(termo = "") {
        const conexao = await conectar();
        const sql = `
            SELECT p.id, p.cliente_cnpj, c.nome AS cliente_nome, p.nome, p.canal, p.valor, p.duracao, p.data_emissao, p.data_encerramento, p.contrato_digital, p.arquivos_adicionais, p.representante1_nome, p.representante1_contato, p.representante2_nome, p.representante2_contato, p.representante3_nome, p.representante3_contato, p.criado_em, p.atualizado_em
            FROM publicidade_pj p
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
                representante3_nome: row.representante3_nome,
                representante3_contato: row.representante3_contato,
                contrato_digital: row.contrato_digital, 
                arquivos_adicionais: row.arquivos_adicionais, 
                atualizado_em: row.atualizado_em
            }));
        } catch (erro) {
            console.error('Erro ao consultar publicidades PJ:', erro.message);
            global.poolConexoes.releaseConnection(conexao);
            throw erro; // Reenvia o erro para o controle
        }
    }
    
    
    async consultarPorId(id) {
        const conexao = await conectar();
        const sql = `
            SELECT 
                p.id AS publicidade_id,
                p.cliente_cnpj,
                p.nome AS publicidade_nome,
                p.canal,
                p.valor,
                p.duracao,
                p.data_emissao,
                p.data_encerramento,
                p.contrato_digital,
                p.arquivos_adicionais,
                p.representante1_nome,
                p.representante1_contato,
                p.representante2_nome,
                p.representante2_contato,
                p.representante3_nome,
                p.representante3_contato,
                p.criado_em,
                p.atualizado_em,
                c.id AS comprovante_id,
                c.mes AS comprovante_mes,
                c.nome AS comprovante_nome
            FROM publicidade_pj p
            LEFT JOIN comprovantes c ON p.id = c.id_publicidade
            WHERE p.id = ?
        `;
        try {
            const [rows] = await conexao.query(sql, [id]);
            global.poolConexoes.releaseConnection(conexao);
    
            if (rows.length > 0) {
                const publicidade = {
                    id: rows[0].publicidade_id,
                    cliente_cnpj: rows[0].cliente_cnpj,
                    nome: rows[0].publicidade_nome,
                    canal: rows[0].canal,
                    valor: rows[0].valor,
                    duracao: rows[0].duracao,
                    data_emissao: rows[0].data_emissao,
                    data_encerramento: rows[0].data_encerramento,
                    contrato_digital: rows[0].contrato_digital,
                    arquivos_adicionais: rows[0].arquivos_adicionais,
                    representante1_nome: rows[0].representante1_nome,
                    representante1_contato: rows[0].representante1_contato,
                    representante2_nome: rows[0].representante2_nome,
                    representante2_contato: rows[0].representante2_contato,
                    representante3_nome: rows[0].representante3_nome,
                    representante3_contato: rows[0].representante3_contato,
                    criado_em: rows[0].criado_em,
                    atualizado_em: rows[0].atualizado_em,
                    comprovantes: rows
                        .filter(row => row.comprovante_id)
                        .map(row => ({
                            id: row.comprovante_id,
                            mes: row.comprovante_mes,
                            nome: row.comprovante_nome,
                        }))
                };
    
                return publicidade;
            } else {
                return null;
            }
        } catch (erro) {
            console.error('Erro ao consultar publicidade PJ por ID:', erro.message);
            global.poolConexoes.releaseConnection(conexao);
            throw erro;
        }
    }
    

    async atualizarArquivosAdicionais(id, novosArquivos) {
        const conexao = await conectar();
    
        const sql = `
            UPDATE publicidade_pj 
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

    async inserirComprovante(id_publicidade, mes, nomeArquivo, ano) {
        const conexao = await conectar();
    
        const sql = `
            INSERT INTO comprovantes (id_publicidade, mes, nome, ano)
            VALUES (?, ?, ?, ?)
        `;
    
        const valores = [id_publicidade, mes, nomeArquivo, ano];
    
        try {
            const [resultado] = await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
    
            if (resultado.affectedRows === 0) {
                throw new Error("Nenhuma linha foi inserida. Verifique os dados fornecidos.");
            }
    
            return resultado; // Retorna o resultado da inserção, caso necessário
        } catch (erro) {
            console.error("Erro ao inserir comprovante:", erro.message);
            global.poolConexoes.releaseConnection(conexao);
            throw erro; // Reenvia o erro para a camada de controle
        }
    }    
    
    async consultarComprovantesPorPublicidade(idPublicidade) {
        const conexao = await conectar();
    
        const sql = `
            SELECT id, mes, nome, ano
            FROM comprovantes
            WHERE id_publicidade = ?
            ORDER BY mes ASC, nome ASC
        `;
    
        try {
            const [rows] = await conexao.query(sql, [idPublicidade]);
            global.poolConexoes.releaseConnection(conexao);
    
            return rows.map(row => ({
                id: row.id,
                mes: row.mes,
                nome: row.nome,
                ano: row.ano,
            }));
        } catch (erro) {
            console.error("Erro ao consultar comprovantes por publicidade:", erro.message);
            global.poolConexoes.releaseConnection(conexao);
            throw erro;
        }
    }
    
    
}
