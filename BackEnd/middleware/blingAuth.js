import axios from 'axios';
import crypto from 'crypto';

class BlingAuth {
    constructor() {
        this.clientId = process.env.BLING_CLIENT_ID;
        this.clientSecret = process.env.BLING_CLIENT_SECRET;
        this.redirectUri = process.env.BLING_REDIRECT_URI;
        this.baseUrl = process.env.BLING_BASE_URL;
        
        this.tokens = {
            accessToken: null,
            refreshToken: null,
            expiresAt: null
        };
        
        this.states = new Map();
    }

    getAuthorizationUrl() {
        const state = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + (10 * 60 * 1000);
        
        this.states.set(state, { expiresAt });

        // ==================== INÍCIO DA CORREÇÃO ====================
        // Definindo um conjunto de permissões (scopes) mais completo e correto.
        // As permissões são separadas por espaço.
        const permissions = [
            'contatos_read', 'contatos_write',
            'produtos_read', 'produtos_write',
            'pedidos_read', 'pedidos_write',
            'notas_fiscais_read', 'notas_fiscais_write'
        ].join(' ');

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            state: state,
            scope: permissions // <-- USANDO AS PERMISSÕES CORRETAS
        });
        // ===================== FIM DA CORREÇÃO ======================

        return `https://bling.com.br/Api/v3/oauth/authorize?${params.toString()}`;
    }

    // ... O restante do arquivo permanece exatamente igual ...

    validateState(state) {
        const stateData = this.states.get(state);
        if (!stateData || Date.now() > stateData.expiresAt) {
            if (stateData) this.states.delete(state);
            return false;
        }
        this.states.delete(state);
        return true;
    }

    async exchangeCodeForTokens(code) {
        try {
            const credentials = `${this.clientId}:${this.clientSecret}`;
            const authHeader = `Basic ${Buffer.from(credentials).toString('base64')}`;
            
            const requestBody = {
                grant_type: 'authorization_code',
                redirect_uri: this.redirectUri,
                code: code
            };

            const response = await axios.post('https://bling.com.br/Api/v3/oauth/token', 
                requestBody,
                {
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Accept': 'application/json',
                        'Authorization': authHeader
                    }
                }
            );

            const { access_token, refresh_token, expires_in } = response.data;
            this.tokens = {
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: Date.now() + (expires_in * 1000)
            };
            console.log('✨ Tokens obtidos com sucesso! Autenticação concluída.');
            return this.tokens;
        } catch (error) {
            console.error('❌ Erro ao trocar código por tokens:', error.response?.data || error.message);
            throw new Error('Falha na autenticação com o Bling');
        }
    }

    async refreshAccessToken() {
        if (!this.tokens.refreshToken) {
            throw new Error('Refresh token não disponível');
        }
        try {
            const credentials = `${this.clientId}:${this.clientSecret}`;
            const authHeader = `Basic ${Buffer.from(credentials).toString('base64')}`;

            const response = await axios.post('https://bling.com.br/Api/v3/oauth/token', {
                grant_type: 'refresh_token',
                refresh_token: this.tokens.refreshToken
            }, {
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': authHeader
                }
            });

            const { access_token, refresh_token, expires_in } = response.data;
            this.tokens = {
                accessToken: access_token,
                refreshToken: refresh_token || this.tokens.refreshToken,
                expiresAt: Date.now() + (expires_in * 1000)
            };
            console.log('Token renovado com sucesso');
            return this.tokens;
        } catch (error) {
            console.error('Erro ao renovar token:', error.response?.data || error.message);
            this.clearTokens();
            throw new Error('Falha ao renovar token do Bling');
        }
    }

    isTokenValid() {
        return this.tokens.accessToken && this.tokens.expiresAt && Date.now() < (this.tokens.expiresAt - 60000);
    }

    async getValidToken() {
        if (this.isTokenValid()) {
            return this.tokens.accessToken;
        }
        if (this.tokens.refreshToken) {
            await this.refreshAccessToken();
            return this.tokens.accessToken;
        }
        throw new Error('Token não disponível. É necessário fazer login novamente.');
    }

    requireAuth() {
        return async (req, res, next) => {
            try {
                const token = await this.getValidToken();
                req.blingToken = token;
                next();
            } catch (error) {
                res.status(401).json({
                    error: 'Não autenticado no Bling',
                    message: error.message,
                    needsAuth: true
                });
            }
        };
    }

    clearTokens() {
        this.tokens = { accessToken: null, refreshToken: null, expiresAt: null };
    }

    isAuthenticated() {
        return !!this.tokens.accessToken;
    }

    getTokenInfo() {
        return {
            isAuthenticated: this.isAuthenticated(),
            isValid: this.isTokenValid(),
            expiresAt: this.tokens.expiresAt,
            hasRefreshToken: !!this.tokens.refreshToken
        };
    }
}

export default BlingAuth;