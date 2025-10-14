import PDFService from '../Service/PDFService.js';
import OrdemServicoDAO from '../Service/OrdemServicoDAO.js';

class PDFController {
    constructor() {
        this.gerarOrcamentoPDF = this.gerarOrcamentoPDF.bind(this);
        this.salvarOrcamentoPDF = this.salvarOrcamentoPDF.bind(this);
        this.visualizarOrcamentoPDF = this.visualizarOrcamentoPDF.bind(this);
    }
    async gerarOrcamentoPDF(req, res) {
        try {
            const { id } = req.params;
            const { 
                incluirVendedor = true, 
                incluirTecnico = true,
                formato = 'download' // 'download' ou 'inline'
            } = req.query;

            // Buscar a ordem de serviço
            const osDAO = new OrdemServicoDAO();
            const ordemServico = await osDAO.consultarPorId(id);

            if (!ordemServico) {
                return res.status(404).json({
                    status: false,
                    mensagem: 'Ordem de Serviço não encontrada.'
                });
            }

            // Criar o serviço de PDF
            const pdfService = new PDFService();

            // Gerar o PDF
            const opcoes = {
                incluirVendedor: incluirVendedor === 'true',
                incluirTecnico: incluirTecnico === 'true'
            };

            const doc = await pdfService.gerarOrcamentoPDF(ordemServico, opcoes);
            
            // Configurar headers para PDF
            const fileName = `Orcamento_OS_${id}.pdf`;
            
            res.setHeader('Content-Type', 'application/pdf');
            
            if (formato === 'download') {
                res.setHeader('Content-Disposition', `attachment; filename=\"${fileName}\"`);
            } else {
                res.setHeader('Content-Disposition', `inline; filename=\"${fileName}\"`);
            }
            
            // Enviar o PDF
            doc.pipe(res);
            doc.end();

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            res.status(500).json({
                status: false,
                mensagem: 'Erro ao gerar PDF: ' + error.message
            });
        }
    }

    async salvarOrcamentoPDF(req, res) {
        try {
            const { id } = req.params;
            const { 
                incluirVendedor = true, 
                incluirTecnico = true
            } = req.body;

            // Buscar a ordem de serviço
            const osDAO = new OrdemServicoDAO();
            const ordemServico = await osDAO.consultarPorId(id);

            if (!ordemServico) {
                return res.status(404).json({
                    status: false,
                    mensagem: 'Ordem de Serviço não encontrada.'
                });
            }

            // Criar o serviço de PDF
            const pdfService = new PDFService();

            // Salvar o PDF
            const opcoes = {
                incluirVendedor,
                incluirTecnico
            };

            const resultado = await pdfService.salvarPDF(ordemServico, opcoes);

            res.status(200).json({
                status: true,
                mensagem: 'PDF gerado com sucesso!',
                fileName: resultado.fileName,
                downloadUrl: `/uploads/${resultado.fileName}`
            });

        } catch (error) {
            console.error('Erro ao salvar PDF:', error);
            res.status(500).json({
                status: false,
                mensagem: 'Erro ao salvar PDF: ' + error.message
            });
        }
    }

    // Método para visualizar PDF no navegador
    async visualizarOrcamentoPDF(req, res) {
        try {
            const { id } = req.params;
            const { incluirVendedor = true, incluirTecnico = true } = req.query;

            // Buscar a ordem de serviço
            const osDAO = new OrdemServicoDAO();
            const ordemServico = await osDAO.consultarPorId(id);

            if (!ordemServico) {
                return res.status(404).json({
                    status: false,
                    mensagem: 'Ordem de Serviço não encontrada.'
                });
            }

            // Criar o serviço de PDF
            const pdfService = new PDFService();

            // Gerar o PDF com opções
            const opcoes = {
                incluirVendedor: incluirVendedor === 'true' || incluirVendedor === true,
                incluirTecnico: incluirTecnico === 'true' || incluirTecnico === true
            };

            const doc = await pdfService.gerarOrcamentoPDF(ordemServico, opcoes);

            // Headers para visualização inline
            const fileName = `Orcamento_OS_${id}.pdf`;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=\"${fileName}\"`);

            // Stream do PDF
            doc.pipe(res);
            doc.end();
        } catch (error) {
            console.error('Erro ao visualizar PDF:', error);
            res.status(500).json({
                status: false,
                mensagem: 'Erro ao visualizar PDF: ' + error.message
            });
        }
    }
}

export default new PDFController();