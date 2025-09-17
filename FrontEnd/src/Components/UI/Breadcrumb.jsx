import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import './Breadcrumb.css';

/**
 * Componente de breadcrumb moderno
 * 
 * @param {Array} customItems - Array de itens customizados para o breadcrumb
 * @param {boolean} showHome - Se deve mostrar o ícone de home
 */
const Breadcrumb = ({ customItems = null, showHome = true }) => {
  const location = useLocation();

  // Mapeamento de rotas para breadcrumbs
  const routeMap = {
    // Cadastros
    '/cadastros': { title: 'Cadastros', parent: null },
    '/cadastros/modelo-equipamento': { title: 'Modelos de Equipamentos', parent: 'Cadastros' },
    '/cadastros/pagamento': { title: 'Tipos de Pagamento', parent: 'Cadastros' },
    '/cadastros/urgencia': { title: 'Níveis de Urgência', parent: 'Cadastros' },
    '/cadastros/clientes': { title: 'Clientes', parent: 'Cadastros' },
    '/cadastros/fabricante': { title: 'Fabricantes', parent: 'Cadastros' },
    '/cadastros/tipo-analise': { title: 'Tipos de Análise', parent: 'Cadastros' },
    '/cadastros/tipo-lacre': { title: 'Tipos de Lacre', parent: 'Cadastros' },
    '/cadastros/tipo-limpeza': { title: 'Tipos de Limpeza', parent: 'Cadastros' },
    '/cadastros/tipo-transporte': { title: 'Tipos de Transporte', parent: 'Cadastros' },
    '/cadastros/defeito-alegado': { title: 'Defeitos Alegados', parent: 'Cadastros' },
    '/cadastros/servico-realizado': { title: 'Serviços Padrão', parent: 'Cadastros' },
    
    // Admin
    '/admin': { title: 'Admin', parent: null },
    '/admin/usuarios': { title: 'Usuários do Sistema', parent: 'Admin' },
    '/admin/configuracoes': { title: 'Configurações', parent: 'Admin' },
    '/admin/logs': { title: 'Logs', parent: 'Admin' },
    '/admin/relatorios': { title: 'Relatórios', parent: 'Admin' },
    
    // Outros
    '/ordens-servico': { title: 'Ordens de Serviço', parent: null },
    '/minha-conta': { title: 'Minha Conta', parent: null },
  };

  // Se há itens customizados, usar eles
  if (customItems) {
    return (
      <nav className="modern-breadcrumb">
        <ol className="breadcrumb-list">
          {showHome && (
            <li className="breadcrumb-item">
              <Link to="/ordens-servico" className="breadcrumb-link">
                <FaHome />
              </Link>
              <FaChevronRight className="breadcrumb-separator" />
            </li>
          )}
          {customItems.map((item, index) => (
            <li key={index} className={`breadcrumb-item ${index === customItems.length - 1 ? 'active' : ''}`}>
              {item.link && index !== customItems.length - 1 ? (
                <Link to={item.link} className="breadcrumb-link">
                  {item.title}
                </Link>
              ) : (
                <span className="breadcrumb-current">{item.title}</span>
              )}
              {index < customItems.length - 1 && <FaChevronRight className="breadcrumb-separator" />}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Gerar breadcrumb automaticamente baseado na rota atual
  const currentRoute = routeMap[location.pathname];
  if (!currentRoute) return null;

  const items = [];
  
  // Adicionar item pai se existir
  if (currentRoute.parent) {
    items.push({
      title: currentRoute.parent,
      link: currentRoute.parent === 'Cadastros' ? '/cadastros' : 
            currentRoute.parent === 'Admin' ? '/admin' : null
    });
  }
  
  // Adicionar item atual
  items.push({
    title: currentRoute.title,
    link: null // Item atual não tem link
  });

  return (
    <nav className="modern-breadcrumb">
      <ol className="breadcrumb-list">
        {showHome && (
          <li className="breadcrumb-item">
            <Link to="/ordens-servico" className="breadcrumb-link">
              <FaHome />
            </Link>
            <FaChevronRight className="breadcrumb-separator" />
          </li>
        )}
        {items.map((item, index) => (
          <li key={index} className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}>
            {item.link && index !== items.length - 1 ? (
              <Link to={item.link} className="breadcrumb-link">
                {item.title}
              </Link>
            ) : (
              <span className="breadcrumb-current">{item.title}</span>
            )}
            {index < items.length - 1 && <FaChevronRight className="breadcrumb-separator" />}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;