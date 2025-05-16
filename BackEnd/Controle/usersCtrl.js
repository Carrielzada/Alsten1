import bcrypt from 'bcryptjs';
import Users from '../Modelo/users.js';
import UsersDAO from '../Persistencia/UsersDAO.js';

export default class UsersCtrl {
    async gravar(req, res) {
        res.type("application/json");

        if (req.method === "POST" && req.is("application/json")) {
            const { nome, email, password, role_id,} = req.body;

            if (nome && email && password) { // Campos obrigatórios
                try {
                    // Gerar hash da senha
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // Criar instância do modelo Users
                    const user = new Users(null, nome, email, hashedPassword, role_id,);

                    // Salvar no banco de dados
                    await user.gravar();

                    res.status(201).json({
                        status: true,
                        mensagem: "Usuário registrado com sucesso!"
                    });
                } catch (erro) {
                    console.error("Erro ao registrar usuário:", erro);
                    res.status(500).json({
                        status: false,
                        mensagem: "Erro ao registrar usuário"
                    });
                }
            } else {
                res.status(400).json({
                    status: false,
                    mensagem: "Informe adequadamente todos os dados obrigatórios do usuário conforme documentação da API!"
                });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Método não permitido ou cliente no formato JSON não fornecido! Consulte a documentação da API."
            });
        }
    }



    async atualizar(req, res) {
        res.type("application/json");
    
        if (req.method === "PUT" && req.is("application/json")) {
            const { email, oldPassword, newPassword, confirmPassword } = req.body;
    
            if (!newPassword || newPassword !== confirmPassword) {
                return res.status(400).json({
                    status: false,
                    mensagem: "A nova senha e a confirmação não conferem."
                });
            }
    
            try {
                const userDAO = new UsersDAO();
                const user = await userDAO.consultarPorEmail(email);
    
                if (!user) {
                    return res.status(404).json({ status: false, mensagem: "Usuário não encontrado!" });
                }
    
                // Verificar se a senha atual está correta
                const match = await bcrypt.compare(oldPassword, user.password);
                if (!match) {
                    return res.status(401).json({ status: false, mensagem: "Senha atual incorreta!" });
                }
    
                // Gerar hash da nova senha
                const hashedPassword = await bcrypt.hash(newPassword, 10);
    
                // Atualizar no banco de dados
                user.password = hashedPassword;
                await user.atualizar();
    
                res.status(200).json({ status: true, mensagem: "Senha alterada com sucesso!" });
            } catch (erro) {
                console.error("Erro ao alterar senha:", erro);
                res.status(500).json({ status: false, mensagem: "Erro ao alterar senha." });
            }
        } else {
            res.status(400).json({
                status: false,
                mensagem: "Método não permitido ou cliente no formato JSON não fornecido! Consulte a documentação da API."
            });
        }
    }
    

    excluir(requisicao, resposta) {
        resposta.type("application/json");
    
        const id = requisicao.params.id;
        
        if (id) {
            const users = new Users(id);
            users.removerDoBancoDados(id).then(() => {
                resposta.status(200).json({
                    status: true,
                    mensagem: "Usuário excluído com sucesso!"
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message
                });
            });
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "ID não fornecido! Verifique a documentação da API."
            });
        }
    }
    
    

    consultar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "GET") {
            const termo = requisicao.query.termo || "";
            const users = new Users();
            users.consultar(termo).then((users) => {
                resposta.status(200).json({
                    status: true,
                    listaUsers: users
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message
                });
            });
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido! Consulte a documentação da API."
            });
        }
    }

    async consultarPorRole(req, res) {
        res.type("application/json");
    
        const { role_id } = req.query;
    
        if (!role_id) {
            return res.status(400).json({
                status: false,
                mensagem: "Parâmetro 'role_id' não fornecido!",
            });
        }
    
        try {
            const usersDAO = new UsersDAO();
            const listaUsers = await usersDAO.consultarPorRole(role_id);
    
            if (listaUsers.length === 0) {
                return res.status(404).json({
                    status: false,
                    mensagem: "Nenhum usuário encontrado com o role_id fornecido.",
                });
            }
    
            res.status(200).json({
                status: true,
                listaUsers, // Retorna a lista como "listaUsers"
            });
        } catch (erro) {
            console.error("Erro ao consultar usuários por role:", erro);
            res.status(500).json({
                status: false,
                mensagem: "Erro ao consultar usuários por role.",
            });
        }
    }
    
   async atualizarDadosUsuario(req, res) {
    res.type("application/json");

    const { id } = req.params; // ID do usuário
    const { nome, email, role_id } = req.body; // Dados para atualização

    if (!id) {
        return res.status(400).json({
            status: false,
            mensagem: "ID do usuário não fornecido."
        });
    }

    // Verificar se ao menos um campo para atualização foi fornecido
    if (!nome && !email && role_id === undefined) {
        return res.status(400).json({
            status: false,
            mensagem: "Nenhum dado fornecido para atualização."
        });
    }

    try {
        const usersDAO = new UsersDAO();
        await usersDAO.atualizarDadosUsuario(id, { nome, email, role_id });

        res.status(200).json({
            status: true,
            mensagem: "Dados do usuário atualizados com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao atualizar dados do usuário:", erro);
        res.status(500).json({
            status: false,
            mensagem: erro.message || "Erro ao atualizar dados do usuário."
        });
    }}}