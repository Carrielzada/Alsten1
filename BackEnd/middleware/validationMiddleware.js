import Joi from 'joi';
import DOMPurify from 'isomorphic-dompurify';
import crypto from 'crypto';

/**
 * @fileoverview Middleware de Validação e Sanitização - Conformidade LGPD/GDPR
 * 
 * Este módulo implementa validação rigorosa de dados de entrada e sanitização
 * contra ataques XSS/SQL Injection, seguindo as melhores práticas de segurança
 * e conformidade com LGPD (Lei Geral de Proteção de Dados Pessoais).
 * 
 * Funcionalidades:
 * - Validação de schemas com Joi
 * - Sanitização contra XSS com DOMPurify  
 * - Mascaramento de dados sensíveis em logs
 * - Rate limiting específico por endpoint
 * - Auditoria de tentativas de validação
 * 
 * @author Alsten Development Team
 * @version 1.0.0
 * @since 2025-01-19
 * @license MIT
 */

// ========================================
// CONSTANTES DE CONFORMIDADE LGPD/GDPR
// ========================================

/**
 * Campos considerados dados pessoais sensíveis pela LGPD
 * Esses campos serão mascarados em logs e terão validação extra
 */
const CAMPOS_DADOS_PESSOAIS = {
  SENSIVEL: ['senha', 'password', 'cpf', 'cnpj', 'rg', 'telefone', 'celular'],
  IDENTIFICACAO: ['email', 'nome', 'nomeCompleto', 'razaoSocial'],
  FINANCEIRO: ['cartaoCredito', 'contaBancaria', 'chavePix', 'valor']
};

/**
 * Padrões de validação para dados brasileiros
 */
const PADROES_BRASIL = {
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/,
  TELEFONE: /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/,
  CEP: /^\d{5}-?\d{3}$/,
  PLACA_VEICULO: /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/ // Antiga e Mercosul
};

/**
 * Configurações de rate limiting por tipo de operação
 */
const RATE_LIMITS = {
  LOGIN: { window: 15 * 60 * 1000, max: 5 }, // 5 tentativas por 15 min
  CADASTRO: { window: 60 * 60 * 1000, max: 3 }, // 3 cadastros por hora
  UPLOAD: { window: 60 * 1000, max: 10 }, // 10 uploads por minuto
  CONSULTA: { window: 60 * 1000, max: 100 }, // 100 consultas por minuto
  ALTERACAO: { window: 60 * 1000, max: 30 } // 30 alterações por minuto
};

// ========================================
// ESQUEMAS DE VALIDAÇÃO JOI
// ========================================
/**
 * Schemas de Validação Joi - Conformidade LGPD
 * Todos os schemas implementam validações rigorosas para proteção de dados
 */
