#!/usr/bin/env node

console.log('🧪 TESTANDO IMPORTS CORRIGIDOS...\n');

async function testarImports() {
    try {
        console.log('📥 Testando importação do modelo urgencia.js...');
        const { default: Urgencia } = await import('./Model/urgencia.js');
        console.log('✅ Importação de urgencia.js: OK');
        
        console.log('📥 Testando importação do DAO urgenciaDAO.js...');
        const { default: UrgenciaDAO } = await import('./Service/urgenciaDAO.js');
        console.log('✅ Importação de urgenciaDAO.js: OK');
        
        console.log('📥 Testando importação do controller urgenciaCtrl.js...');
        const { default: UrgenciaController } = await import('./Controller/urgenciaCtrl.js');
        console.log('✅ Importação de urgenciaCtrl.js: OK');
        
        console.log('📥 Testando importação da rota rotaUrgencia.js...');
        const { default: rotaUrgencia } = await import('./Routers/rotaUrgencia.js');
        console.log('✅ Importação de rotaUrgencia.js: OK');
        
        console.log('\n🎉 TODOS OS IMPORTS FUNCIONARAM CORRETAMENTE!');
        console.log('✅ O problema de case sensitivity foi resolvido!');
        
    } catch (error) {
        console.error('❌ Erro ao testar imports:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

testarImports();
