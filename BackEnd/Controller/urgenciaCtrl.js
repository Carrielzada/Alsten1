import UrgenciaModel from "../Model/urgencia.js"; // Modelo da urgência
import UrgenciaDAO from "../Service/urgenciaDAO.js"; // DAO correspondente

export default class UrgenciaController {
  async obterTodos(req, res) {
    res.type("application/json");
    try {
      const dao = new UrgenciaDAO();
      const lista = await dao.consultar();
      res.status(200).json({ status: true, listaUrgencias: lista });
            console.log('Resultado de consultar urgencia:', JSON.stringify(lista, null, 2));
    } catch (erro) {
      console.error("Erro ao obter urgências:", erro);
      res.status(500).json({ status: false, mensagem: "Erro ao obter urgências" });
    }
  }

  async obterPorId(req, res) {
    res.type("application/json");
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: false, mensagem: "ID não fornecido!" });
    }

    try {
      const dao = new UrgenciaDAO();
      const registro = await dao.consultarPorId(id);

      if (!registro) {
        return res.status(404).json({ status: false, mensagem: "Urgência não encontrada!" });
      }

      res.status(200).json({ status: true, urgencia: registro });
    } catch (erro) {
      console.error("Erro ao obter urgência:", erro);
      res.status(500).json({ status: false, mensagem: "Erro ao obter urgência." });
    }
  }

  async incluir(req, res) {
    res.type("application/json");

    if (req.method === "POST" && req.is("application/json")) {
      const { urgencia } = req.body;

      if (!urgencia) {
        return res.status(400).json({ status: false, mensagem: "Campo 'urgencia' é obrigatório!" });
      }

      try {
        const model = new UrgenciaModel(null, urgencia);
        const dao = new UrgenciaDAO();
        await dao.incluir(model);

        res.status(201).json({
          status: true,
          mensagem: "Urgência cadastrada com sucesso!"
        });
      } catch (erro) {
        console.error("Erro ao cadastrar urgência:", erro);
        res.status(500).json({ status: false, mensagem: "Erro ao cadastrar urgência." });
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
      const { urgencia } = req.body;

      if (!id || !urgencia) {
        return res.status(400).json({ status: false, mensagem: "ID e campo 'urgencia' são obrigatórios!" });
      }

      try {
        const model = new UrgenciaModel(id, urgencia);
        const dao = new UrgenciaDAO();
        await dao.alterar(model);

        res.status(200).json({ status: true, mensagem: "Urgência atualizada com sucesso!" });
      } catch (erro) {
        console.error("Erro ao atualizar urgência:", erro);
        res.status(500).json({ status: false, mensagem: "Erro ao atualizar urgência." });
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
      const dao = new UrgenciaDAO();
      await dao.excluir(id);

      res.status(200).json({ status: true, mensagem: "Urgência excluída com sucesso!" });
    } catch (erro) {
      console.error("Erro ao excluir urgência:", erro);
      res.status(500).json({ status: false, mensagem: "Erro ao excluir urgência." });
    }
  }

  async filtrar(req, res) {
    res.type("application/json");

    const { termobusca } = req.params;

    try {
      const dao = new UrgenciaDAO();
      const lista = await dao.filtrar(termobusca);

      res.status(200).json({ status: true, listaUrgencias: lista });
    } catch (erro) {
      console.error("Erro ao filtrar urgências:", erro);
      res.status(500).json({ status: false, mensagem: "Erro ao filtrar urgências." });
    }
  }
}
