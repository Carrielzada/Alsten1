// Arquivo: /home/ubuntu/project_Alsten/BackEnd/Rotas/rotaOrdemServico.js
import express from "express";
import OrdemServicoCtrl from "../Controle/ordemServicoCtrl.js"; // Alterado para import ES Module

const router = express.Router();
const osCtrl = new OrdemServicoCtrl();

// Rota para gravar (criar/atualizar) uma Ordem de Serviço
router.post("/", osCtrl.gravar.bind(osCtrl)); 

// Rota para consultar todas as Ordens de Serviço (com filtro opcional)
router.get("/", osCtrl.consultar.bind(osCtrl)); 

// Rota para consultar uma Ordem de Serviço específica pelo ID
router.get("/:id", osCtrl.consultarPorId.bind(osCtrl)); 

// Rota para mudar a etapa de uma Ordem de Serviço
router.put("/:id/mudar-etapa", osCtrl.mudarEtapa.bind(osCtrl)); 

export default router; 