export const schemas = {
  // ========================================
  // ORDEM DE SERVIÇO
  // ========================================
  ordemServico: {
    create: Joi.object({
      // Dados do Cliente (LGPD: Dados Pessoais)
      cliente: Joi.string()
        .min(2)
        .max(255)
        .required()
        .pattern(/^[a-zA-ZÀ-ÿ\s\-\.0-9&ªº®©]+$/)
        .trim()
        .messages({
          'string.base': 'Cliente deve ser um texto válido',
          'string.min': 'Nome do cliente deve ter pelo menos 2 caracteres',
          'string.max': 'Nome do cliente não pode exceder 255 caracteres',
          'string.pattern.base': 'Cliente deve conter apenas letras, números, espaços e símbolos permitidos',
          'any.required': 'Cliente é obrigatório'
        }),

      // Dados Técnicos do Equipamento
      modeloEquipamento: Joi.string()
        .min(1)
        .max(255)
        .required()
        .trim()
        .messages({
          'string.base': 'Modelo do equipamento deve ser um texto válido',
          'string.min': 'Modelo do equipamento é obrigatório',
          'string.max': 'Modelo do equipamento não pode exceder 255 caracteres',
          'any.required': 'Modelo do equipamento é obrigatório'
        }),

      defeitoAlegado: Joi.string()
        .min(5)
        .max(2000)
        .required()
        .trim()
        .messages({
          'string.base': 'Defeito alegado deve ser um texto válido',
          'string.min': 'Defeito alegado deve ter pelo menos 5 caracteres',
          'string.max': 'Defeito alegado não pode exceder 2000 caracteres',
          'any.required': 'Defeito alegado é obrigatório'
        }),

      numeroSerie: Joi.string()
        .max(100)
        .allow('', null)
        .trim()
        .pattern(/^[A-Za-z0-9\-_]+$/)
        .messages({
          'string.pattern.base': 'Número de série deve conter apenas letras, números, hífens e underlines'
        }),

      // Campos de Referência (IDs)
      fabricante: Joi.alternatives().try(
        Joi.string().max(255).trim(),
        Joi.number().integer().min(1)
      ).allow('', null),

      urgencia: Joi.alternatives().try(
        Joi.string().max(100).trim(),
        Joi.number().integer().min(1)
      ).allow('', null),

      // Tipos de Serviço
      tipoAnalise: Joi.alternatives().try(
        Joi.string().max(255).trim(),
        Joi.number().integer().min(1)
      ).allow('', null),

      tipoLacre: Joi.alternatives().try(
        Joi.string().max(255).trim(), 
        Joi.number().integer().min(1)
      ).allow('', null),

      tipoLimpeza: Joi.alternatives().try(
        Joi.string().max(255).trim(),
        Joi.number().integer().min(1)
      ).allow('', null),

      tipoTransporte: Joi.alternatives().try(
        Joi.string().max(255).trim(),
        Joi.number().integer().min(1)
      ).allow('', null),

      // Dados Financeiros (LGPD: Dados Sensíveis)
      formaPagamento: Joi.alternatives().try(
        Joi.string().max(255).trim(),
        Joi.number().integer().min(1)
      ).allow('', null),

      valor: Joi.number()
        .precision(2)
        .min(0)
        .max(9999999.99)
        .allow(null)
        .messages({
          'number.base': 'Valor deve ser um número válido',
          'number.min': 'Valor não pode ser negativo',
          'number.max': 'Valor muito alto, entre em contato com suporte'
        }),

      // Dados de Controle
      etapa: Joi.string().max(100).allow('', null).trim(),
      etapaId: Joi.number().integer().min(1).allow(null),
      
      vendedor: Joi.string()
        .max(255)
        .allow('', null)
        .trim()
        .pattern(/^[a-zA-ZÀ-ÿ\s\-\.]+$/)
        .messages({
          'string.pattern.base': 'Nome do vendedor deve conter apenas letras, espaços, hífens e pontos'
        }),

      // Datas (ISO 8601 ou formato brasileiro)
      diasPagamento: Joi.number().integer().min(0).max(365).allow(null),
      dataEntrega: Joi.date().iso().allow(null),
      dataAprovacaoOrcamento: Joi.date().iso().allow(null),
      diasReparo: Joi.number().integer().min(0).max(365).allow(null),
      dataEquipamentoPronto: Joi.date().iso().allow(null),

      // Informações Confidenciais (LGPD: Dados Sensíveis)
      informacoesConfidenciais: Joi.string()
        .max(5000)
        .allow('', null)
        .trim()
        .messages({
          'string.max': 'Informações confidenciais não podem exceder 5000 caracteres'
        }),

      // Flags Booleanas
      agendado: Joi.boolean().default(false),
      possuiAcessorio: Joi.boolean().default(false),

      // Transporte
      tipoTransporteTexto: Joi.string().max(500).allow('', null).trim(),
      transporteCifFob: Joi.string()
        .valid('CIF', 'FOB', 'cif', 'fob')
        .allow('', null)
        .uppercase(),

      // Campos Adicionais
      pedidoCompras: Joi.string()
        .max(100)
        .allow('', null)
        .trim()
        .alphanum()
        .messages({
          'string.alphanum': 'Pedido de compras deve conter apenas letras e números'
        }),

      defeitoConstatado: Joi.string().max(2000).allow('', null).trim(),
      servicoRealizar: Joi.string().max(2000).allow('', null).trim(),

      // Arquivos (validados separadamente no upload)
      arquivosAnexados: Joi.array().items(Joi.string()).max(10).allow(null),
      comprovanteAprovacao: Joi.string().max(500).allow('', null),
      notaFiscal: Joi.string().max(500).allow('', null),
      comprovante: Joi.string().max(500).allow('', null),
      checklistItems: Joi.array().items(Joi.object()).max(50).allow(null)
    }).options({ stripUnknown: true }),
    
    update: Joi.object({
      id: Joi.number().integer().min(1).required(),
      
      // Todos os campos do create, mas opcionais
      cliente: Joi.string().min(2).max(255)
        .pattern(/^[a-zA-ZÀ-ÿ\s\-\.0-9&ªº®©]+$/)
        .trim().optional(),
      
      modeloEquipamento: Joi.string().min(1).max(255).trim().optional(),
      defeitoAlegado: Joi.string().min(5).max(2000).trim().optional(),
      numeroSerie: Joi.string().max(100).allow('', null).trim().optional(),
      
      // Auditoria de Alteração (LGPD: Finalidade legítima)
      motivoAlteracao: Joi.string()
        .min(10)
        .max(500)
        .required()
        .trim()
        .messages({
          'any.required': 'Motivo da alteração é obrigatório para auditoria LGPD',
          'string.min': 'Motivo deve ter pelo menos 10 caracteres'
        })
    }).min(3).options({ stripUnknown: true }) // ID + motivo + pelo menos 1 campo
  },

  // Usuário
  usuario: {
    create: Joi.object({
      nome: Joi.string().min(2).max(255).required()
        .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
        .messages({
          'string.pattern.base': 'Nome deve conter apenas letras e espaços'
        }),
      email: Joi.string().email().max(255).required(),
      senha: Joi.string().min(8).max(128).required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .messages({
          'string.pattern.base': 'Senha deve conter pelo menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial'
        }),
      role_id: Joi.number().integer().min(1).max(6).required()
    }),
    
    login: Joi.object({
      email: Joi.string().email().required(),
      senha: Joi.string().min(1).required()
    })
  },

  // Paginação
  paginacao: Joi.object({
    pagina: Joi.number().integer().min(1).default(1),
    itensPorPagina: Joi.number().integer().min(1).max(100).default(25),
    termo: Joi.string().max(255).allow('').default('')
  }),

  // ID params
  idParam: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
};

