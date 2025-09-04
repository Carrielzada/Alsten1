import Database from "../database.js";
const database = new Database();

export default class UrgenciaModel {
    constructor(id, urgencia) {
        this.id = id;
        this.urgencia = urgencia;
    }
    async obterTodos() {
        const listaUrgencias = await database.ExecutaComando('select * from urgencia order by urgencia asc');
        return listaUrgencias;
    }
    async obterPorId(id){
        const result =await database.ExecutaComando('select * from urgencia where id=? ', [id])
        return result[0]
    }
    async adicionar(dadosUrgencia) {
        await database.ExecutaComandoNonQuery('insert into urgencia set ?', dadosUrgencia)
    }
    async atualizar (id,dadosUrgencia){
        await database.ExecutaComandoNonQuery('update urgencia set ? where id = ?', [
            dadosUrgencia,
            id
        ])
    }
    async delete (id){
        await database.ExecutaComandoNonQuery('delete from urgencia where id=?',[id])
    }
    async filtrar(termobusca) {
        const urgencias = await database.ExecutaComando(
            "select * from urgencia where urgencia like ?",
            [`%${termobusca}%`]
        );
        return urgencias;
    }
}