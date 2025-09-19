/**
 * @fileoverview Utilitário de Paginação - Fase 2 Performance & Escalabilidade
 * 
 * Helper para padronizar paginação em todos os endpoints da API,
 * incluindo validações de parâmetros e construção de responses consistentes.
 * 
 * @author Alsten Development Team
 * @version 2.0.0
 * @since 2025-01-19
 */

/**
 * Configurações padrão de paginação
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1
};

/**
 * Valida e sanitiza parâmetros de paginação
 * @param {Object} query - Query parameters da request
 * @returns {Object} Parâmetros validados { page, limit, offset }
 */
export function validatePaginationParams(query = {}) {
  const page = Math.max(1, parseInt(query.page) || PAGINATION_DEFAULTS.PAGE);
  const limit = Math.min(
    PAGINATION_DEFAULTS.MAX_LIMIT, 
    Math.max(PAGINATION_DEFAULTS.MIN_LIMIT, parseInt(query.limit) || PAGINATION_DEFAULTS.LIMIT)
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Constrói objeto de metadata de paginação
 * @param {number} total - Total de registros
 * @param {number} page - Página atual
 * @param {number} limit - Items per page
 * @returns {Object} Metadata de paginação
 */
export function buildPaginationMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    perPage: limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    previousPage: page > 1 ? page - 1 : null
  };
}

/**
 * Padroniza response de endpoints com paginação
 * @param {Array} data - Dados da página atual
 * @param {Object} meta - Metadata de paginação
 * @param {Object} filters - Filtros aplicados (opcional)
 * @returns {Object} Response padronizada
 */
export function buildPaginatedResponse(data, meta, filters = null) {
  const response = {
    success: true,
    data,
    meta
  };

  if (filters && Object.keys(filters).length > 0) {
    response.filters = filters;
  }

  return response;
}

/**
 * Constrói cláusula WHERE dinâmica com filtros
 * @param {Object} filters - Objeto com filtros
 * @param {Array} baseParams - Parâmetros base já existentes
 * @returns {Object} { whereClause, params }
 */
export function buildDynamicWhere(filters = {}, baseParams = []) {
  const conditions = [];
  const params = [...baseParams];

  // Remove filtros vazios
  const cleanFilters = Object.entries(filters)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '')
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

  return { conditions, params, cleanFilters };
}

/**
 * Sanitiza termo de busca para LIKE
 * @param {string} termo - Termo de busca
 * @returns {string} Termo sanitizado
 */
export function sanitizeSearchTerm(termo) {
  if (!termo || typeof termo !== 'string') return '';
  
  // Remove caracteres especiais que podem quebrar SQL LIKE
  return termo.trim()
    .replace(/[%_\\]/g, '\\$&') // Escapa caracteres especiais do LIKE
    .substring(0, 100); // Limita tamanho para evitar DoS
}

/**
 * Valida filtros específicos para OrdemServico
 * @param {Object} query - Query parameters
 * @returns {Object} Filtros validados
 */
export function validateOrdemServicoFilters(query = {}) {
  const filters = {};

  // Status (pode ser string ou array)
  if (query.status) {
    const statusArray = Array.isArray(query.status) ? query.status : [query.status];
    const validStatus = ['aberta', 'em_andamento', 'concluida', 'cancelada', 'aguardando'];
    filters.status = statusArray.filter(s => validStatus.includes(s));
  }

  // Cliente ID (para filtrar por cliente específico do Bling)
  if (query.clienteId) {
    const clienteId = parseInt(query.clienteId);
    if (!isNaN(clienteId) && clienteId > 0) {
      filters.clienteId = clienteId;
    }
  }

  // Etapa ID
  if (query.etapaId) {
    const etapaId = parseInt(query.etapaId);
    if (!isNaN(etapaId) && etapaId > 0) {
      filters.etapaId = etapaId;
    }
  }

  // Urgência ID
  if (query.urgenciaId) {
    const urgenciaId = parseInt(query.urgenciaId);
    if (!isNaN(urgenciaId) && urgenciaId > 0) {
      filters.urgenciaId = urgenciaId;
    }
  }

  // Período de criação (data de/até)
  if (query.dataInicio && /^\d{4}-\d{2}-\d{2}$/.test(query.dataInicio)) {
    filters.dataInicio = query.dataInicio;
  }

  if (query.dataFim && /^\d{4}-\d{2}-\d{2}$/.test(query.dataFim)) {
    filters.dataFim = query.dataFim;
  }

  // Termo de busca geral (cliente, modelo, número série)
  if (query.search) {
    filters.search = sanitizeSearchTerm(query.search);
  }

  // Filtros de Range - Valor
  if (query.valorMin) {
    const valorMin = parseFloat(query.valorMin);
    if (!isNaN(valorMin) && valorMin >= 0) {
      filters.valorMin = valorMin;
    }
  }

  if (query.valorMax) {
    const valorMax = parseFloat(query.valorMax);
    if (!isNaN(valorMax) && valorMax >= 0) {
      filters.valorMax = valorMax;
    }
  }

  // Filtros de Range - Dias de Reparo
  if (query.diasReparoMin) {
    const diasMin = parseInt(query.diasReparoMin);
    if (!isNaN(diasMin) && diasMin >= 0 && diasMin <= 365) {
      filters.diasReparoMin = diasMin;
    }
  }

  if (query.diasReparoMax) {
    const diasMax = parseInt(query.diasReparoMax);
    if (!isNaN(diasMax) && diasMax >= 0 && diasMax <= 365) {
      filters.diasReparoMax = diasMax;
    }
  }

  return filters;
}

