#!/usr/bin/env node

/**
 * SCRIPT DE TESTE DE SEGURANÇA - SISTEMA ALSTEN
 * 
 * Este script testa todas as funcionalidades críticas antes e depois
 * das correções de segurança para garantir que nada quebre.
 * 
 * Execução: node teste-seguranca.js
 */

import axios from 'axios';
import bcrypt from 'bcryptjs';
import conectar from './Service/conexao.js';

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

class SecurityTester {
    constructor() {
        this.results = {
            database: { passed: 0, failed: 0, tests: [] },
            authentication: { passed: 0, failed: 0, tests: [] },
            cors: { passed: 0, failed: 0, tests: [] },
            api: { passed: 0, failed: 0, tests: [] },
            security: { passed: 0, failed: 0, tests: [] }
        };
    }

    log(message, color = 'reset') {
        console.log(`${colors[color]}${message}${colors.reset}`);
    }

    logTest(testName, passed, details = '') {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        const color = passed ? 'green' : 'red';
        this.log(`  ${status} ${testName}${details ? ` - ${details}` : ''}`, color);
        
        // Adicionar ao resultado
        const category = this.getCategory(testName);
        this.results[category].tests.push({ name: testName, passed, details });
        if (passed) {
            this.results[category].passed++;
        } else {
            this.results[category].failed++;
        }
    }

    getCategory(testName) {
        if (testName.includes('Database') || testName.includes('Senha')) return 'database';
        if (testName.includes('Login') || testName.includes('Token')) return 'authentication';
        if (testName.includes('CORS') || testName.includes('Origin')) return 'cors';
        if (testName.includes('API') || testName.includes('Endpoint')) return 'api';
        return 'security';
    }

    async testDatabase() {
        this.log('\n🔍 TESTANDO BANCO DE DADOS...', 'cyan');
        
        try {
            const conexao = await conectar();
            
            // Teste 1: Conexão com banco
            await conexao.query('SELECT 1');
            this.logTest('Database - Conexão', true);
            
            // Teste 2: Verificar se usuário admin existe
            const [users] = await conexao.query('SELECT * FROM users WHERE email = ?', [TEST_EMAIL]);
            this.logTest('Database - Usuário admin existe', users.length > 0);
            
            // Teste 3: Verificar se senha está criptografada
            if (users.length > 0) {
                const user = users[0];
                const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
                this.logTest('Database - Senha criptografada', isHashed, 
                    isHashed ? 'Hash bcrypt detectado' : 'Senha em texto claro');
                
                // Teste 4: Verificar se senha funciona
                const passwordMatch = await bcrypt.compare(TEST_PASSWORD, user.password);
                this.logTest('Database - Validação de senha', passwordMatch);
            }
            
            conexao.release();
            
        } catch (error) {
            this.logTest('Database - Conexão', false, error.message);
        }
    }

