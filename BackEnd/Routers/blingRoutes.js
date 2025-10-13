import express from 'express';
import BlingAuth from '../middleware/blingAuth.js';

const router = express.Router();

// Instância única do BlingAuth
const blingAuth = new BlingAuth();

// Rota para iniciar o processo de autenticação
router.get('/auth', (req, res) => {
    try {
        // Se a redirectUri não estiver definida via env, derive da requisição atual
        if (!blingAuth.redirectUri) {
            const derived = `${req.protocol}://${req.get('host')}/bling/callback`;
            blingAuth.redirectUri = derived;
            console.log('⚙️ BLING_REDIRECT_URI ausente. Usando derivada:', derived);
        }
        const authUrl = blingAuth.getAuthorizationUrl();
        
        // Se for uma requisição AJAX, retorna a URL
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.json({
                success: true,
                authUrl: authUrl,
                message: 'Redirecione o usuário para esta URL para autenticar no Bling'
            });
        }
        
        // Caso contrário, redireciona diretamente
        res.redirect(authUrl);
    } catch (error) {
        console.error('Erro ao gerar URL de autenticação:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Não foi possível gerar a URL de autenticação'
        });
    }
});

// Rota de callback do Bling
router.get('/callback', async (req, res) => {
    const { code, state, error } = req.query;
    
    try {
        // Verifica se houve erro na autorização
        if (error) {
            console.error('Erro na autorização do Bling:', error);
            return res.status(400).json({
                error: 'Autorização negada',
                message: 'O usuário negou a autorização ou ocorreu um erro no Bling'
            });
        }
        
        // Verifica se o código foi fornecido
        if (!code) {
            return res.status(400).json({
                error: 'Código de autorização não fornecido',
                message: 'O Bling não retornou um código de autorização válido'
            });
        }
        
        // Valida o state para prevenir ataques CSRF
        if (!state || !blingAuth.validateState(state)) {
            return res.status(400).json({
                error: 'State inválido',
                message: 'O parâmetro state é inválido ou expirou'
            });
        }
        
        // Troca o código pelos tokens
        const tokens = await blingAuth.exchangeCodeForTokens(code);
        
        console.log('Autenticação realizada com sucesso');
        
        // Redireciona para o frontend com sucesso
        // Sanitizar FRONTEND_URL (ex.: "https://alsten.online,https://outra")
        const raw = process.env.FRONTEND_URL || 'http://og4o08cscgos0kgkkogk0k84.31.97.151.181.sslip.io';
        const first = String(raw).split(',')[0].trim();
        const hasProtocol = /^https?:\/\//i.test(first);
        const base = hasProtocol ? first : `https://${first}`;
        const cleanBase = base.replace(/,+$/,'').replace(/\/$/,'');
        if (raw.includes(',')) {
            console.warn('FRONTEND_URL contém múltiplos valores. Usando o primeiro:', cleanBase);
        }
        
        const successUrl = `${cleanBase}/bling/success`;
        console.log(`Redirecionando para: ${successUrl}`);
        res.redirect(successUrl);
        
    } catch (error) {
        console.error('Erro no callback do Bling:', error);
        res.status(500).json({
            error: 'Erro na autenticação',
            message: error.message
        });
    }
});

// Rota para verificar status da autenticação
router.get('/status', (req, res) => {
    try {
        const userId = req.query.userId;
        
        // Para implementação futura: verificar autenticação por usuário
        // Por enquanto, manter comportamento atual mas logar o userId
        if (userId) {
            console.log(`Verificando status do Bling para usuário: ${userId}`);
        }
        
        const tokenInfo = blingAuth.getTokenInfo();
        res.json({
            success: true,
            userId: userId, // Retornar o userId para controle no frontend
            ...tokenInfo,
            message: tokenInfo.isAuthenticated ? 'Autenticado no Bling' : 'Não autenticado no Bling'
        });
    } catch (error) {
        console.error('Erro ao verificar status:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Não foi possível verificar o status da autenticação'
        });
    }
});


// Rota para fazer logout (limpar tokens)
router.post('/logout', (req, res) => {
    try {
        blingAuth.clearTokens();
        res.json({
            success: true,
            message: 'Logout realizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Não foi possível fazer logout'
        });
    }
});

// Rota para renovar token manualmente
router.post('/refresh', async (req, res) => {
    try {
        const tokens = await blingAuth.refreshAccessToken();
        res.json({
            success: true,
            message: 'Token renovado com sucesso',
            tokenInfo: blingAuth.getTokenInfo()
        });
    } catch (error) {
        console.error('Erro ao renovar token:', error);
        res.status(401).json({
            error: 'Erro ao renovar token',
            message: error.message,
            needsAuth: true
        });
    }
});

export default router;
export { blingAuth };


