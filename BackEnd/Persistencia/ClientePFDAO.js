import ClientePF from '../Modelo/clientePF.js';
import conectar from './conexao.js';

export default class ClientePFDAO {
    async incluir(cliente) {
        if (cliente instanceof ClientePF) {
            const conexao = await conectar();
            const sql = `INSERT INTO cliente_pf (nome, cpf, data_nascimento, contato, endereco, cidade, bairro, estado, cep, criado_em, atualizado_em) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
            const valores = [
                cliente.nome,
                cliente.cpf,
                cliente.data_nascimento,
                cliente.contato,
                cliente.endereco,
                cliente.cidade,
                cliente.bairro,
                cliente.estado,
                cliente.cep
            ];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async alterar(cliente) {
        if (cliente instanceof ClientePF) {
            const conexao = await conectar();
            const sql = `UPDATE cliente_pf 
                         SET nome = ?, data_nascimento = ?, contato = ?, endereco = ?, cidade = ?, bairro = ?, estado = ?, cep = ?, atualizado_em = NOW() 
                         WHERE cpf = ?`;
            const valores = [
                cliente.nome,                // Nome
                cliente.data_nascimento,     // Data de Nascimento
                cliente.contato,             // Contato
                cliente.endereco,            // Endereço
                cliente.cidade,              // Cidade
                cliente.bairro,              // Bairro
                cliente.estado,              // Estado
                cliente.cep,                 // CEP
                cliente.cpf                  // CPF para a cláusula WHERE
            ];
            await conexao.query(sql, valores);
            global.poolConexoes.releaseConnection(conexao);
        }
    }
    
    

    async excluir(cpf) {
        const conexao = await conectar();
        const sql = "DELETE FROM cliente_pf WHERE cpf = ?";
        const valores = [cpf];
        const [resultado] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
    
        if (resultado.affectedRows === 0) {
            throw new Error("Cliente não encontrado ou já excluído.");
        }
    }
    
    
    

    async consultar(termo) {
        const conexao = await conectar();
        const sql = `SELECT * FROM cliente_pf WHERE nome LIKE ? ORDER BY nome`;
        const valores = [`%${termo}%`];
        const [rows] = await conexao.query(sql, valores);
        global.poolConexoes.releaseConnection(conexao);
    
        const listaClientes = [];
        for (const row of rows) {
            const cliente = new ClientePF(
                row.cpf, // Ajustado para usar o cpf como identificador
                row.nome,
                row.data_nascimento,
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
    

    async consultarPorId(cpf) {
        const conexao = await conectar();
        const sql = `SELECT * FROM cliente_pf WHERE cpf = ?`;
        const [rows] = await conexao.query(sql, [cpf]);
        global.poolConexoes.releaseConnection(conexao);
    
        if (rows.length > 0) {
            const row = rows[0];
            return new ClientePF(
                row.cpf, // Substituir id por cpf
                row.nome,
                row.cpf,
                row.data_nascimento,
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
    
}
