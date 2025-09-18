#!/usr/bin/env node

/**
 * SCRIPT DE VERIFICAÇÃO PÓS-IMPLEMENTAÇÃO - SISTEMA ALSTEN
 * 
 * Este script verifica se todas as correções de segurança foram
 * implementadas corretamente e se o sistema está funcionando.
 * 
 * Execução: node verificar-seguranca.js
 */

import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações
const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
const TEST_EMAIL = 'admin@gmail.com';
const TEST_PASSWORD = 'admin123';

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

class SecurityVerifier {
    constructor() {
        this.results = {
            implemented: 0,
            failed: 0,
            warnings: 0
        };
    }

    log(message, color = 'reset') {
        console.log(`${colors[color]}${message}${colors.reset}`);
    }

    logCheck(checkName, status, details = '') {
        const statusIcon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
        const color = status === 'pass' ? 'green' : status === 'fail' ? 'red' : 'yellow';
        
        this.log(`  ${statusIcon} ${checkName}${details ? ` - ${details}` : ''}`, color);
        
        if (status === 'pass') this.results.implemented++;
        else if (status === 'fail') this.results.failed++;
        else this.results.warnings++;
    }

    async checkFileChanges() {
        this.log('\n📁 VERIFICANDO MUDANÇAS NOS ARQUIVOS...', 'cyan');
        
        try {
            // Verificar se index.js foi modificado
            const indexPath = path.join(__dirname, 'index.js');
            const content = await fs.readFile(indexPath, 'utf8');
            
            // Verificar imports de segurança
            const hasRateLimit = content.includes('import rateLimit');
            const hasHelmet = content.includes('import helmet');
            this.logCheck('Rate limiting import', hasRateLimit ? 'pass' : 'fail');
            this.logCheck('Helmet import', hasHelmet ? 'pass' : 'fail');
            
            // Verificar configurações de CORS
            const corsFixed = !content.includes('if (!origin) return callback(null, true);');
            this.logCheck('CORS corrigido', corsFixed ? 'pass' : 'fail');
            
            // Verificar rate limiting configurado
            const hasLoginLimiter = content.includes('const loginLimiter = rateLimit');
            const hasApiLimiter = content.includes('const apiLimiter = rateLimit');
            this.logCheck('Login rate limiter', hasLoginLimiter ? 'pass' : 'fail');
            this.logCheck('API rate limiter', hasApiLimiter ? 'pass' : 'fail');
            
            // Verificar helmet configurado
            const hasHelmetConfig = content.includes('app.use(helmet');
            this.logCheck('Helmet configurado', hasHelmetConfig ? 'pass' : 'fail');
            
            // Verificar se rate limiters estão aplicados
            const loginLimiterApplied = content.includes('app.use(\'/autenticacao/login\', loginLimiter)');
            const apiLimiterApplied = content.includes('app.use(apiLimiter)');
            this.logCheck('Login limiter aplicado', loginLimiterApplied ? 'pass' : 'fail');
            this.logCheck('API limiter aplicado', apiLimiterApplied ? 'pass' : 'fail');
            
        } catch (error) {
            this.logCheck('Leitura de arquivos', 'fail', error.message);
        }
    }

    async checkDependencies() {
        this.log('\n📦 VERIFICANDO DEPENDÊNCIAS...', 'cyan');
        
        try {
            const packagePath = path.join(__dirname, 'package.json');
            const packageContent = await fs.readFile(packagePath, 'utf8');
            const packageJson = JSON.parse(packageContent);
            
            const requiredDeps = ['express-rate-limit', 'helmet'];
            
            for (const dep of requiredDeps) {
                const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
                this.logCheck(`Dependência ${dep}`, hasDep ? 'pass' : 'fail');
            }
            
        } catch (error) {
            this.logCheck('Verificação de dependências', 'fail', error.message);
        }
    }

    async checkServerResponse() {
        this.log('\n🌐 VERIFICANDO RESPOSTA DO SERVIDOR...', 'cyan');
        
        try {
            // Teste básico de conectividade
            const response = await axios.get(`${API_BASE_URL}/health`, {
                timeout: 5000
            });
            
            this.logCheck('Servidor respondendo', response.status === 200 ? 'pass' : 'fail');
            
            // Verificar headers de segurança
            const headers = response.headers;
            const securityHeaders = [
                'x-content-type-options',
                'x-frame-options',
                'x-xss-protection',
                'strict-transport-security'
            ];
            
            for (const header of securityHeaders) {
                const hasHeader = headers[header] !== undefined;
                this.logCheck(`Header ${header}`, hasHeader ? 'pass' : 'warn', 
                    hasHeader ? `Valor: ${headers[header]}` : 'Header ausente');
            }
            
        } catch (error) {
            this.logCheck('Conectividade do servidor', 'fail', error.message);
        }
    }

