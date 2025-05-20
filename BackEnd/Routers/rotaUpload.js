import express from "express";
import multer from "multer";
import path from "path";
import OrdemServicoDAO from "../Service/OrdemServicoDAO.js"; // Alterado para import ES Module

const router = express.Router();
const osDAO = new OrdemServicoDAO();

// Configuração do Multer para armazenamento de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/home/ubuntu/project_Alsten/uploads/"); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")); 
    }
});

const upload = multer({ storage: storage });

router.post("/", upload.single("arquivo"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const filePath = req.file.path;
    const osId = req.body.osId; 

    if (osId) {
        try {
            await osDAO.adicionarArquivoOS(osId, filePath);
            res.status(200).json({
                message: "Arquivo enviado e associado à OS com sucesso!",
                filePath: filePath,
                osId: osId
            });
        } catch (error) {
            console.error("Erro ao associar arquivo à OS:", error);
            res.status(500).json({
                error: "Arquivo enviado, mas falha ao associar à OS.",
                filePath: filePath,
                details: error.message
            });
        }
    } else {
        res.status(200).json({
            message: "Arquivo enviado com sucesso! A associação com OS pode ser feita posteriormente.",
            filePath: filePath
        });
    }
});

export default router;

