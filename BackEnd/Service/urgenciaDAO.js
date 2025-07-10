import conectar from "./conexao.js";
import Urgencia from "../Model/Urgencia.js";

class UrgenciaDAO {
    async gravar(urgencia) {
        if (urgencia instanceof Urgencia) {
            const conexao = await conectar();
            try {
                if (!urgencia.id) {
                    const sql = "INSERT INTO urgencia (urgencia) VALUES (?)";
                    const valores = [urgencia.urgencia];
                    const resultado = await conexao.query(sql, valores);
                    urgencia.id = resultado[0].insertId;
                } else {
                    const sql = "UPDATE urgencia SET urgencia = ? WHERE id = ?";
                    const valores = [urgencia.urgencia, urgencia.id];
                    await conexao.query(sql, valores);
                }
                return urgencia;
            } catch (error) {
                console.error("Erro ao gravar Urgência:", error);
                throw error;
            } finally {
                conexao.release();
            }
        }
    }

    async consultar(termoBusca) {
    const conexao = await conectar();
    try {
        let sql = "SELECT * FROM urgencia";
        let parametros = [];
        if (termoBusca) {
            sql += " WHERE urgencia LIKE ?";
            parametros = [`%${termoBusca}%`];
        }
        const [registros] = await conexao.query(sql, parametros);
        const listaUrgencias = [];
        for (const registro of registros) {
            listaUrgencias.push({
                id: registro.id,
                urgencia: registro.urgencia
            });
        }
        return listaUrgencias;
    } catch (error) {
        console.error("Erro ao consultar Urgências:", error);
        throw error;
    } finally {
        conexao.release();
    }
}

    async consultarPorId(id) {
    const conexao = await conectar();
    try {
        const sql = "SELECT * FROM urgencia WHERE id = ?";
        const [registros] = await conexao.query(sql, [id]);
        if (registros.length > 0) {
            const registro = registros[0];
            return {
                id: registro.id,
                urgencia: registro.urgencia
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erro ao consultar Urgência por ID:", error);
        throw error;
    } finally {
        conexao.release();
    }
}

    async excluir(id) {
        const conexao = await conectar();
        try {
            const sql = "DELETE FROM urgencia WHERE id = ?";
            const resultado = await conexao.query(sql, [id]);
            return resultado[0].affectedRows > 0;
        } catch (error) {
            console.error("Erro ao excluir Urgência:", error);
            throw error;
        } finally {
            conexao.release();
        }
    }

    async incluir(urgencia) {
        return this.gravar(urgencia);
    }

    async alterar(urgencia) {
        return this.gravar(urgencia);
    }

    async filtrar(termoBusca) {
        return this.consultar(termoBusca);
    }
}

export default UrgenciaDAO;


