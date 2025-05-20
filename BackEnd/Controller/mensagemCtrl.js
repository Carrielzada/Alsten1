import Mensagem from "../Model/mensagem.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bannedMimeTypes = [
    ".exe", ".dll", ".bat", ".cmd", ".sh", ".cgi", ".jar", ".app",
];


// Função para gerar o nome da pasta principal
function gerarNomePastaPrincipal(userId, nomeUser) {
    return `${userId}-${nomeUser.replace(/\s+/g, "_")}`;
}

// Função para gerar o nome da subpasta (mês e ano)
function gerarNomeSubPasta(dataAtual) {
    const data = new Date(dataAtual);
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${mes}_${ano}`;
}

// Função para formatar data para o nome do arquivo no formato DDMMAAAA_HHMMSS
function formatarDataArquivo(dataHora) {
    const data = new Date(dataHora);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");
    const segundos = String(data.getSeconds()).padStart(2, "0");
    return `${dia}${mes}${ano}_${horas}${minutos}${segundos}`;
}

export default class MensagemCtrl {
    async gravar(requisicao, resposta) {
        resposta.type("application/json");

        try {
            const {
                user_id,
                referencia_id,
                tipo_referencia,
                nome_user,
                cliente_nome,
                mensagem,
                status,
            } = requisicao.body;

            const arquivoFile = requisicao.files?.arquivo;

            // Validar campos obrigatórios
            if (!user_id || !referencia_id || !tipo_referencia || !nome_user || !cliente_nome || !mensagem) {
                return resposta.status(400).json({
                    status: false,
                    mensagem: "Preencha todos os campos obrigatórios.",
                });
            }

            // Gerar a pasta principal
            const nomePastaPrincipal = gerarNomePastaPrincipal(user_id, nome_user);
            const baseDir = path.join(__dirname, "..", "DocsMessage", nomePastaPrincipal);

            if (!fs.existsSync(baseDir)) {
                fs.mkdirSync(baseDir, { recursive: true });
            }

            // Criar subpasta para mês e ano
            const subPasta = gerarNomeSubPasta(new Date());
            const subPastaDir = path.join(baseDir, subPasta);

            if (!fs.existsSync(subPastaDir)) {
                fs.mkdirSync(subPastaDir, { recursive: true });
            }

            // Gerar nome do arquivo usando a data no formato DDMMAAAA_HHMMSS
            const dataHora = new Date();
            const dataFormatada = formatarDataArquivo(dataHora);
            const arquivoNome = arquivoFile ? `${dataFormatada}-${user_id}-${arquivoFile.name}` : null;

            // Salvar o arquivo no caminho gerado, se houver
            if (arquivoFile) {
                const arquivoPath = path.join(subPastaDir, arquivoNome);
                arquivoFile.mv(arquivoPath, (err) => {
                    if (err) {
                        throw new Error("Erro ao salvar o arquivo.");
                    }
                });
            }

            // Criar a mensagem no banco de dados
            const novaMensagem = new Mensagem(
                null,
                user_id,
                referencia_id,
                tipo_referencia,
                nome_user,
                cliente_nome,
                mensagem,
                arquivoNome,
                status || "Enviada",
                dataHora
            );

            const resultado = await novaMensagem.gravar();

            // Atualizar o status para "Enviado"
            if (resultado) {
                await novaMensagem.atualizarStatus(resultado.id, "Enviado");
            }

            resposta.status(200).json({
                status: true,
                mensagem: "Mensagem gravada com sucesso!",
                arquivo: arquivoNome,
            });
        } catch (erro) {
            console.error("Erro ao gravar mensagem:", erro.message);
            resposta.status(500).json({
                status: false,
                mensagem: erro.message,
            });
        }
    }

    async downloadMensagem(req, res) {
        const { userId, userName, mesAno, arquivo } = req.params;
    
        const baseDir = path.join(__dirname, '..', 'DocsMessage');
        const userDir = `${userId}-${userName.replace(/\s+/g, "_")}`;
        const subDir = mesAno;
    
        const filePath = path.join(baseDir, userDir, subDir, arquivo);
    
        if (fs.existsSync(filePath)) {
            return res.download(filePath, arquivo, (err) => {
                if (err) {
                    console.error("Erro ao fazer o download do arquivo:", err);
                    res.status(500).json({ status: false, mensagem: "Erro ao baixar o arquivo." });
                }
            });
        } else {
            return res.status(404).json({ status: false, mensagem: "Arquivo não encontrado." });
        }
    }
    

    async atualizar(requisicao, resposta) {
        resposta.type("application/json");
    
        if (requisicao.method === "PUT" && requisicao.is("application/json")) {
            const { id, status } = requisicao.body;
    
            if (!id || !status) {
                return resposta.status(400).json({
                    status: false,
                    mensagem: "ID e status são obrigatórios.",
                });
            }
    
            try {
                const mensagem = new Mensagem();
                await mensagem.atualizarStatus(id, status);
                resposta.status(200).json({
                    status: true,
                    mensagem: "Status atualizado com sucesso.",
                });
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message,
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido ou dados inválidos.",
            });
        }
    }
    

    async excluir(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "DELETE") {
            const { id } = requisicao.params;

            if (id) {
                const mensagemParaExcluir = new Mensagem(id);
                try {
                    await mensagemParaExcluir.removerDoBancoDados();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Mensagem excluída com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        status: false,
                        mensagem: erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "ID da mensagem não fornecido! Consulte a documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método não permitido! Utilize DELETE para excluir uma mensagem."
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type("application/json");
    
        const termo = requisicao.query.termo || "";
        const status = requisicao.query.status; // Adiciona suporte ao filtro por status
    
        try {
            const mensagem = new Mensagem();
            let listaMensagem;
    
            if (status) {
                listaMensagem = await mensagem.consultarPorStatus(status); // Usa o filtro de status
            } else {
                listaMensagem = await mensagem.consultar(termo); // Usa o filtro por termo, se necessário
            }
    
            resposta.status(200).json({
                status: true,
                listaMensagem,
            });
        } catch (erro) {
            console.error("Erro na consulta:", erro);
            resposta.status(500).json({
                status: false,
                mensagem: erro.message,
            });
        }
    }
    
    

    async consultarPorId(requisicao, resposta) {
        resposta.type("application/json");

        const { id } = requisicao.params;

        if (requisicao.method === "GET" && id) {
            const mensagem = new Mensagem();
            try {
                const resultado = await mensagem.consultarPorId(id);
                if (resultado) {
                    resposta.status(200).json({
                        status: true,
                        mensagem: resultado
                    });
                } else {
                    resposta.status(404).json({
                        status: false,
                        mensagem: "Mensagem não encontrada!"
                    });
                }
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: erro.message
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "ID da mensagem não fornecido ou método inválido! Utilize GET para consultar por ID."
            });
        }
    }

    async atualizarStatus(requisicao, resposta) {
        resposta.type("application/json");
    
        const { id, status } = requisicao.body;
    
        if (!id || !status) {
            return resposta.status(400).json({
                status: false,
                mensagem: "ID e status são obrigatórios.",
            });
        }
    
        try {
            const mensagem = new Mensagem(id);
            await mensagem.atualizarStatus(status);
    
            resposta.status(200).json({
                status: true,
                mensagem: "Status atualizado com sucesso!",
            });
        } catch (erro) {
            resposta.status(500).json({
                status: false,
                mensagem: erro.message,
            });
        }
    }
    
    async consultarPorStatus(requisicao, resposta) {
        resposta.type("application/json");
        const { status } = requisicao.params;
    
        if (!status) {
            return resposta.status(400).json({
                status: false,
                mensagem: "O status é obrigatório.",
            });
        }
    
        try {
            const mensagem = new Mensagem();
            const listaMensagem = await mensagem.consultarPorStatus(status);
            
            resposta.status(200).json({
                status: true,
                listaMensagem,
            });
        } catch (erro) {
            console.error("Erro ao consultar por status:", erro);
            resposta.status(500).json({
                status: false,
                mensagem: erro.message,
            });
        }
    }
    
    
}
