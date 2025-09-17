import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

class PDFService {
    constructor() {
        this.company = {
            name: 'ALSTEN ELETRONICA INDUSTRIAL',
            fullName: 'ALSTEN ELETRONICA INDUSTRIAL COMERCIO E SERVICOS LTDA',
            cnpj: '31.345.171/0001-86',
            address: 'RUA JOÃO MAZULQUIM 80 - PORTAL VILLE AZALEIA | BOITUVA (SP)',
            phone: '(15) 9135-3855',
            emails: [
                'alessandro.castro@alsten.com.br',
                'alsten@nfe.omie.com.br', 
                'adm@alsten.com.br'
            ]
        };
    }

    async gerarOrcamentoPDF(ordemServico, opcoes = {}) {
        const {
            incluirVendedor = true,
            incluirTecnico = true,
            logoPath = null
        } = opcoes;

        const doc = new PDFDocument({
            size: 'A4',
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            }
        });

        // Configurar fonte padrão
        doc.font('Helvetica');

        // Cabeçalho da empresa
        this.adicionarCabecalho(doc, logoPath);

        // Informações da OS
        this.adicionarInfoOS(doc, ordemServico, incluirVendedor);

        // Informações do cliente
        this.adicionarInfoCliente(doc, ordemServico);

        // Informações do equipamento
        this.adicionarInfoEquipamento(doc, ordemServico);

        // Defeitos e serviços
        this.adicionarDefeitosServicos(doc, ordemServico);

        // Condições e valores
        this.adicionarCondicoesValores(doc, ordemServico);

        // Finalizar documento
        doc.end();

