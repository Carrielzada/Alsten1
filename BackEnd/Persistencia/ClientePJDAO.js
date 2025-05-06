import ClientePJ from '../Modelo/clientePJ.js';
import conectar from './conexao.js';

export default class ClientePJDAO {
    async incluir(clientePJ) {
        if (clientePJ instanceof ClientePJ) {
            const conexao = await conectar();
            const sql = `
                INSERT INTO cliente_pj (cnpj, nome, nome_fantasia, contato, endereco, cidade, bairro, estado, cep, criado_em, atualizado_em)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;
            const valores = [
                clientePJ.cnpj,
                clientePJ.nome,
                clientePJ.nome_fantasia,
                clientePJ.contato,
                clientePJ.endereco,
                clientePJ.cidade,
                clientePJ.bairro,
                clientePJ.estado,
                clientePJ.cep
            ];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async alterar(clientePJ) {
        if (clientePJ instanceof ClientePJ) {
            const conexao = await conectar();
            const sql = `
                UPDATE cliente_pj
                SET nome = ?, nome_fantasia = ?, contato = ?, endereco = ?, cidade = ?, bairro = ?, estado = ?, cep = ?, atualizado_em = NOW()
                WHERE cnpj = ?
            `;
            const valores = [
                clientePJ.nome,
                clientePJ.nome_fantasia,
                clientePJ.contato,
                clientePJ.endereco,
                clientePJ.cidade,
                clientePJ.bairro,
                clientePJ.estado,
                clientePJ.cep,
                clientePJ.cnpj
            ];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(cnpj) {
        const conexao = await conectar();
        const sql = "DELETE FROM cliente_pj WHERE cnpj = ?";
        const valores = [cnpj];
        const [resultado] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);

        if (resultado.affectedRows === 0) {
            throw new Error("Cliente PJ não encontrado ou já excluído.");
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        const sql = `
            SELECT *
            FROM cliente_pj
            WHERE nome LIKE ? OR nome_fantasia LIKE ?
            ORDER BY nome
        `;
        const valores = [`%${termo}%`, `%${termo}%`];
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);

        const listaClientes = [];
        for (const row of rows) {
            const cliente = new ClientePJ(
                row.cnpj,
                row.nome,
                row.nome_fantasia,
                row.contato,
                row.endereco,
                row.cidade,
                row.bairro,
                row.estado,
                row.cep,
                row.criado_em,
                row.atualizado_em
            );
            listaClientes.push(cliente);
        }
        return listaClientes;
    }

    async consultarPorId(cnpj) {
        const conexao = await conectar();
        const sql = `
            SELECT *
            FROM cliente_pj
            WHERE cnpj = ?
        `;
        const [rows] = await conexao.query(sql, [cnpj]);
        global.poolConexoes.releaseConnection(conexao);

        if (rows.length > 0) {
            const row = rows[0];
            return new ClientePJ(
                row.cnpj,
                row.nome,
                row.nome_fantasia,
                row.contato,
                row.endereco,
                row.cidade,
                row.bairro,
                row.estado,
                row.cep,
                row.criado_em,
                row.atualizado_em
            );
        } else {
            return null;
        }
    }

    async consultarPorCnpj(cnpj) {
        const conexao = await conectar();
        const sql = "SELECT * FROM cliente_pj WHERE cnpj = ?";
        const [rows] = await conexao.query(sql, [cnpj]);
        global.poolConexoes.releaseConnection(conexao);
        return rows.length > 0;
    }
}
