class TipoLacre {
    constructor(id, tipo_lacre) {
        this.id = id;
        this.tipo_lacre = tipo_lacre;
    }

    // Métodos estáticos para validação ou outras operações podem ser adicionados aqui
    static validar(tipoLacre) {
        if (!tipoLacre.tipo_lacre || tipoLacre.tipo_lacre.trim() === 
        "") {
            throw new Error("O tipo de lacre é obrigatório.");
        }
        return true;
    }
}

export default TipoLacre;
