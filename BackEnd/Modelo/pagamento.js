const Database = require("../database")
const database = new Database()

class PagamentoModel {
    constructor(id, pagamento) {
        this.id = id;
        this.pagamento = pagamento;
    }
    async obterTodos() {
        const listaPagamentos = await database.ExecutaComando('select * from pagamento order by pagamento asc');
        return listaPagamentos;
    }
    async obterPorId(id){
        const result =await database.ExecutaComando('select * from pagamento where id=? ', [id])
        return result[0]
    }
    async adicionar(dadosPagamento) {
        await database.ExecutaComandoNonQuery('insert into pagamento set ?', dadosPagamento)
    }
    async atualizar (id,dadosPagamento){
        await database.ExecutaComandoNonQuery('update pagamento set ? where id = ?', [
            dadosPagamento,
            id
        ])
    }
    async delete (id){
        await database.ExecutaComandoNonQuery('delete from pagamento where id=?',[id])
    }
    async filtrar(termobusca) {
        const pagamentos = await database.ExecutaComando(
            "select * from pagamento where pagamento like ?",
            [`%${termobusca}%`]
        );
        return pagamentos;
    }
}

module.exports = PagamentoModel;