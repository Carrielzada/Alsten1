import bcrypt from 'bcryptjs';
import conectar from './Persistencia/conexao.js';

(async () => {
    const conexao = await conectar();
    const usuarios = [
        { email: 'admin@gmail.com', senha: 'admin123' },
        { email: 'gerente@gmail.com', senha: 'gerente123' },
        { email: 'cliente1@gmail.com', senha: 'cliente123' },
        { email: 'usuario@gmail.com', senha: 'usuario123' },
    ];

    try {
        for (const usuario of usuarios) {
            const hashedPassword = await bcrypt.hash(usuario.senha, 10);
            await conexao.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, usuario.email]);
        }
        console.log('Senhas atualizadas com sucesso!');
    } catch (erro) {
        console.error('Erro ao atualizar senhas:', erro.message);
    } finally {
        conexao.release();
    }
})();
