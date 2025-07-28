// Serviço simples de lock em memória para edição concorrente de OS
// Em produção, prefira Redis ou banco de dados!

const LOCK_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutos
const locks = new Map(); // chave: osId, valor: { userId, timestamp }

export function criarLock(osId, userId) {
    limparLocksExpirados();
    const lock = locks.get(osId);
    if (lock && lock.userId !== userId && !lock.expirado) {
        return false; // Já está travada por outro usuário
    }
    locks.set(osId, { userId, timestamp: Date.now() });
    return true;
}

export function verificarLock(osId) {
    limparLocksExpirados();
    const lock = locks.get(osId);
    if (!lock) return null;
    return {
        userId: lock.userId,
        timestamp: lock.timestamp,
        expirado: Date.now() - lock.timestamp > LOCK_TIMEOUT_MS
    };
}

export function removerLock(osId, userId) {
    const lock = locks.get(osId);
    if (lock && lock.userId === userId) {
        locks.delete(osId);
        return true;
    }
    return false;
}

function limparLocksExpirados() {
    const agora = Date.now();
    for (const [osId, lock] of locks.entries()) {
        if (agora - lock.timestamp > LOCK_TIMEOUT_MS) {
            locks.delete(osId);
        }
    }
} 