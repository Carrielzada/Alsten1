/**
 * Script de diagnóstico para problemas de deploy
 * Testa imports e dependências que podem estar quebrando na VPS
 */

console.log('🔍 DIAGNÓSTICO BACKEND - Testando imports...');

try {
    // Testar imports básicos
    console.log('✅ Testing basic imports...');
    import('./index.js').then(() => {
        console.log('✅ index.js importado com sucesso');
    }).catch(err => {
        console.error('❌ ERRO no index.js:', err.message);
        console.error('Stack:', err.stack);
    });

    // Testar novo utilitário de paginação
    console.log('✅ Testing paginationHelper...');
    import('./Service/utils/paginationHelper.js').then(() => {
        console.log('✅ paginationHelper importado com sucesso');
    }).catch(err => {
        console.error('❌ ERRO no paginationHelper:', err.message);
        console.error('Stack:', err.stack);
    });

    // Testar OrdemServicoDAO atualizado
    console.log('✅ Testing OrdemServicoDAO...');
    import('./Service/OrdemServicoDAO.js').then(() => {
        console.log('✅ OrdemServicoDAO importado com sucesso');
    }).catch(err => {
        console.error('❌ ERRO no OrdemServicoDAO:', err.message);
        console.error('Stack:', err.stack);
    });

    // Testar UsersDAO atualizado
    console.log('✅ Testing UsersDAO...');
    import('./Service/UsersDAO.js').then(() => {
        console.log('✅ UsersDAO importado com sucesso');
    }).catch(err => {
        console.error('❌ ERRO no UsersDAO:', err.message);
        console.error('Stack:', err.stack);
    });

} catch (error) {
    console.error('❌ ERRO CRÍTICO:', error);
    process.exit(1);
}

console.log('🎯 Diagnóstico concluído. Verifique os logs acima.');