        return doc;
    }

    adicionarCabecalho(doc, logoPath) {
        const startY = 50;
        
        // Logo (se fornecido)
        if (logoPath && fs.existsSync(logoPath)) {
            try {
                doc.image(logoPath, 50, startY, { width: 80, height: 60 });
            } catch (error) {
                console.log('Erro ao carregar logo:', error.message);
            }
        }

        // Nome da empresa
        doc.fontSize(16)
           .fillColor('#2c3e50')
           .font('Helvetica-Bold')
           .text(this.company.name, 150, startY + 5);

        // Informações da empresa
        doc.fontSize(9)
           .fillColor('#34495e')
           .font('Helvetica')
           .text(this.company.fullName, 150, startY + 25)
           .text(this.company.cnpj, 150, startY + 38)
           .text(this.company.address, 150, startY + 51);

        // Contatos
        const contactY = startY + 64;
        doc.text(`Telefone: ${this.company.phone} | E-mail:`, 150, contactY);
        doc.fontSize(8)
           .text(this.company.emails.join(', '), 150, contactY + 12);

        // Linha separadora
        doc.strokeColor('#bdc3c7')
           .lineWidth(1)
           .moveTo(50, startY + 90)
           .lineTo(545, startY + 90)
           .stroke();

        return startY + 110;
    }

    adicionarInfoOS(doc, ordemServico, incluirVendedor) {
        const startY = 160;
        
        // Título da seção
        doc.fontSize(14)
           .fillColor('#2c3e50')
           .font('Helvetica-Bold')
           .text(`Ordem de serviço: Nº ${ordemServico.id}`, 50, startY);

        // Vendedor (se incluído)
        if (incluirVendedor && ordemServico.vendedor) {
            const vendedorNome = typeof ordemServico.vendedor === 'object' ? 
                ordemServico.vendedor.nome : ordemServico.vendedor;
            doc.text(`Vendedor: ${vendedorNome}`, 350, startY);
        }

        // Data de criação
        const dataCriacao = ordemServico.dataCriacao ? 
            new Date(ordemServico.dataCriacao).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }) : 
            new Date().toLocaleDateString('pt-BR');

        doc.fontSize(10)
           .fillColor('#7f8c8d')
           .font('Helvetica')
           .text(`Data de criação da OS: ${dataCriacao}`, 50, startY + 20);

        return startY + 50;
    }

    adicionarInfoCliente(doc, ordemServico) {
        const startY = 220;
        const cliente = ordemServico.cliente;

        if (!cliente) return startY + 20;

        // Título
        doc.fontSize(12)
           .fillColor('#2c3e50')
           .font('Helvetica-Bold')
           .text('Cliente:', 50, startY);

        // Nome do cliente
        const nomeCliente = typeof cliente === 'object' ? 
            (cliente.nome || cliente.numeroDocumento || cliente.id) : 
            cliente;
            
        doc.fontSize(11)
           .fillColor('#2c3e50')
           .font('Helvetica-Bold')
           .text(nomeCliente, 50, startY + 18);

        // Informações do cliente (se disponível)
        let currentY = startY + 35;
        
        if (typeof cliente === 'object') {
            doc.fontSize(10)
               .fillColor('#34495e')
               .font('Helvetica');

            // Endereço
            if (cliente.endereco) {
                doc.text(cliente.endereco, 50, currentY);
                currentY += 15;
            }

            // CNPJ/CPF
            if (cliente.numeroDocumento) {
                doc.text(`CPF/CNPJ: ${cliente.numeroDocumento}`, 50, currentY);
                currentY += 15;
            }

            // Email
            if (cliente.email) {
                doc.text(`E-mail: ${cliente.email}`, 50, currentY);
                currentY += 15;
            }

            // Telefone
            if (cliente.telefone || cliente.celular) {
                const tel = cliente.telefone ? `Tel: ${cliente.telefone}` : '';
                const cel = cliente.celular ? `Cel: ${cliente.celular}` : '';
                const telefones = [tel, cel].filter(t => t).join(' ');
                doc.text(telefones, 50, currentY);
                currentY += 15;
            }

            // Cidade
            if (cliente.cidade) {
                doc.text(`Cidade: ${cliente.cidade}`, 350, startY + 35);
            }

            // Bairro
            if (cliente.bairro) {
                doc.text(`Bairro: ${cliente.bairro}`, 350, startY + 50);
            }
        }

        return Math.max(currentY + 10, startY + 80);
    }

    adicionarInfoEquipamento(doc, ordemServico) {
        const startY = 320;

        // Modelo do equipamento
        if (ordemServico.modeloEquipamento) {
            const modelo = typeof ordemServico.modeloEquipamento === 'object' ?
                ordemServico.modeloEquipamento.modelo : ordemServico.modeloEquipamento;
            
            doc.fontSize(10)
               .fillColor('#2c3e50')
               .font('Helvetica-Bold')
               .text('Modelo do equipamento: ', 50, startY)
               .font('Helvetica')
               .text(modelo, 170, startY);
        }

        // Número de série
        if (ordemServico.numeroSerie) {
            doc.font('Helvetica-Bold')
               .text('Número de série: ', 50, startY + 18)
               .font('Helvetica')
               .text(ordemServico.numeroSerie, 140, startY + 18);
        }

        // Data de fabricação
        doc.font('Helvetica-Bold')
           .text('Data de fabricação: ', 50, startY + 36)
           .font('Helvetica')
           .text('Não informado', 150, startY + 36);

        // Nota fiscal
        if (ordemServico.notaFiscal) {
            doc.font('Helvetica-Bold')
               .text('Nota fiscal: ', 50, startY + 54)
               .font('Helvetica')
               .text(ordemServico.notaFiscal, 120, startY + 54);
        }

        return startY + 80;
    }

    adicionarDefeitosServicos(doc, ordemServico) {
        const startY = 420;

        // Defeito alegado
        if (ordemServico.defeitoAlegado) {
            doc.fontSize(10)
               .fillColor('#2c3e50')
               .font('Helvetica-Bold')
               .text('Defeito alegado e considerações: ', 50, startY);
            
            doc.font('Helvetica')
               .fillColor('#34495e')
               .text(ordemServico.defeitoAlegado, 50, startY + 15, {
                   width: 495,
                   align: 'justify'
               });
        }

        let currentY = startY + 60;

        // Defeito constatado
        if (ordemServico.defeitoConstatado) {
            doc.font('Helvetica-Bold')
               .fillColor('#2c3e50')
               .text('Defeito constatado: ', 50, currentY);
            
            doc.font('Helvetica')
               .fillColor('#34495e')
               .text(ordemServico.defeitoConstatado, 50, currentY + 15, {
                   width: 495,
                   align: 'justify'
               });
            
            currentY += 80;
        }

        // Observações
        if (ordemServico.informacoesConfidenciais) {
            doc.font('Helvetica-Bold')
               .fillColor('#2c3e50')
               .text('Observação:', 50, currentY);
            
            doc.font('Helvetica')
               .fillColor('#34495e')
               .text(ordemServico.informacoesConfidenciais, 50, currentY + 15, {
                   width: 495,
                   align: 'justify'
               });
            
            currentY += 60;
        }

        // Serviço a ser realizado
        if (ordemServico.servicoRealizar) {
            doc.font('Helvetica-Bold')
               .fillColor('#2c3e50')
               .text('Serviço a ser realizado: ', 50, currentY);
            
            doc.font('Helvetica')
               .fillColor('#34495e')
               .text(ordemServico.servicoRealizar, 50, currentY + 15, {
                   width: 495,
                   align: 'justify'
               });
            
            currentY += 80;
        }

        return currentY;
    }

    adicionarCondicoesValores(doc, ordemServico) {
        const startY = 650;

        // Prazo para reparo
        if (ordemServico.diasReparo) {
            doc.fontSize(10)
               .fillColor('#2c3e50')
               .font('Helvetica-Bold')
               .text('Prazo para reparo: ', 50, startY)
               .font('Helvetica')
               .text(`${ordemServico.diasReparo} dias`, 140, startY);
        }

        // Valor do reparo
        if (ordemServico.valor) {
            const valor = typeof ordemServico.valor === 'number' ?
                ordemServico.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }) : `R$ ${ordemServico.valor}`;

            doc.font('Helvetica-Bold')
               .text('Valor do reparo: ', 50, startY + 18)
               .font('Helvetica')
               .text(valor, 140, startY + 18);
        }

        // Condição de pagamento
        if (ordemServico.diasPagamento) {
            const condicao = typeof ordemServico.diasPagamento === 'object' ?
                ordemServico.diasPagamento.descricao : `Para ${ordemServico.diasPagamento} dias`;

            doc.font('Helvetica-Bold')
               .text('Condição de pagamento: ', 50, startY + 36)
               .font('Helvetica')
               .text(condicao, 170, startY + 36);
        }

        return startY + 60;
    }

    // Método para salvar PDF em arquivo
    async salvarPDF(ordemServico, opcoes = {}) {
        const doc = await this.gerarOrcamentoPDF(ordemServico, opcoes);
        const fileName = `orcamento_OS_${ordemServico.id}_${Date.now()}.pdf`;
        const filePath = path.join(process.cwd(), 'uploads', fileName);

        // Garantir que o diretório uploads existe
        const uploadDir = path.dirname(filePath);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        return new Promise((resolve, reject) => {
            stream.on('finish', () => {
                resolve({ fileName, filePath });
            });
            stream.on('error', reject);
        });
    }
}

export default PDFService;