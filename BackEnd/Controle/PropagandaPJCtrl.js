import PropagandaPJ from '../Modelo/propagandaPJ.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de extensões de arquivos proibidos
const bannedMimeTypes = [
    ".exe",  // executáveis
    ".dll",  // bibliotecas dinâmicas
    ".bat",  // arquivos de lote
    ".cmd",  // arquivos de comando
    ".sh",   // scripts shell
    ".cgi",  // scripts CGI
    ".jar",  // arquivos Java
    ".app"   // aplicativos macOS
];

function parseData(data) {
    if (!data) return null;
    const [dia, mes, ano] = data.split('/');
    return new Date(`${ano}-${mes}-${dia}`);
}

function gerarNomePasta(cnpj, dataEmissao) {
    if (!dataEmissao) {
        throw new Error("Data de emissão inválida.");
    }

    let dia, mes, ano;

    // Verifica se está no formato dd/mm/yyyy
    if (dataEmissao.includes('/')) {
        const partes = dataEmissao.split('/');
        if (partes.length !== 3) {
            throw new Error("Data de emissão deve estar no formato dd/mm/yyyy.");
        }
        [dia, mes, ano] = partes;
    }
    // Verifica se está no formato yyyy-mm-dd
    else if (dataEmissao.includes('-')) {
        const partes = dataEmissao.split('-');
        if (partes.length !== 3) {
            throw new Error("Data de emissão deve estar no formato yyyy-mm-dd.");
        }
        [ano, mes, dia] = partes;
    } else {
        throw new Error("Formato de data inválido.");
    }

    return `${cnpj}-${dia}-${mes}-${ano}`;
}

export default class PropagandaPJCtrl {
   async gravar(requisicao, resposta) {
           resposta.type("application/json");
       
           if (requisicao.method === "POST") {
               const dados = requisicao.body;
               const {
                   cliente_cnpj, nome, canal, valor, data_emissao, data_encerramento, duracao,
                   representante1_nome, representante1_contato, representante2_nome, representante2_contato
               } = dados;
       
               const contratoDigitalFile = requisicao.files?.contrato_digital;
               const arquivosAdicionaisFile = requisicao.files?.arquivos_adicionais;
       
               try {
                   // Validação inicial
                   if (!cliente_cnpj || cliente_cnpj.length !== 14) {
                       throw new Error("O CNPJ deve conter 14 dígitos.");
                   }
       
                   if (!data_emissao) {
                       throw new Error("A data de emissão é inválida ou não foi fornecida.");
                   }
       
                   // **Normalizar data_emissao para string**
                   let dataEmissaoString = data_emissao;
       
                   if (typeof data_emissao !== 'string') {
                       // Se for Date, ISO ou outro formato, converte para "dd/mm/yyyy"
                       dataEmissaoString = new Date(data_emissao).toLocaleDateString('pt-BR');
                   }
       
                   // Geração do nome da pasta
                   const nomePasta = gerarNomePasta(cliente_cnpj, dataEmissaoString);
       
                   const baseDir = path.join(__dirname, '..', 'Files');
                   const clienteDir = path.join(baseDir, nomePasta);
       
                   fs.mkdirSync(clienteDir, { recursive: true });
       
                   const timestamp = Date.now();
       
                   let contratoDigitalName = null;
                   if (contratoDigitalFile) {
                       const fileExtension = path.extname(contratoDigitalFile.name).toLowerCase();
                       if (bannedMimeTypes.includes(fileExtension)) {
                           throw new Error(`O formato de arquivo '${fileExtension}' não é permitido.`);
                       }
       
                       contratoDigitalName = `${timestamp}_contrato_${contratoDigitalFile.name}`;
                       const contratoDigitalPath = path.join(clienteDir, contratoDigitalName);
                       await contratoDigitalFile.mv(contratoDigitalPath);
                   }
       
                   let arquivosAdicionaisName = null;
                   if (arquivosAdicionaisFile) {
                       const fileExtension = path.extname(arquivosAdicionaisFile.name).toLowerCase();
                       if (bannedMimeTypes.includes(fileExtension)) {
                           throw new Error(`O formato de arquivo '${fileExtension}' não é permitido.`);
                       }
       
                       arquivosAdicionaisName = `${timestamp}_arquivo_${arquivosAdicionaisFile.name}`;
                       const arquivosAdicionaisPath = path.join(clienteDir, arquivosAdicionaisName);
                       await arquivosAdicionaisFile.mv(arquivosAdicionaisPath);
                   }
       
                   const dataEmissaoConvertida = parseData(dataEmissaoString);
                   const dataEncerramentoConvertida = data_encerramento ? parseData(data_encerramento) : null;
       
                   if (isNaN(dataEmissaoConvertida)) throw new Error("A data de emissão é inválida.");
                   if (dataEncerramentoConvertida && isNaN(dataEncerramentoConvertida)) {
                       throw new Error("A data de encerramento é inválida.");
                   }
       
                   const propaganda = new PropagandaPJ(
                       null,
                       cliente_cnpj,
                       null,
                       nome,
                       canal,
                       valor,
                       dataEmissaoConvertida.toISOString(),
                       dataEncerramentoConvertida ? dataEncerramentoConvertida.toISOString() : null,
                       duracao,
                       representante1_nome,
                       representante1_contato,
                       representante2_nome,
                       representante2_contato,
                       contratoDigitalName,
                       arquivosAdicionaisName
                   );
       
                   await propaganda.gravar();
       
                   resposta.status(200).json({
                       status: true,
                       mensagem: "Propaganda PJ gravada com sucesso!",
                       contratoDigitalName,
                       arquivosAdicionaisName
                   });
               } catch (erro) {
                   console.error("Erro ao gravar propaganda PJ:", erro.message);
                   resposta.status(500).json({ status: false, mensagem: erro.message });
               }
           } else {
               resposta.status(400).json({
                   status: false,
                   mensagem: "Método inválido."
               });
           }
       }

