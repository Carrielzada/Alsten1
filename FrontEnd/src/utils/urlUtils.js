/**
 * Utilitário para gerenciar URLs de forma dinâmica
 * Resolve o problema de URLs hardcoded em diferentes ambientes
 */

/**
 * Obtém a URL base atual do frontend
 * @returns {string} URL base (ex: https://alsten.online ou http://localhost:3000)
 */
export const getFrontendBaseUrl = () => {
  // Se estamos no browser, usar window.location
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Fallback para variável de ambiente
  return process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';
};

/**
 * Obtém a URL completa para o redirecionamento do Bling
 * @returns {string} URL completa para /bling/success
 */
export const getBlingSuccessUrl = () => {
  return `${getFrontendBaseUrl()}/bling/success`;
};

/**
 * Obtém a URL da API de forma dinâmica
 * @returns {string} URL da API
 */
export const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:4000';
};

/**
 * Verifica se estamos em produção
 * @returns {boolean}
 */
export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Verifica se estamos em desenvolvimento
 * @returns {boolean}
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Obtém informações do ambiente atual
 * @returns {object} Informações do ambiente
 */
export const getEnvironmentInfo = () => {
  return {
    frontend: getFrontendBaseUrl(),
    api: getApiBaseUrl(),
    blingSuccess: getBlingSuccessUrl(),
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
    host: typeof window !== 'undefined' ? window.location.host : 'unknown',
    protocol: typeof window !== 'undefined' ? window.location.protocol : 'http:'
  };
};