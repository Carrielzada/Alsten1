// Script para desabilitar WebSocket em produção
(function() {
    'use strict';
    
    // Verificar se estamos em produção
    const isProduction = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1' && 
                        !window.location.hostname.includes('localhost');
    
    console.log('[WebSocket Blocker] Ambiente detectado:', {
        hostname: window.location.hostname,
        isProduction: isProduction,
        url: window.location.href
    });
    
    if (isProduction) {
        // Interceptar e desabilitar WebSocket
        const OriginalWebSocket = window.WebSocket;
        window.WebSocket = function(url) {
            // Bloquear conexões WebSocket para desenvolvimento (HMR)
            if (url && (
                url.includes('/ws') || 
                url.includes(':3000') ||
                url.includes('webpack') ||
                url.includes('sockjs-node') ||
                url.includes('hot-update')
            )) {
                console.log('[WebSocket] Conexão bloqueada em produção:', url);
                
                // Retornar um mock que não faz nada
                return {
                    readyState: 3, // CLOSED
                    close: function() {},
                    addEventListener: function() {},
                    removeEventListener: function() {},
                    send: function() {},
                    onopen: null,
                    onclose: null,
                    onerror: null,
                    onmessage: null
                };
            }
            
            // Permitir outras conexões WebSocket legítimas
            return new OriginalWebSocket(url);
        };
        
        // Preservar propriedades do WebSocket original
        Object.setPrototypeOf(window.WebSocket, OriginalWebSocket);
        window.WebSocket.prototype = OriginalWebSocket.prototype;
        
        // Desabilitar EventSource (usado pelo webpack dev server)
        if (window.EventSource) {
            const OriginalEventSource = window.EventSource;
            window.EventSource = function(url) {
                if (url && (url.includes('/webpack') || url.includes(':3000'))) {
                    console.log('[EventSource] Conexão bloqueada em produção:', url);
                    return {
                        close: function() {},
                        addEventListener: function() {},
                        removeEventListener: function() {},
                        readyState: 2 // CLOSED
                    };
                }
                return new OriginalEventSource(url);
            };
        }
        
        console.log('[WebSocket] Proteção ativada para produção');
    }
})();