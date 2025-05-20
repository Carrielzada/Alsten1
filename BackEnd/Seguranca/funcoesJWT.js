import jwt from 'jsonwebtoken';

export function assinar(usuario) {
    // Certifique-se de que o usuário contém role_id corretamente
    const token = jwt.sign(
        { id: usuario.id, email: usuario.email, role: usuario.role }, // Inclua o campo role aqui
        process.env.CHAVE_SECRETA,
        { expiresIn: '24h' }
    );
    return token;
}



export function verificarAssinatura(token){
    return jwt.verify(token, process.env.CHAVE_SECRETA);
}