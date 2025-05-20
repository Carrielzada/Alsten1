import ClienteDAO from '../Service/clienteDAO.js';

export default class ClienteCtrl {
    async obterPublicidadesCliente(req, res) {
        res.type("application/json");
    
        const { id_dados } = req.query; // Pega o id_dados dos parâmetros de consulta
        if (!id_dados) {
            return res.status(400).json({
                status: false,
                mensagem: "Parâmetro 'id_dados' não fornecido.",
            });
        }
    
        try {
            const clienteDAO = new ClienteDAO();
            const publicidades = await clienteDAO.obterPublicidadesPorIdDados(id_dados);
    
            res.status(200).json({
                status: true,
                publicidades,
            });
        } catch (error) {
            console.error("Erro ao buscar publicidades:", error);
            res.status(500).json({
                status: false,
                mensagem: "Erro ao buscar publicidades do cliente.",
            });
        }
    }

    async obterPropagandasCliente(req, res) {
        res.type("application/json");
    
        const { id_dados } = req.query; // Pega o id_dados dos parâmetros de consulta
        if (!id_dados) {
            return res.status(400).json({
                status: false,
                mensagem: "Parâmetro 'id_dados' não fornecido.",
            });
        }
    
        try {
            const clienteDAO = new ClienteDAO();
            const propagandas = await clienteDAO.obterPropagandasPorIdDados(id_dados);
    
            res.status(200).json({
                status: true,
                publicidades: propagandas,
            });
        } catch (error) {
            console.error("Erro ao buscar propagandas:", error);
            res.status(500).json({
                status: false,
                mensagem: "Erro ao buscar publicidades do cliente.",
            });
        }
    }

    async obterPropagandasPFCliente(req, res) {
        res.type("application/json");
    
        const { id_dados } = req.query; // Pega o id_dados dos parâmetros de consulta
        if (!id_dados) {
            return res.status(400).json({
                status: false,
                mensagem: "Parâmetro 'id_dados' não fornecido.",
            });
        }
    
        try {
            const clienteDAO = new ClienteDAO();
            const propagandasPF = await clienteDAO.obterPropagandasPFPorIdDados(id_dados);
    
            res.status(200).json({
                status: true,
                propagandasPF,
            });
        } catch (error) {
            console.error("Erro ao buscar propagandasPF:", error);
            res.status(500).json({
                status: false,
                mensagem: "Erro ao buscar propagandasPF do cliente.",
            });
        }
    }
    
    
}
