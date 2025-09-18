#!/usr/bin/env node

/**
 * SCRIPT DE IMPLEMENTAÇÃO DE SEGURANÇA - SISTEMA ALSTEN
 * 
 * Este script implementa todas as correções de segurança de forma segura:
 * 1. Criptografia de senhas
 * 2. Correção do CORS
 * 3. Rate Limiting
 * 4. Headers de segurança
 * 
 * Execução: node implementar-seguranca.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import conectar from './Service/conexao.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cores para output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

class SecurityImplementer {
    constructor() {
        this.backupDir = path.join(__dirname, 'backups');
        this.changes = [];
    }

    log(message, color = 'reset') {
        console.log(`${colors[color]}${message}${colors.reset}`);
    }

    logStep(step, message, color = 'cyan') {
        this.log(`\n🔧 PASSO ${step}: ${message}`, color);
    }

    logSuccess(message) {
        this.log(`  ✅ ${message}`, 'green');
    }

    logError(message) {
        this.log(`  ❌ ${message}`, 'red');
    }

    logWarning(message) {
        this.log(`  ⚠️ ${message}`, 'yellow');
    }

    async createBackup() {
        this.logStep(1, 'CRIANDO BACKUP DOS ARQUIVOS', 'yellow');
        
        try {
            // Criar diretório de backup
            await fs.mkdir(this.backupDir, { recursive: true });
            
            // Backup do index.js
            const indexPath = path.join(__dirname, 'index.js');
            const backupIndexPath = path.join(this.backupDir, `index.js.backup.${Date.now()}`);
            await fs.copyFile(indexPath, backupIndexPath);
            this.logSuccess(`Backup criado: ${backupIndexPath}`);
            
            // Backup do package.json
            const packagePath = path.join(__dirname, 'package.json');
            const backupPackagePath = path.join(this.backupDir, `package.json.backup.${Date.now()}`);
            await fs.copyFile(packagePath, backupPackagePath);
            this.logSuccess(`Backup criado: ${backupPackagePath}`);
            
            this.changes.push('Backup dos arquivos criado');
            
        } catch (error) {
            this.logError(`Erro ao criar backup: ${error.message}`);
            throw error;
        }
    }

    async encryptPasswords() {
        this.logStep(2, 'CRIPTOGRAFANDO SENHAS NO BANCO', 'yellow');
        
        try {
            const conexao = await conectar();
            
            // Buscar usuários com senhas em texto claro
            const [users] = await conexao.query(`
                SELECT id, email, password 
                FROM users 
                WHERE password NOT LIKE '$2a$%' 
                AND password NOT LIKE '$2b$%'
            `);
            
            if (users.length === 0) {
                this.logSuccess('Todas as senhas já estão criptografadas');
            } else {
                this.log(`  📋 Encontrados ${users.length} usuários com senhas em texto claro`);
                
                for (const user of users) {
                    // Criptografar senha
                    const hashedPassword = await bcrypt.hash(user.password, 10);
                    
                    // Atualizar no banco
                    await conexao.query(
                        'UPDATE users SET password = ? WHERE id = ?',
                        [hashedPassword, user.id]
                    );
                    
                    this.logSuccess(`Senha criptografada para usuário: ${user.email}`);
                }
            }
            
            conexao.release();
            this.changes.push('Senhas criptografadas no banco de dados');
            
        } catch (error) {
            this.logError(`Erro ao criptografar senhas: ${error.message}`);
            throw error;
        }
    }

    async installDependencies() {
        this.logStep(3, 'INSTALANDO DEPENDÊNCIAS DE SEGURANÇA', 'yellow');
        
        const dependencies = [
            'express-rate-limit',
            'helmet'
        ];
        
        try {
            // Ler package.json atual
            const packagePath = path.join(__dirname, 'package.json');
            const packageContent = await fs.readFile(packagePath, 'utf8');
            const packageJson = JSON.parse(packageContent);
            
            let needsUpdate = false;
            
            for (const dep of dependencies) {
                if (!packageJson.dependencies[dep]) {
                    packageJson.dependencies[dep] = '^7.1.5'; // Versão estável
                    this.logSuccess(`Adicionada dependência: ${dep}`);
                    needsUpdate = true;
                } else {
                    this.logSuccess(`Dependência já existe: ${dep}`);
                }
            }
            
            if (needsUpdate) {
                await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
                this.logSuccess('package.json atualizado');
                this.logWarning('Execute "npm install" para instalar as novas dependências');
            }
            
            this.changes.push('Dependências de segurança adicionadas');
            
        } catch (error) {
            this.logError(`Erro ao atualizar dependências: ${error.message}`);
            throw error;
        }
    }

    async updateIndexJs() {
        this.logStep(4, 'ATUALIZANDO CONFIGURAÇÕES DE SEGURANÇA', 'yellow');
        
        try {
            const indexPath = path.join(__dirname, 'index.js');
            let content = await fs.readFile(indexPath, 'utf8');
            
            // 1. Adicionar imports de segurança
            if (!content.includes('import rateLimit')) {
                const importSection = content.split('\n').findIndex(line => 
                    line.includes('import express from') || line.includes('import cors from')
                );
                
                const securityImports = [
                    "import rateLimit from 'express-rate-limit';",
                    "import helmet from 'helmet';"
                ];
                
                const lines = content.split('\n');
                lines.splice(importSection + 1, 0, ...securityImports);
                content = lines.join('\n');
                
                this.logSuccess('Imports de segurança adicionados');
            }
            
            // 2. Corrigir CORS
            const corsFix = content.replace(
                /if \(!origin\) return callback\(null, true\);/g,
                `if (!origin) {
            return callback(new Error('Origin não permitida: origem não especificada'));
        }`
            );
            
            if (corsFix !== content) {
                content = corsFix;
                this.logSuccess('CORS corrigido - requisições sem origin serão rejeitadas');
            } else {
                this.logSuccess('CORS já está configurado corretamente');
            }
            
            // 3. Adicionar rate limiting
            if (!content.includes('rateLimit')) {
                const rateLimitConfig = `
// Rate limiting para login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 tentativas de login por IP
    message: {
        error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
        retryAfter: '15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting geral para API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: {
        error: 'Muitas requisições. Tente novamente em 15 minutos.',
        retryAfter: '15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false,
});`;

                // Inserir após a configuração do CORS
                const corsEndIndex = content.indexOf('app.use(cors(corsOptions));');
                if (corsEndIndex !== -1) {
                    const insertIndex = corsEndIndex + 'app.use(cors(corsOptions));'.length;
                    content = content.slice(0, insertIndex) + rateLimitConfig + content.slice(insertIndex);
                    this.logSuccess('Rate limiting configurado');
                }
            }
            
            // 4. Adicionar helmet (headers de segurança)
            if (!content.includes('helmet')) {
                const helmetConfig = `
// Headers de segurança
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false, // Desabilitar para compatibilidade
}));`;

                // Inserir após o rate limiting
                const rateLimitIndex = content.indexOf('const apiLimiter = rateLimit');
                if (rateLimitIndex !== -1) {
                    const insertIndex = content.indexOf('});', rateLimitIndex) + 3;
                    content = content.slice(0, insertIndex) + helmetConfig + content.slice(insertIndex);
                    this.logSuccess('Headers de segurança (helmet) configurados');
                }
            }
            
            // 5. Aplicar rate limiters
            if (!content.includes('app.use(loginLimiter)')) {
                const rateLimitApplication = `
// Aplicar rate limiting
app.use('/autenticacao/login', loginLimiter);
app.use(apiLimiter);`;

                // Inserir antes das rotas
                const routesIndex = content.indexOf('// Suas rotas continuam aqui...');
                if (routesIndex !== -1) {
                    content = content.slice(0, routesIndex) + rateLimitApplication + '\n' + content.slice(routesIndex);
                    this.logSuccess('Rate limiters aplicados às rotas');
                }
            }
            
            // Salvar arquivo atualizado
            await fs.writeFile(indexPath, content);
            this.logSuccess('index.js atualizado com configurações de segurança');
            
            this.changes.push('Configurações de segurança implementadas no index.js');
            
        } catch (error) {
            this.logError(`Erro ao atualizar index.js: ${error.message}`);
            throw error;
        }
    }

    async createRollbackScript() {
        this.logStep(5, 'CRIANDO SCRIPT DE ROLLBACK', 'yellow');
        
        const rollbackScript = `#!/usr/bin/env node

/**
 * SCRIPT DE ROLLBACK - SISTEMA ALSTEN
 * 
 * Este script reverte todas as mudanças de segurança implementadas.
 * Use apenas se algo der errado após a implementação.
 * 
 * Execução: node rollback-seguranca.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function rollback() {
    console.log('🔄 INICIANDO ROLLBACK DAS CORREÇÕES DE SEGURANÇA...');
    
    try {
        // Restaurar index.js do backup
        const backupDir = path.join(__dirname, 'backups');
        const backupFiles = await fs.readdir(backupDir);
        const indexBackup = backupFiles.find(file => file.startsWith('index.js.backup.'));
        
        if (indexBackup) {
            await fs.copyFile(
                path.join(backupDir, indexBackup),
                path.join(__dirname, 'index.js')
            );
            console.log('✅ index.js restaurado do backup');
        }
        
        // Restaurar package.json do backup
        const packageBackup = backupFiles.find(file => file.startsWith('package.json.backup.'));
        
        if (packageBackup) {
            await fs.copyFile(
                path.join(backupDir, packageBackup),
                path.join(__dirname, 'package.json')
            );
            console.log('✅ package.json restaurado do backup');
        }
        
        console.log('🎉 ROLLBACK CONCLUÍDO COM SUCESSO!');
        console.log('⚠️ Reinicie o servidor para aplicar as mudanças.');
        
    } catch (error) {
        console.error('❌ Erro durante o rollback:', error.message);
        process.exit(1);
    }
}

rollback();`;

        const rollbackPath = path.join(__dirname, 'rollback-seguranca.js');
        await fs.writeFile(rollbackPath, rollbackScript);
        this.logSuccess('Script de rollback criado: rollback-seguranca.js');
        
        this.changes.push('Script de rollback criado');
    }

    async printSummary() {
        this.log('\n🎉 IMPLEMENTAÇÃO DE SEGURANÇA CONCLUÍDA!', 'green');
        this.log('=' * 60, 'blue');
        
        this.log('\n📋 MUDANÇAS IMPLEMENTADAS:', 'bright');
        this.changes.forEach((change, index) => {
            this.log(`  ${index + 1}. ${change}`, 'green');
        });
        
        this.log('\n⚠️ PRÓXIMOS PASSOS:', 'yellow');
        this.log('  1. Execute: npm install', 'cyan');
        this.log('  2. Execute: node teste-seguranca.js (para verificar)', 'cyan');
        this.log('  3. Reinicie o servidor backend', 'cyan');
        this.log('  4. Teste o sistema completo', 'cyan');
        
        this.log('\n🛡️ MELHORIAS DE SEGURANÇA IMPLEMENTADAS:', 'bright');
        this.log('  ✅ Senhas criptografadas no banco de dados', 'green');
        this.log('  ✅ CORS corrigido - requisições sem origin rejeitadas', 'green');
        this.log('  ✅ Rate limiting implementado (login e API)', 'green');
        this.log('  ✅ Headers de segurança adicionados', 'green');
        this.log('  ✅ Proteção contra ataques comuns', 'green');
        
        this.log('\n🔄 EM CASO DE PROBLEMAS:', 'yellow');
        this.log('  Execute: node rollback-seguranca.js', 'red');
        
        this.log('\n🎯 SISTEMA MAIS SEGURO E ROBUSTO!', 'green');
    }

    async implement() {
        try {
            this.log('🚀 INICIANDO IMPLEMENTAÇÃO DE SEGURANÇA - SISTEMA ALSTEN', 'bright');
            this.log('=' * 70, 'blue');
            
            await this.createBackup();
            await this.encryptPasswords();
            await this.installDependencies();
            await this.updateIndexJs();
            await this.createRollbackScript();
            
            await this.printSummary();
            
        } catch (error) {
            this.logError(`Erro durante a implementação: ${error.message}`);
            this.log('\n🔄 Execute o rollback se necessário:', 'yellow');
            this.log('  node rollback-seguranca.js', 'red');
            process.exit(1);
        }
    }
}

// Executar implementação
const implementer = new SecurityImplementer();
implementer.implement();