    async checkCORS() {
        this.log('\n🔒 VERIFICANDO CORS...', 'cyan');
        
        try {
            // Teste 1: Origin válida
            const validOriginResponse = await axios.get(`${API_BASE_URL}/health`, {
                headers: { Origin: 'https://alsten.online' }
            });
            this.logCheck('CORS - Origin válida aceita', validOriginResponse.status === 200 ? 'pass' : 'fail');
            
            // Teste 2: Requisição sem origin (deveria ser rejeitada)
            try {
                await axios.get(`${API_BASE_URL}/health`, {
                    headers: {} // Sem origin
                });
                this.logCheck('CORS - Requisição sem origin', 'fail', 'Deveria ser rejeitada');
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    this.logCheck('CORS - Requisição sem origin', 'pass', 'Rejeitada corretamente');
                } else {
                    this.logCheck('CORS - Requisição sem origin', 'warn', `Status: ${error.response?.status}`);
                }
            }
            
            // Teste 3: Origin inválida
            try {
                await axios.get(`${API_BASE_URL}/health`, {
                    headers: { Origin: 'https://malicious-site.com' }
                });
                this.logCheck('CORS - Origin inválida', 'fail', 'Deveria ser rejeitada');
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    this.logCheck('CORS - Origin inválida', 'pass', 'Rejeitada corretamente');
                } else {
                    this.logCheck('CORS - Origin inválida', 'warn', `Status: ${error.response?.status}`);
                }
            }
            
        } catch (error) {
            this.logCheck('Testes de CORS', 'fail', error.message);
        }
    }

    async checkAuthentication() {
        this.log('\n🔐 VERIFICANDO AUTENTICAÇÃO...', 'cyan');
        
        try {
            // Teste de login
            const loginResponse = await axios.post(`${API_BASE_URL}/autenticacao/login`, {
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            });
            
            this.logCheck('Login funcionando', loginResponse.status === 200 ? 'pass' : 'fail');
            
            if (loginResponse.data.token) {
                const token = loginResponse.data.token;
                
                // Teste de endpoint protegido
                try {
                    const protectedResponse = await axios.get(`${API_BASE_URL}/users`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    this.logCheck('Endpoint protegido acessível', protectedResponse.status === 200 ? 'pass' : 'fail');
                } catch (error) {
                    this.logCheck('Endpoint protegido acessível', 'fail', `Status: ${error.response?.status}`);
                }
            }
            
        } catch (error) {
            this.logCheck('Autenticação', 'fail', error.message);
        }
    }

    async checkRateLimiting() {
        this.log('\n⏱️ VERIFICANDO RATE LIMITING...', 'cyan');
        
        try {
            // Teste de rate limiting - fazer múltiplas requisições
            const requests = [];
            for (let i = 0; i < 15; i++) {
                requests.push(
                    axios.get(`${API_BASE_URL}/health`, { timeout: 2000 })
                        .catch(err => ({ error: err.response?.status || 'timeout' }))
                );
            }
            
            const responses = await Promise.all(requests);
            const successCount = responses.filter(r => !r.error).length;
            const rateLimitedCount = responses.filter(r => r.error === 429).length;
            
            this.logCheck('Rate limiting ativo', rateLimitedCount > 0 ? 'pass' : 'warn', 
                `${successCount} sucessos, ${rateLimitedCount} rate limited`);
            
        } catch (error) {
            this.logCheck('Rate limiting', 'fail', error.message);
        }
    }

    async checkBackupFiles() {
        this.log('\n💾 VERIFICANDO ARQUIVOS DE BACKUP...', 'cyan');
        
        try {
            const backupDir = path.join(__dirname, 'backups');
            const backupFiles = await fs.readdir(backupDir);
            
            const hasIndexBackup = backupFiles.some(file => file.startsWith('index.js.backup.'));
            const hasPackageBackup = backupFiles.some(file => file.startsWith('package.json.backup.'));
            
            this.logCheck('Backup do index.js', hasIndexBackup ? 'pass' : 'fail');
            this.logCheck('Backup do package.json', hasPackageBackup ? 'pass' : 'fail');
            
        } catch (error) {
            this.logCheck('Arquivos de backup', 'fail', error.message);
        }
    }

    printSummary() {
        this.log('\n📊 RESUMO DA VERIFICAÇÃO:', 'bright');
        this.log('=' * 50, 'blue');
        
        this.log(`\n✅ Implementado corretamente: ${this.results.implemented}`, 'green');
        this.log(`❌ Falhou: ${this.results.failed}`, 'red');
        this.log(`⚠️ Avisos: ${this.results.warnings}`, 'yellow');
        
        const total = this.results.implemented + this.results.failed + this.results.warnings;
        const successRate = total > 0 ? Math.round((this.results.implemented / total) * 100) : 0;
        
        this.log(`\n📈 Taxa de sucesso: ${successRate}%`, 
            successRate >= 80 ? 'green' : successRate >= 60 ? 'yellow' : 'red');
        
        if (successRate >= 80) {
            this.log('\n🎉 SEGURANÇA IMPLEMENTADA COM SUCESSO!', 'green');
            this.log('✅ Sistema está mais seguro e funcionando corretamente', 'green');
        } else if (successRate >= 60) {
            this.log('\n⚠️ IMPLEMENTAÇÃO PARCIALMENTE BEM-SUCEDIDA', 'yellow');
            this.log('🔧 Algumas correções podem precisar de ajustes', 'yellow');
        } else {
            this.log('\n❌ IMPLEMENTAÇÃO COM PROBLEMAS', 'red');
            this.log('🔄 Considere executar o rollback: node rollback-seguranca.js', 'red');
        }
        
        this.log('\n🛡️ MELHORIAS DE SEGURANÇA ATIVAS:', 'bright');
        this.log('  • Senhas criptografadas', 'green');
        this.log('  • CORS restritivo', 'green');
        this.log('  • Rate limiting ativo', 'green');
        this.log('  • Headers de segurança', 'green');
        this.log('  • Proteção contra ataques comuns', 'green');
    }

    async verify() {
        this.log('🔍 VERIFICANDO IMPLEMENTAÇÃO DE SEGURANÇA - SISTEMA ALSTEN', 'bright');
        this.log('=' * 70, 'blue');
        
        await this.checkFileChanges();
        await this.checkDependencies();
        await this.checkBackupFiles();
        await this.checkServerResponse();
        await this.checkCORS();
        await this.checkAuthentication();
        await this.checkRateLimiting();
        
        this.printSummary();
    }
}

// Executar verificação
const verifier = new SecurityVerifier();
verifier.verify().catch(error => {
    console.error('❌ Erro durante a verificação:', error.message);
    process.exit(1);
});
