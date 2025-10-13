// Serviço de lock em memória para edição concorrente de OS
// Em produção, prefira Redis ou banco de dados!

const LOCK_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutos
const locks = new Map(); // chave: osId, valor: { userId, userNome, timestamp }

export function criarLock(osId, userId, userNome) {
    limparLocksExpirados();
    const lock = locks.get(osId);
    if (lock && lock.userId !== userId && !estaExpirado(lock)) {
        return { ok: false, lock: serializeLock(lock) }; // Já está travada por outro usuário
    }
    const novoLock = { userId, userNome: userNome || 'Usuário', timestamp: Date.now() };
    locks.set(osId, novoLock);
    return { ok: true, lock: serializeLock(novoLock) };
}

export function verificarLock(osId) {
    limparLocksExpirados();
    const lock = locks.get(osId);
    if (!lock) return null;
    return serializeLock(lock);
}

export function removerLock(osId, userId) {
    const lock = locks.get(osId);
    if (lock && lock.userId === userId) {
        locks.delete(osId);
        return true;
    }
    return false;
}

export function refreshLock(osId, userId) {
    const lock = locks.get(osId);
    if (lock && lock.userId === userId) {
        lock.timestamp = Date.now();
        locks.set(osId, lock);
        return serializeLock(lock);
    }
    return null;
}

export function listarLocks() {
    limparLocksExpirados();
    const result = {};
    for (const [osId, lock] of locks.entries()) {
        result[osId] = serializeLock(lock);
    }
    return result;
}

function estaExpirado(lock) {
    return Date.now() - lock.timestamp > LOCK_TIMEOUT_MS;
}

function serializeLock(lock) {
    return {
        userId: lock.userId,
        userNome: lock.userNome || 'Usuário',
        timestamp: lock.timestamp,
        expirado: estaExpirado(lock)
    };
}

function limparLocksExpirados() {
    const agora = Date.now();
    for (const [osId, lock] of locks.entries()) {
        if (agora - lock.timestamp > LOCK_TIMEOUT_MS) {
            locks.delete(osId);
        }
    }
} 
