import ModeloDAO from "../Persistencia/modeloDAO.js";
import ModeloModel from "../Modelo/modelo.js";

export default class ModeloController {
  async obterTodos(req, res) {
    res.type("application/json");
    try {
      const dao = new ModeloDAO();
      const lista = await dao.consultar();
      res.status(200).json({ status: true, listaModelos: lista });
            console.log('Resultado de consultar modelo:', JSON.stringify(lista, null, 2));
    } catch (erro) {
      console.error("Erro ao obter pagamentos:", erro);
      res.status(500).json({ status: false, mensagem: "Erro ao obter pagamentos" });
    }
  }

  async obterPorId(req, res) {
    res.type("application/json");
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: false, mensagem: "ID não fornecido!" });
    }

    try {
      const dao = new ModeloDAO();
      const registro = await dao.consultarPorId(id);

      if (!registro) {
        return res.status(404).json({ status: false, mensagem: "Urgência não encontrada!" });
      }

      res.status(200).json({ status: true, modelo: registro });
    } catch (erro) {
      console.error("Erro ao obter pagamento:", erro);
      res.status(500).json({ status: false, mensagem: "Erro ao obter pagamento." });
    }
  }

  async incluir(req, res) {
    res.type("application/json");

    if (req.method === "POST" && req.is("application/json")) {
      const { modelo } = req.body;

      if (!modelo) {
        return res.status(400).json({ status: false, mensagem: "Campo 'modelo' é obrigatório!" });
      }

      try {
        const model = new ModeloModel(null, modelo);
        const dao = new ModeloDAO();
        await dao.incluir(model);

        res.status(201).json({
          status: true,
          mensagem: "Modelo cadastrada com sucesso!"
        });
      } catch (erro) {
        console.error("Erro ao cadastrar modelo:", erro);
        res.status(500).json({ status: false, mensagem: "Erro ao cadastrar modelo." });
      }
    } else {
      res.status(400).json({
        status: false,
        mensagem: "Método não permitido ou cliente no formato JSON não fornecido! Consulte a documentação da API."
      });
    }
  }

  async alterar(req, res) {
    res.type("application/json");

    if (req.method === "PUT" && req.is("application/json")) {
      const { id } = req.params;
      const { modelo } = req.body;

      if (!id || !modelo) {
        return res.status(400).json({ status: false, mensagem: "ID e campo 'modelo' são obrigatórios!" });
      }

      try {
        const model = new ModeloModel(id, modelo);
        const dao = new ModeloDAO();
        await dao.alterar(model);

        res.status(200).json({ status: true, mensagem: "Modelo atualizado com sucesso!" });
      } catch (erro) {
        console.error("Erro ao atualizar modelo:", erro);
        res.status(500).json({ status: false, mensagem: "Erro ao atualizar modelo." });
      }
    } else {
      res.status(400).json({
        status: false,
        mensagem: "Método não permitido ou cliente no formato JSON não fornecido! Consulte a documentação da API."
      });
    }
  }

  async excluir(req, res) {
    res.type("application/json");

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: false, mensagem: "ID não fornecido!" });
    }

    try {
      const dao = new ModeloDAO();
      await dao.excluir(id);

      res.status(200).json({ status: true, mensagem: "Modelo excluído com sucesso!" });
    } catch (erro) {
      console.error("Erro ao excluir modelo:", erro);
      res.status(500).json({ status: false, mensagem: "Erro ao excluir modelo." });
    }
  }

  async filtrar(req, res) {
    res.type("application/json");

    const { termobusca } = req.params;

    try {
      const dao = new ModeloDAO();
      const lista = await dao.filtrar(termobusca);

      res.status(200).json({ status: true, listaModelos: lista });
    } catch (erro) {
      console.error("Erro ao filtrar modelos:", erro);
      res.status(500).json({ status: false, mensagem: "Erro ao filtrar modelos." });
    }
  }
}
