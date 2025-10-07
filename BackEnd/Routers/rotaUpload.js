import express from "express";
import multer from "multer";
import path from "path";
import OrdemServicoDAO from "../Service/OrdemServicoDAO.js"; // Alterado para import ES Module

const router = express.Router();
const osDAO = new OrdemServicoDAO();

// Lista de tipos de arquivo permitidos
const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// Filtro para validar tipos de arquivo
const fileFilter = (req, file, cb) => {
    console.log('Upload tentativa - MIME type:', file.mimetype, 'Filename:', file.originalname);
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}. Tipos permitidos: imagens, PDF, documentos Word/Excel e texto.`), false);
    }
};

// Configuração do Multer para armazenamento de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/home/ubuntu/project_Alsten/uploads/"); 
    },
    filename: function (req, file, cb) {
        // Gerar nome mais seguro com UUID
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, uniqueSuffix + '_' + sanitizedName); 
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Limite de 10MB
    },
    fileFilter: fileFilter
});

router.post("/", (req, res) => {
    upload.single("arquivo")(req, res, async (err) => {
        // Tratar erros do Multer
        if (err) {
            console.error('Erro no upload:', err);
            
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ 
                    success: false, 
                    error: "Arquivo muito grande. Tamanho máximo: 10MB" 
                });
            }
            
            if (err.message.includes('Tipo de arquivo não permitido')) {
                return res.status(400).json({ 
                    success: false, 
                    error: err.message 
                });
            }
            
            return res.status(500).json({ 
                success: false, 
                error: "Erro no upload do arquivo" 
            });
        }
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: "Nenhum arquivo enviado." 
            });
        }

    const filePath = req.file.path;
    const osId = req.body.osId; 

    if (osId) {
        try {
            await osDAO.adicionarArquivoOS(osId, filePath);
            res.status(200).json({
                success: true,
                message: "Arquivo enviado e associado à OS com sucesso!",
                data: {
                    filePath: filePath,
                    osId: osId,
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    size: req.file.size,
                    mimetype: req.file.mimetype
                }
            });
        } catch (error) {
            console.error("Erro ao associar arquivo à OS:", error);
            res.status(500).json({
                success: false,
                error: "Arquivo enviado, mas falha ao associar à OS.",
                data: {
                    filePath: filePath,
                    filename: req.file.filename
                },
                details: error.message
            });
        }
    } else {
        res.status(200).json({
            success: true,
            message: "Arquivo enviado com sucesso! A associação com OS pode ser feita posteriormente.",
            data: {
                filePath: filePath,
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    }
    });
});

export default router;

