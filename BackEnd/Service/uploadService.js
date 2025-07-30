import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// __dirname não é disponível em módulos ES6, então precisamos recriá-lo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define o diretório onde os arquivos serão armazenados
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

// Log para verificar o caminho de upload
console.log(`Salvando uploads em: ${uploadDir}`);

// Cria o diretório de uploads se ele não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Diretório de uploads criado: ${uploadDir}`);
} else {
    console.log(`Diretório de uploads já existe: ${uploadDir}`);
}

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define o diretório de destino dos arquivos
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Define o nome do arquivo, adicionando um timestamp para evitar colisões
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Cria o middleware de upload do multer
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10 MB por arquivo
    fileFilter: (req, file, cb) => {
        // Validação de tipos de arquivos permitidos
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|zip|rar/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não suportado.'));
        }
    }
});

export default upload;
