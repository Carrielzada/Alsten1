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
            id_dados: user.id_dados,
            prop_publ: user.prop_publ,
        });
        
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ status: false, mensagem: "Erro no servidor" });
    }
}


export function verificarAutenticacao(req, resp, next){
    const token = req.headers['authorization'];
    
    let tokenVerificado = undefined;
    if (token){
        tokenVerificado = verificarAssinatura(token);

        if (tokenVerificado && tokenVerificado.email === req.session.usuario) {
            next();
        }        
        else{
            resp.status(401).json(
                {
                    status: false,
                    mensagem: 'Acesso não autorizado! Faça o login na aplicação!'
                });
        }
    }
    else{
        resp.status(401).json(
            {
                status: false,
                mensagem: 'Acesso não autorizado! Faça o login na aplicação!'
            });
    }

}


export function logout(req, res) {
    req.session.destroy(); // Destruir a sessão
    res.status(200).json({ status: true, mensagem: "Logout realizado com sucesso!" });
}

export function verificarRole(...requiredRoles) {
    return (req, res, next) => {
        const token = req.headers['authorization']; // Extraindo o token do cabeçalho
        if (!token) {
            return res.status(401).json({ mensagem: "Token não fornecido!" });
        }

        try {
            // Decodificar o token
            const decoded = jwt.verify(token, process.env.CHAVE_SECRETA);
            
            // Validar o papel do usuário
            if (!requiredRoles.includes(decoded.role)) {
                return res.status(403).json({ mensagem: "Acesso negado! Permissão insuficiente." });
            }

            // Adicionar o usuário decodificado à requisição
            req.user = decoded;

            // Passar para o próximo middleware
            next();
        } catch (error) {
            console.error("Erro na verificação do token:", error);
            return res.status(401).json({ mensagem: "Token inválido!" });
        }
    };
}



