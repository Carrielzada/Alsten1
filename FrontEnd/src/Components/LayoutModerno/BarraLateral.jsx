import React from 'react';
import { Link } from 'react-router-dom';
import './BarraLateral.css';
// Importar ícones (exemplo com react-icons, precisaria instalar: npm install react-icons)
// import { FaTachometerAlt, FaBoxOpen, FaUsers, FaCog } from 'react-icons/fa';

const BarraLateral = () => {
  // Mock de itens do menu, idealmente viria de uma configuração ou do estado da aplicação
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'FaTachometerAlt' }, // Substituir string por componente de ícone
    { path: '/ordens-servico', label: 'Ordens de Serviço', icon: 'FaBoxOpen' },
    {
      label: 'Cadastros',
      icon: 'FaCog',
      subItems: [
        { path: '/cadastros/modelo-equipamento', label: 'Modelos de Equip.' },
        { path: '/cadastros/pagamento', label: 'Formas de Pag.' },
        { path: '/cadastros/urgencia', label: 'Níveis de Urgência' },
        { path: '/cadastros/tipo-lacre', label: 'Tipos de Lacre' },
        { path: '/cadastros/tipo-analise', label: 'Tipos de Análise' },
        // Adicionar outros submenus de cadastro aqui
      ],
    },
    // Adicionar mais itens de menu conforme necessário
  ];

  return (
    <nav className="barra-lateral">
      <div className="logo-container">
        {/* Idealmente, um componente <img src="logo_alsten.png" alt="Alsten" /> */}
        <h1 className="logo-texto">Alsten</h1>
      </div>
      <ul className="menu-lista">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            {item.subItems ? (
              <>
                {/* Implementar lógica de dropdown/accordion para submenus */}
                <span className="menu-link-header">{item.icon && <span className="menu-icon">{/* <item.icon /> */}</span>}{item.label}</span>
                <ul className="submenu-lista">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className="submenu-item">
                      <Link to={subItem.path} className="menu-link">
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link to={item.path} className="menu-link">
                {item.icon && <span className="menu-icon">{/* <item.icon /> */}</span>}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BarraLateral;
