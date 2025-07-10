import express from 'express';
import BlingApiService from '../Service/blingApiService.js';
// 1. IMPORTAR a instância de autenticação que já contém o token
import { blingAuth } from './blingRoutes.js';

const router = express.Router();

// 2. CRIAR uma única instância do serviço de API, usando a autenticação importada
//    Isso garante que todas as chamadas usem o token de acesso correto.
const blingService = new BlingApiService(blingAuth);

// 3. REMOVER os middlewares antigos e desnecessários. A lógica agora é mais simples e direta.

// Rota para buscar contatos com paginação e filtros
router.get('/', async (req, res) => {
    try {
        // ... (código da rota permanece o mesmo)
        const {
            pagina = 1,
            limite = 100,
            criterio = '',
            tipo = '',
            situacao = '',
            pesquisa = '',
            numeroDocumento = '',
            idTipoContato = ''
        } = req.query;

        const options = { pagina, limite, criterio, tipo, situacao };
        if (pesquisa) options.pesquisa = pesquisa;
        if (numeroDocumento) options.numeroDocumento = numeroDocumento;
        if (idTipoContato) options.idTipoContato = idTipoContato;

        const result = await blingService.getContatos(options);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Erro na rota de contatos:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

// Rota para buscar contatos formatados para select/dropdown
router.get('/select', async (req, res) => {
    try {
        const {
            pagina = 1,
            limite = 100,
            criterio = '',
            tipo = ''
        } = req.query;

        const options = { pagina, limite, criterio, tipo };
        const result = await blingService.getContatosForSelect(options);
        res.json(result);
    } catch (error) {
        console.error('Erro na rota de contatos para select:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

// Rota para buscar um contato específico por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID inválido',
            });
        }

        const result = await blingService.getContato(parseInt(id));
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Erro ao buscar contato por ID:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

// Rota para buscar contatos por nome
router.get('/search/:nome', async (req, res) => {
    try {
        const { nome } = req.params;
        const {
            pagina = 1,
            limite = 100,
            tipo = ''
        } = req.query;

        if (!nome || nome.trim().length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Nome inválido',
            });
        }

        const options = { pagina, limite, tipo };
        const result = await blingService.searchContatosByName(nome.trim(), options);
        res.json(result);
    } catch (error) {
        console.error('Erro na busca por nome:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

// Outras rotas (POST, PUT, etc.) foram omitidas por brevidade, 
// mas devem seguir o mesmo padrão, usando a instância 'blingService'.

export default router;