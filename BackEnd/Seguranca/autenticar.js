import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import conectar from '../Persistencia/conexao.js';
import { assinar, verificarAssinatura } from './funcoesJWT.js';

export async function login(req, res) {
    const { email, password } = req.body;
    try {
        const conexao = await conectar(); // Obter conexão com o banco
        const [rows] = await conexao.query("SELECT * FROM users WHERE email = ?", [email]);
        conexao.release(); // Liberar a conexão

        if (rows.length === 0) {
            return res.status(401).json({ status: false, mensagem: "Usuário ou senha inválidos!" });
        }

        const user = rows[0];

        // Verificar se a senha corresponde
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ status: false, mensagem: "Usuário ou senha inválidos!" });
        }

        // Gerar token JWT
        const token = assinar({ id: user.id, email: user.email, role: user.role_id });

        // Atualizar a sessão com informações do usuário
        req.session.usuario = user.email;

        return res.status(200).json({
            status: true,
            mensagem: "Logado com sucesso!",
            token, // Enviar o token
            id: user.id,
            nome: user.nome, // Enviar o nome do usuário
            email: user.email, // Enviar o email do usuário
            role: user.role_id, // Enviar role com o nome correto
        });
        
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ status: false, mensagem: "Erro no servidor" });
    }
}

export function verificarAutenticacao(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            status: false,
            mensagem: "Token não fornecido! Faça o login na aplicação!",
        });
    }

    try {
        const tokenVerificado = verificarAssinatura(token);
        
        // Adiciona os dados do token à requisição
        req.user = tokenVerificado;

        next();
    } catch (e) {
        return res.status(401).json({
            status: false,
            mensagem: "Token inválido ou expirado! Faça o login novamente!",
        });
    }
}

//função de verificarAutenticação via browser, verificando também o email, será útil mais tarde

/*
export function verificarAutenticacao(req, resp, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extrai o token do formato "Bearer <token>"
    
    if (token == null) return resp.status(401).json(
        {
            status: false,
            mensagem: "Token não fornecido! Faça o login na aplicação!"
        }
    ); // se não há token, não autorizado

    let tokenVerificado = undefined;
    try {
        tokenVerificado = verificarAssinatura(token);
        if (tokenVerificado && tokenVerificado.email === req.session.usuario) { // Verifica se o email do token corresponde ao da sessão
            next();
        } else {
            resp.status(401).json(
                {
                    status: false,
                    mensagem: "Acesso não autorizado ou sessão inválida! Faça o login novamente!"
                });
        }
    } catch (e) {
        resp.status(401).json(
            {
                status: false,
                mensagem: "Token inválido ou expirado! Faça o login novamente!"
            });
    }
}
*/

export function logout(req, res) {
    req.session.destroy(); // Destruir a sessão
    res.status(200).json({ status: true, mensagem: "Logout realizado com sucesso!" });
}

export function verificarRole(...requiredRoles) {
    return (req, res, next) => {
        const usuario = req.user;

        if (!usuario) {
            return res.status(401).json({ mensagem: "Usuário não autenticado!" });
        }

        if (!requiredRoles.includes(usuario.role)) {
            return res.status(403).json({ mensagem: "Acesso negado! Permissão insuficiente." });
        }

        next();
    };
}



