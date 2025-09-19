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
        // SEGURANÇA: Gerar nome único com UUID + timestamp para evitar colisões e vazamentos
        const crypto = require('crypto');
        const uuid = crypto.randomUUID();
        const timestamp = Date.now();
        const ext = path.extname(file.originalname).toLowerCase();
        
        // Nome seguro: uuid-timestamp.ext (nunca usar nome original)
        const safeName = `${uuid}-${timestamp}${ext}`;
        
        console.log(`Arquivo renomeado: ${file.originalname} -> ${safeName}`);
        cb(null, safeName);
    }
});

// MIME types permitidos para validação rigorosa
const allowedMimeTypes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/zip': ['.zip'],
    'application/x-rar-compressed': ['.rar'],
    'application/vnd.rar': ['.rar']
};

// Lista de extensões perigosas bloqueadas
const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar', '.php', '.asp', '.jsp'];

// Cria o middleware de upload do multer com validações de segurança
const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 10 * 1024 * 1024, // 10MB por arquivo
        files: 5, // Máximo 5 arquivos por request
        fieldSize: 2 * 1024 * 1024 // 2MB para campos de texto
    },
    fileFilter: (req, file, cb) => {
        try {
            // Sanitizar nome do arquivo
            const originalName = file.originalname.toLowerCase().trim();
            const ext = path.extname(originalName);
            const mimeType = file.mimetype.toLowerCase();
            
            console.log(`Upload tentativa: ${originalName}, MIME: ${mimeType}, Ext: ${ext}`);
            
            // 1. Verificar extensões perigosas
            if (dangerousExtensions.includes(ext)) {
                return cb(new Error(`Extensão ${ext} não é permitida por razões de segurança`));
            }
            
            // 2. Verificar se o MIME type é permitido
            if (!allowedMimeTypes[mimeType]) {
                return cb(new Error(`Tipo de arquivo ${mimeType} não é suportado`));
            }
            
            // 3. Verificar se a extensão corresponde ao MIME type
            const allowedExts = allowedMimeTypes[mimeType];
            if (!allowedExts.includes(ext)) {
                return cb(new Error(`Extensão ${ext} não corresponde ao tipo de arquivo ${mimeType}`));
            }
            
            // 4. Verificar nome do arquivo para caracteres suspeitos
            const suspiciousChars = /[<>:"|?*\x00-\x1f]/;
            if (suspiciousChars.test(originalName)) {
                return cb(new Error('Nome do arquivo contém caracteres não permitidos'));
            }
            
            // 5. Verificar comprimento do nome
            if (originalName.length > 255) {
                return cb(new Error('Nome do arquivo muito longo'));
            }
            
            // 6. Verificar se não é arquivo oculto
            if (originalName.startsWith('.') && originalName !== '.htaccess') {
                return cb(new Error('Arquivos ocultos não são permitidos'));
            }
            
            cb(null, true);
            
        } catch (error) {
            console.error('Erro na validação de upload:', error);
            cb(new Error('Erro na validação do arquivo'));
        }
    }
});

export default upload;
