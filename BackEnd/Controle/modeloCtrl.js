import Database from "../database.js"; // Alterado para import ES Module

// Removido: const database = new Database() - Instanciar onde for usado ou passar como dependência

class ModeloModel {
    constructor(id, modelo) {
        this.id = id;
        this.modelo = modelo;
        this.database = new Database(); // Instanciando database aqui ou injetar via construtor
    }
    async obterTodos() {
        const listaModelos = await this.database.ExecutaComando("select * from modelo order by modelo asc");
        return listaModelos;
    }
    async obterPorId(id){
        const result = await this.database.ExecutaComando("select * from modelo where id=? ", [id]);
        return result[0];
    }
    async adicionar(dadosModelo) {
        await this.database.ExecutaComandoNonQuery("insert into modelo set ?", dadosModelo);
    }
    async atualizar (id,dadosModelo){
        await this.database.ExecutaComandoNonQuery("update modelo set ? where id = ?", [
            dadosModelo,
            id
        ]);
    }
    async delete (id){
        await this.database.ExecutaComandoNonQuery("delete from modelo where id=?",[id]);
    }
    async filtrar(termobusca) {
        const modelos = await this.database.ExecutaComando(
            "select * from modelo where modelo like ?",
            [`%${termobusca}%`]
        );
        return modelos;
    }
}

export default ModeloModel; // Alterado para export default

