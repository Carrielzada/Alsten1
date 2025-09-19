// BackEnd/Service/cacheService.js
// Sistema de cache em memória para dados de referência que são consultados frequentemente

class CacheService {
    constructor() {
        this.cache = new Map();
        this.ttl = new Map(); // Time to live para cada cache
        this.defaultTTL = 5 * 60 * 1000; // 5 minutos em ms
        
        // Limpeza automática de cache expirado a cada 2 minutos
        setInterval(() => {
            this.cleanExpiredCache();
        }, 2 * 60 * 1000);
    }

    /**
     * Define um valor no cache com TTL opcional
     * @param {string} key - Chave do cache
     * @param {any} value - Valor a ser armazenado
     * @param {number} ttlMs - Time to live em milliseconds (opcional)
     */
    set(key, value, ttlMs = null) {
        this.cache.set(key, value);
        this.ttl.set(key, Date.now() + (ttlMs || this.defaultTTL));
        
        console.log(`📦 Cache SET: ${key} (TTL: ${(ttlMs || this.defaultTTL) / 1000}s)`);
    }

    /**
     * Recupera um valor do cache se não expirado
     * @param {string} key - Chave do cache
     * @returns {any|null} - Valor armazenado ou null se não existe/expirado
     */
    get(key) {
        const expirationTime = this.ttl.get(key);
        
        if (!expirationTime || Date.now() > expirationTime) {
            // Cache expirado ou não existe
            this.delete(key);
            return null;
        }

        const value = this.cache.get(key);
        if (value) {
            console.log(`📦 Cache HIT: ${key}`);
        }
        
        return value;
    }

    /**
     * Remove uma chave específica do cache
     * @param {string} key - Chave a ser removida
     */
    delete(key) {
        this.cache.delete(key);
        this.ttl.delete(key);
        console.log(`🗑️ Cache DELETE: ${key}`);
    }

    /**
     * Limpa todo o cache
     */
    clear() {
        this.cache.clear();
        this.ttl.clear();
        console.log('🧹 Cache CLEAR: Todo cache limpo');
    }

    /**
     * Remove entradas expiradas do cache
     */
    cleanExpiredCache() {
        const now = Date.now();
        let cleanedCount = 0;

        for (const [key, expirationTime] of this.ttl.entries()) {
            if (now > expirationTime) {
                this.delete(key);
                cleanedCount++;
            }
        }

        if (cleanedCount > 0) {
            console.log(`🧹 Cache CLEANUP: ${cleanedCount} entradas expiradas removidas`);
        }
    }

    /**
     * Obtém estatísticas do cache
     * @returns {object} - Estatísticas do cache
     */
    getStats() {
        return {
            totalEntries: this.cache.size,
            totalTTLEntries: this.ttl.size,
            memoryUsage: this.getMemoryUsage()
        };
    }

    /**
     * Estima uso de memória do cache
     * @returns {string} - Uso estimado de memória
     */
    getMemoryUsage() {
        const entries = Array.from(this.cache.entries());
        const sizeInBytes = JSON.stringify(entries).length;
        return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    }

    /**
     * Helper para cache com função de busca automática
     * @param {string} key - Chave do cache
     * @param {Function} fetchFunction - Função para buscar dados se não estiver em cache
     * @param {number} ttlMs - TTL opcional
     * @returns {Promise<any>} - Dados do cache ou da função de busca
     */
    async getOrSet(key, fetchFunction, ttlMs = null) {
        let data = this.get(key);
        
        if (data === null) {
            console.log(`📦 Cache MISS: ${key} - Buscando dados...`);
            try {
                data = await fetchFunction();
                this.set(key, data, ttlMs);
            } catch (error) {
                console.error(`❌ Cache ERROR para ${key}:`, error.message);
                throw error;
            }
        }
        
        return data;
    }
}

// Instância singleton do cache
const cacheService = new CacheService();

export default cacheService;