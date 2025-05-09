const Database = require("../database")
const database = new Database()

class ModeloModel {
    constructor(id, modelo) {
        this.id = id;
        this.modelo = modelo;
    }
    async obterTodos() {
        const listaModelos = await database.ExecutaComando('select * from modelo order by modelo asc');
        return listaModelos;
    }
    async obterPorId(id){
        const result =await database.ExecutaComando('select * from modelo where id=? ', [id])
        return result[0]
    }
    async adicionar(dadosModelo) {
        await database.ExecutaComandoNonQuery('insert into modelo set ?', dadosModelo)
    }
    async atualizar (id,dadosModelo){
        await database.ExecutaComandoNonQuery('update modelo set ? where id = ?', [
            dadosModelo,
            id
        ])
    }
    async delete (id){
        await database.ExecutaComandoNonQuery('delete from modelo where id=?',[id])
    }
    async filtrar(termobusca) {
        const modelos = await database.ExecutaComando(
            "select * from modelo where modelo like ?",
            [`%${termobusca}%`]
        );
        return modelos;
    }
}

module.exports = ModeloModel;