/**
 * Valida filtros específicos para Users
 * @param {Object} query - Query parameters
 * @returns {Object} Filtros validados
 */
export function validateUsersFilters(query = {}) {
  const filters = {};

  // Role ID (papel do usuário)
  if (query.roleId) {
    const roleId = parseInt(query.roleId);
    if (!isNaN(roleId) && roleId >= 1 && roleId <= 6) {
      filters.roleId = roleId;
    }
  }

  // Nome (busca parcial)
  if (query.nome) {
    filters.nome = sanitizeSearchTerm(query.nome);
  }

  // Email (busca parcial)
  if (query.email) {
    filters.email = sanitizeSearchTerm(query.email);
  }

  // Status ativo/inativo
  if (query.ativo !== undefined) {
    filters.ativo = query.ativo === 'true' || query.ativo === '1';
  }

  // Termo de busca geral (nome OU email)
  if (query.search) {
    filters.search = sanitizeSearchTerm(query.search);
  }

  return filters;
}

/**
 * Constrói ORDER BY dinâmico e seguro
 * Suporta formatos: ?orderBy=campo&orderDirection=desc OU ?sort=campo:desc
 * @param {string} orderBy - Campo para ordenação
 * @param {string} orderDirection - Direção (asc/desc)
 * @param {Array} allowedFields - Campos permitidos para ordenação
 * @param {string} defaultOrder - Ordenação padrão
 * @param {string} sortParam - Parâmetro ?sort=campo:direção (opcional)
 * @returns {string} Cláusula ORDER BY
 */
export function buildOrderBy(orderBy, orderDirection = 'asc', allowedFields = [], defaultOrder = 'id DESC', sortParam = null) {
  let field = orderBy;
  let direction = orderDirection;
  
  // Suporte para formato ?sort=campo:direção
  if (sortParam && typeof sortParam === 'string' && sortParam.includes(':')) {
    const [sortField, sortDirection] = sortParam.split(':');
    field = sortField.trim();
    direction = sortDirection.trim();
  }
  
  // Validar direção
  const validDirection = direction && direction.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  
  // Validar campo
  if (!field || !allowedFields.includes(field)) {
    return defaultOrder;
  }

  return `${field} ${validDirection}`;
}

/**
 * Log de performance para monitoramento
 * @param {string} operation - Nome da operação
 * @param {number} startTime - Timestamp de início
 * @param {number} totalRecords - Total de registros
 * @param {Object} filters - Filtros aplicados
 */
export function logPaginationPerformance(operation, startTime, totalRecords, filters = {}) {
  const duration = Date.now() - startTime;
  const hasFilters = Object.keys(filters).length > 0;
  
  console.log(`📊 [PAGINATION] ${operation} - ${duration}ms - ${totalRecords} records${hasFilters ? ' (filtered)' : ''}`);
  
  // Log warning para queries lentas
  if (duration > 1000) {
    console.warn(`⚠️  [SLOW QUERY] ${operation} took ${duration}ms - Consider optimization`);
  }
}

export default {
  PAGINATION_DEFAULTS,
  validatePaginationParams,
  buildPaginationMeta,
  buildPaginatedResponse,
  buildDynamicWhere,
  sanitizeSearchTerm,
  validateOrdemServicoFilters,
  validateUsersFilters,
  buildOrderBy,
  logPaginationPerformance
};