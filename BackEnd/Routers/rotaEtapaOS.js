import express from 'express';
import etapaOSController from '../Controller/etapaOSCtrl.js';
import { verificarAutenticacao } from '../Security/autenticar.js';

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(verificarAutenticacao);

// GET - Listar todas as etapas da OS
router.get('/', etapaOSController.listarTodos);

// GET - Buscar etapa da OS por ID
router.get('/:id', etapaOSController.buscarPorId);

// GET - Buscar etapa da OS por nome
router.get('/nome/:nome', etapaOSController.buscarPorNome);

// POST - Criar nova etapa da OS
router.post('/', etapaOSController.gravar);

// PUT - Atualizar etapa da OS
router.put('/:id', etapaOSController.atualizar);

// DELETE - Excluir etapa da OS
router.delete('/:id', etapaOSController.excluir);

export default router; 