// Arquivo: /home/ubuntu/project_Alsten/BackEnd/Persistencia/OrdemServicoDAO.js
import conectar from "./conexao.js"; // Alterado para import default
import OrdemServico from "../Modelo/OrdemServico.js";

class OrdemServicoDAO {
    async gravar(ordemServico) {
        if (ordemServico instanceof OrdemServico) {
            const conexao = await conectar();
            if (!ordemServico.id) {
                const sql = `INSERT INTO ordens_servico (cliente, modeloEquipamento, defeitoAlegado, numeroSerie, fabricante, etapa, dataCriacao, arquivosAnexados)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                const valores = [
                    ordemServico.cliente,
                    ordemServico.modeloEquipamento,
                    ordemServico.defeitoAlegado,
                    ordemServico.numeroSerie,
                    ordemServico.fabricante,
                    ordemServico.etapa,
                    ordemServico.dataCriacao,
                    JSON.stringify(ordemServico.arquivosAnexados)
                ];
                const resultado = await conexao.query(sql, valores);
                ordemServico.id = resultado[0].insertId;
            } else {
                const sql = `UPDATE ordens_servico SET cliente = ?, modeloEquipamento = ?, defeitoAlegado = ?, 
                             numeroSerie = ?, fabricante = ?, etapa = ?, arquivosAnexados = ?
                             WHERE id = ?`;
                const valores = [
                    ordemServico.cliente,
                    ordemServico.modeloEquipamento,
                    ordemServico.defeitoAlegado,
                    ordemServico.numeroSerie,
                    ordemServico.fabricante,
                    ordemServico.etapa,
                    JSON.stringify(ordemServico.arquivosAnexados),
                    ordemServico.id
                ];
                await conexao.query(sql, valores);
            }
            conexao.release();
        }
    }

    async adicionarArquivoOS(osId, filePath) {
        const conexao = await conectar();
        const sqlSelect = `SELECT arquivosAnexados FROM ordens_servico WHERE id = ?`;
        const [rows] = await conexao.query(sqlSelect, [osId]);

        let arquivosAtuais = [];
        if (rows.length > 0 && rows[0].arquivosAnexados) {
            try {
                arquivosAtuais = JSON.parse(rows[0].arquivosAnexados);
                if (!Array.isArray(arquivosAtuais)) {
                    arquivosAtuais = [];
                }
            } catch (e) {
                console.error("Erro ao parsear arquivosAnexados: ", e);
                arquivosAtuais = [];
            }
        }
        
        arquivosAtuais.push(filePath);

        const sqlUpdate = `UPDATE ordens_servico SET arquivosAnexados = ? WHERE id = ?`;
        await conexao.query(sqlUpdate, [JSON.stringify(arquivosAtuais), osId]);
        conexao.release();
        console.log(`Arquivo ${filePath} associado à OS ID ${osId} no banco de dados.`);
    }

    async consultar(termoBusca) {
        const conexao = await conectar();
        let sql = "SELECT * FROM ordens_servico";
        const parametros = [];
        if (termoBusca) {
            sql += " WHERE cliente LIKE ? OR modeloEquipamento LIKE ?";
            parametros.push(`%${termoBusca}%`, `%${termoBusca}%`);
        }
        const [registros] = await conexao.query(sql, parametros);
        const listaOrdensServico = [];
        for (const registro of registros) {
            const os = new OrdemServico(
                registro.id,
                registro.cliente,
                registro.modeloEquipamento,
                registro.defeitoAlegado,
                registro.numeroSerie,
                registro.fabricante,
                registro.arquivosAnexados ? JSON.parse(registro.arquivosAnexados) : [],
                registro.etapa
            );
            os.dataCriacao = registro.dataCriacao;
            listaOrdensServico.push(os);
        }
        conexao.release();
        return listaOrdensServico;
    }

    async consultarPorId(id) {
        const conexao = await conectar();
        const sql = "SELECT * FROM ordens_servico WHERE id = ?";
        const [registros] = await conexao.query(sql, [id]);
        let os = null;
        if (registros.length > 0) {
            const registro = registros[0];
            os = new OrdemServico(
                registro.id,
                registro.cliente,
                registro.modeloEquipamento,
                registro.defeitoAlegado,
                registro.numeroSerie,
                registro.fabricante,
                registro.arquivosAnexados ? JSON.parse(registro.arquivosAnexados) : [],
                registro.etapa
            );
            os.dataCriacao = registro.dataCriacao;
        }
        conexao.release();
        return os;
    }
}

export default OrdemServicoDAO;