    async testAuthentication() {
        this.log('\n🔐 TESTANDO AUTENTICAÇÃO...', 'cyan');
        
        try {
            // Teste 1: Login com credenciais corretas
            const loginResponse = await axios.post(`${API_BASE_URL}/autenticacao/login`, {
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            });
            
            this.logTest('Authentication - Login válido', loginResponse.status === 200);
            
            if (loginResponse.data.token) {
                const token = loginResponse.data.token;
                
                // Teste 2: Verificar token JWT
                const tokenParts = token.split('.');
                this.logTest('Authentication - Token JWT válido', tokenParts.length === 3);
                
                // Teste 3: Acessar endpoint protegido
                try {
                    const protectedResponse = await axios.get(`${API_BASE_URL}/users`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    this.logTest('Authentication - Endpoint protegido', protectedResponse.status === 200);
                } catch (error) {
                    this.logTest('Authentication - Endpoint protegido', false, error.response?.status);
                }
            }
            
        } catch (error) {
            this.logTest('Authentication - Login válido', false, error.response?.status);
        }
        
        // Teste 4: Login com credenciais inválidas
        try {
            await axios.post(`${API_BASE_URL}/autenticacao/login`, {
                email: 'invalid@test.com',
                password: 'wrongpassword'
            });
            this.logTest('Authentication - Login inválido rejeitado', false, 'Deveria ter falhado');
        } catch (error) {
            this.logTest('Authentication - Login inválido rejeitado', error.response?.status === 401);
        }
    }

    async testCORS() {
        this.log('\n🌐 TESTANDO CORS...', 'cyan');
        
        // Teste 1: Requisição com origin válida
        try {
            const response = await axios.get(`${API_BASE_URL}/health`, {
                headers: { Origin: 'https://alsten.online' }
            });
            this.logTest('CORS - Origin válida aceita', response.status === 200);
        } catch (error) {
            this.logTest('CORS - Origin válida aceita', false, error.response?.status);
        }
        
        // Teste 2: Requisição sem origin (deveria ser rejeitada após correção)
        try {
            const response = await axios.get(`${API_BASE_URL}/health`, {
                headers: {} // Sem origin
            });
            this.logTest('CORS - Requisição sem origin', response.status === 200, 
                'Status atual: aceita (deveria ser rejeitada após correção)');
        } catch (error) {
            this.logTest('CORS - Requisição sem origin', false, 'Rejeitada (correto após correção)');
        }
        
        // Teste 3: Requisição com origin inválida
        try {
            const response = await axios.get(`${API_BASE_URL}/health`, {
                headers: { Origin: 'https://malicious-site.com' }
            });
            this.logTest('CORS - Origin inválida rejeitada', response.status !== 200);
        } catch (error) {
            this.logTest('CORS - Origin inválida rejeitada', true);
        }
    }

    async testAPIEndpoints() {
        this.log('\n📡 TESTANDO ENDPOINTS DA API...', 'cyan');
        
        const endpoints = [
            { path: '/health', method: 'GET', auth: false },
            { path: '/users', method: 'GET', auth: true },
            { path: '/modelo', method: 'GET', auth: true },
            { path: '/fabricante', method: 'GET', auth: true }
        ];
        
        for (const endpoint of endpoints) {
            try {
                const config = {
                    method: endpoint.method.toLowerCase(),
                    url: `${API_BASE_URL}${endpoint.path}`
                };
                
                if (endpoint.auth) {
                    // Tentar sem token primeiro
                    try {
                        await axios(config);
                        this.logTest(`API - ${endpoint.path} sem autenticação`, false, 'Deveria exigir token');
                    } catch (error) {
                        this.logTest(`API - ${endpoint.path} sem autenticação`, error.response?.status === 401);
                    }
                } else {
                    const response = await axios(config);
                    this.logTest(`API - ${endpoint.path}`, response.status === 200);
                }
                
            } catch (error) {
                this.logTest(`API - ${endpoint.path}`, false, error.response?.status);
            }
        }
    }

    async testSecurityHeaders() {
        this.log('\n🛡️ TESTANDO HEADERS DE SEGURANÇA...', 'cyan');
        
        try {
            const response = await axios.get(`${API_BASE_URL}/health`);
            const headers = response.headers;
            
            // Verificar headers de segurança
            const securityHeaders = {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Strict-Transport-Security': 'max-age=31536000'
            };
            
            for (const [header, expectedValue] of Object.entries(securityHeaders)) {
                const hasHeader = headers[header.toLowerCase()] !== undefined;
                this.logTest(`Security - Header ${header}`, hasHeader, 
                    hasHeader ? `Valor: ${headers[header.toLowerCase()]}` : 'Header ausente');
            }
            
        } catch (error) {
            this.logTest('Security - Headers de segurança', false, error.message);
        }
    }

    async testRateLimiting() {
        this.log('\n⏱️ TESTANDO RATE LIMITING...', 'cyan');
        
        // Teste: Fazer múltiplas requisições rapidamente
        const requests = [];
        for (let i = 0; i < 10; i++) {
            requests.push(axios.get(`${API_BASE_URL}/health`));
        }
        
        try {
            const responses = await Promise.all(requests);
            const successCount = responses.filter(r => r.status === 200).length;
            
            this.logTest('Rate Limiting - Múltiplas requisições', successCount === 10, 
                `${successCount}/10 requisições bem-sucedidas`);
                
        } catch (error) {
            this.logTest('Rate Limiting - Múltiplas requisições', false, error.message);
        }
    }

    printSummary() {
        this.log('\n📊 RESUMO DOS TESTES:', 'bright');
        this.log('=' * 50, 'blue');
        
        for (const [category, results] of Object.entries(this.results)) {
            const total = results.passed + results.failed;
            const percentage = total > 0 ? Math.round((results.passed / total) * 100) : 0;
            const color = percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red';
            
            this.log(`\n${category.toUpperCase()}:`, 'bright');
            this.log(`  ✅ Passou: ${results.passed}`, 'green');
            this.log(`  ❌ Falhou: ${results.failed}`, 'red');
            this.log(`  📈 Taxa de sucesso: ${percentage}%`, color);
        }
        
        const totalPassed = Object.values(this.results).reduce((sum, r) => sum + r.passed, 0);
        const totalFailed = Object.values(this.results).reduce((sum, r) => sum + r.failed, 0);
        const totalTests = totalPassed + totalFailed;
        const overallPercentage = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
        
        this.log('\n🎯 RESULTADO GERAL:', 'bright');
        this.log(`  ✅ Total de testes passou: ${totalPassed}`, 'green');
        this.log(`  ❌ Total de testes falhou: ${totalFailed}`, 'red');
        this.log(`  📊 Taxa geral de sucesso: ${overallPercentage}%`, 
            overallPercentage >= 80 ? 'green' : overallPercentage >= 60 ? 'yellow' : 'red');
        
        if (overallPercentage >= 80) {
            this.log('\n🎉 SISTEMA PRONTO PARA CORREÇÕES DE SEGURANÇA!', 'green');
        } else {
            this.log('\n⚠️ ATENÇÃO: Alguns testes falharam. Verifique antes de prosseguir.', 'yellow');
        }
    }

    async runAllTests() {
        this.log('🚀 INICIANDO TESTES DE SEGURANÇA - SISTEMA ALSTEN', 'bright');
        this.log('=' * 60, 'blue');
        
        await this.testDatabase();
        await this.testAuthentication();
        await this.testCORS();
        await this.testAPIEndpoints();
        await this.testSecurityHeaders();
        await this.testRateLimiting();
        
        this.printSummary();
    }
}

// Executar testes
const tester = new SecurityTester();
tester.runAllTests().catch(error => {
    console.error('❌ Erro durante os testes:', error.message);
    process.exit(1);
});
