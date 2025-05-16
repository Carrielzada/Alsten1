import Database from "../database.js"; // Alterado para import ES Module

class PagamentoModel {
    constructor(id, pagamento) {
        this.id = id;
        this.pagamento = pagamento;
        this.database = new Database(); // Instanciando database aqui ou injetar via construtor
    }
    async obterTodos() {
        const listaPagamentos = await this.database.ExecutaComando("select * from pagamento order by pagamento asc");
        return listaPagamentos;
    }
    async obterPorId(id){
        const result = await this.database.ExecutaComando("select * from pagamento where id=? ", [id]);
        return result[0];
    }
    async adicionar(dadosPagamento) {
        await this.database.ExecutaComandoNonQuery("insert into pagamento set ?", dadosPagamento);
    }
    async atualizar (id,dadosPagamento){
        await this.database.ExecutaComandoNonQuery("update pagamento set ? where id = ?", [
            dadosPagamento,
            id
        ]);
    }
    async delete (id){
        await this.database.ExecutaComandoNonQuery("delete from pagamento where id=?",[id]);
    }
    async filtrar(termobusca) {
        const pagamentos = await this.database.ExecutaComando(
            "select * from pagamento where pagamento like ?",
            [`%${termobusca}%`]
        );
        return pagamentos;
    }
}

export default PagamentoModel; // Alterado para export default