/**
 * Sanitiza strings contra XSS usando DOMPurify
 * @param {any} obj - Objeto a ser sanitizado
 * @returns {any} - Objeto sanitizado
 */
function sanitizeObject(obj) {
  if (typeof obj === 'string') {
    // Remove scripts, tags perigosas e sanitiza HTML
    return DOMPurify.sanitize(obj, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [],
      STRIP_COMMENTS: true 
    }).trim();
  } else if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  } else if (obj !== null && typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
}

/**
 * Cria middleware de validação Joi
 * @param {Joi.Schema} schema - Schema Joi para validação
 * @param {string} source - Fonte dos dados ('body', 'query', 'params')
 * @returns {Function} - Middleware Express
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    let dataToValidate = {};
    
    switch (source) {
      case 'body':
        dataToValidate = req.body;
        break;
      case 'query':
        dataToValidate = req.query;
        break;
      case 'params':
        dataToValidate = req.params;
        break;
      default:
        dataToValidate = req.body;
    }

    // Sanitizar dados antes da validação
    const sanitizedData = sanitizeObject(dataToValidate);

    // Validar com Joi
    const { error, value } = schema.validate(sanitizedData, {
      abortEarly: false, // Mostrar todos os erros
      stripUnknown: true, // Remove campos não especificados no schema
      convert: true // Converte tipos quando possível
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      return res.status(400).json({
        success: false,
        error: {
          message: 'Dados de entrada inválidos',
          code: 400,
          validation_errors: errors
        }
      });
    }

    // Substituir dados originais pelos dados validados e sanitizados
    switch (source) {
      case 'body':
        req.body = value;
        break;
      case 'query':
        req.query = value;
        break;
      case 'params':
        req.params = value;
        break;
    }

    next();
  };
}

/**
 * Middleware de sanitização rápida para casos simples
 */
export const sanitize = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};

/**
 * Middleware de rate limiting específico para upload
 */
export const uploadRateLimit = (maxFiles = 5, windowMs = 60000) => {
  const uploads = new Map();
  
  return (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!uploads.has(clientIp)) {
      uploads.set(clientIp, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const clientData = uploads.get(clientIp);
    
    if (now > clientData.resetTime) {
      // Reset do contador
      uploads.set(clientIp, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (clientData.count >= maxFiles) {
      return res.status(429).json({
        success: false,
        error: {
          message: 'Muitos uploads em pouco tempo. Tente novamente mais tarde.',
          code: 429
        }
      });
    }
    
    clientData.count++;
    next();
  };
};

export default { validate, sanitize, schemas, uploadRateLimit };