     async downloadArquivo(req, res) {
            const { cnpj, filename } = req.params;
     
            const baseDir = path.join(__dirname, '..', 'Files');
     
            // Buscar todos os diretórios que começam com o CNPJ
            const diretorios = fs.readdirSync(baseDir).filter(dir => dir.startsWith(cnpj));
     
            if (diretorios.length === 0) {
                return res.status(404).json({ status: false, mensagem: "Pasta do cliente não encontrada." });
            }
     
            // Tentar localizar o arquivo em cada diretório correspondente ao CNPJ
            for (const dir of diretorios) {
                const filePath = path.join(baseDir, dir, filename);
                if (fs.existsSync(filePath)) {
                    return res.download(filePath, filename, (err) => {
                        if (err) {
                            console.error("Erro ao fazer o download do arquivo:", err);
                            res.status(500).json({ status: false, mensagem: "Erro ao baixar o arquivo." });
                        }
                    });
                }
            }
     
            return res.status(404).json({ status: false, mensagem: "Arquivo não encontrado." });
        }

    async atualizar(requisicao, resposta) {
        resposta.type("application/json");
    
        if (requisicao.method === "PUT") {
            const dados = requisicao.body;
            const {
                id, clientePJ_cnpj, nome, canal, valor, data_emissao, data_encerramento, duracao, representante1_nome, representante1_contato, representante2_nome, representante2_contato
            } = dados;
    
            if (!id && clientePJ_cnpj && nome && canal && valor && data_emissao) {
                return resposta.status(400).json({
                    status: false,
                    mensagem: "Informe adequadamente todos os dados obrigatórios."
                });
            }
    
            try {
                const propaganda = new PropagandaPJ(
                    id, clientePJ_cnpj, null, nome, canal, valor, data_emissao,
                    data_encerramento, duracao, representante1_nome, representante1_contato, representante2_nome, representante2_contato
                );
                await propaganda.atualizar(); 
                resposta.status(200).json({
                    status: true,
                    mensagem: "Propaganda PJ atualizada com sucesso!"
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
                mensagem: "Método ou formato inválido."
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "DELETE") {
            const { id } = requisicao.params;

            if (id) {
                try {
                    const propaganda = new PropagandaPJ(id);
                    await propaganda.excluir();
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Propaganda PJ excluída com sucesso!"
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
                    mensagem: "ID não fornecido!"
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Método inválido."
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "GET") {
            const termo = requisicao.query.termo || "";

            try {
                const propaganda = new PropagandaPJ();
                const listaPropagandas = await propaganda.consultar(termo);
                resposta.status(200).json({
                    status: true,
                    listaPropagandas: listaPropagandas
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
                mensagem: "Método inválido. Utilize GET para consultar propagandas."
            });
        }
    }

    async consultarPorId(requisicao, resposta) {
        resposta.type("application/json");

        const { id } = requisicao.params;

        if (requisicao.method === "GET" && id) {
            try {
                const propaganda = new PropagandaPJ();
                const propagandaDetalhada = await propaganda.consultarPorId(id);
                if (propagandaDetalhada) {
                    resposta.status(200).json({
                        status: true,
                        propaganda: propagandaDetalhada
                    });
                } else {
                    resposta.status(404).json({
                        status: false,
                        mensagem: "Propaganda PJ não encontrada."
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
                mensagem: "ID ou método inválido!"
            });
        }
    }

    async atualizarArquivosAdicionais(req, res) {
        res.type("application/json");
    
        try {
            const { id } = req.params;
            const novosArquivos = req.files?.['novos_arquivos[]'];
    
            if (!id) {
                return res.status(400).json({
                    status: false,
                    mensagem: "ID é obrigatório."
                });
            }
    
            if (!novosArquivos) {
                return res.status(400).json({
                    status: false,
                    mensagem: "Nenhum arquivo foi enviado."
                });
            }
    
            // Obter a propaganda existente com base no ID
            const propaganda = new PropagandaPJ();
            const propagandaExistente = await propaganda.consultarPorId(id);
    
            if (!propagandaExistente) {
                return res.status(404).json({
                    status: false,
                    mensagem: "Propaganda não encontrada."
                });
            }

            // Converter a data de emissão para o formato correto (dd/mm/yyyy)
            const dataEmissao = new Date(propagandaExistente.data_emissao);
            const dataEmissaoFormatada = dataEmissao.toLocaleDateString('pt-BR'); // Isso vai gerar dd/mm/yyyy

            // Diretório base dos arquivos
            const baseDir = path.join(__dirname, '..', 'Files');
    
            // Gerar o nome da pasta correto com base no CNPJ e na data de emissão
            const nomePastaEsperada = gerarNomePasta(propagandaExistente.clientePJ_cnpj, dataEmissaoFormatada);
    
            // Buscar a pasta correta no diretório base
            const pastasExistentes = fs.readdirSync(baseDir).filter((dir) =>
                dir.startsWith(propagandaExistente.clientePJ_cnpj)
            );
    
            // Procurar pela pasta que corresponde ao padrão esperado
            let clienteDir = pastasExistentes.find((pasta) => pasta === nomePastaEsperada);
    
            if (clienteDir) {
                // Se a pasta for encontrada, monta o caminho completo
                clienteDir = path.join(baseDir, clienteDir);
            } else {
                // Se a pasta não for encontrada, cria a pasta com o nome esperado
                clienteDir = path.join(baseDir, nomePastaEsperada);
                fs.mkdirSync(clienteDir, { recursive: true });
            }
    
            let novosNomesArquivos = [];
    
            // Processamento de Arquivos Adicionais
            const arquivos = Array.isArray(novosArquivos) ? novosArquivos : [novosArquivos];
            for (const arquivo of arquivos) {
                const ext = path.extname(arquivo.name).toLowerCase();
                if (bannedMimeTypes.includes(ext)) {
                    throw new Error(`O formato de arquivo '${ext}' não é permitido.`);
                }
    
                const novoArquivoNome = `${Date.now()}_${arquivo.name}`;
                const arquivoPath = path.join(clienteDir, novoArquivoNome);
                await arquivo.mv(arquivoPath);
                novosNomesArquivos.push(novoArquivoNome);
            }
    
            // Atualizar os nomes dos arquivos no banco de dados
            const novosArquivosConcat = novosNomesArquivos.join(",");
            await propagandaExistente.alterarArquivosAdicionais(id, novosArquivosConcat);
    
            res.status(200).json({
                status: true,
                mensagem: "Arquivos adicionados com sucesso!",
                novos_arquivos: novosNomesArquivos
            });
        } catch (erro) {
            console.error("Erro ao adicionar arquivos adicionais:", erro.message);
            res.status(500).json({
                status: false,
                mensagem: erro.message
            });
        }
    }
}
