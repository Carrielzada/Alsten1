import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { ContextoUsuarioLogado } from '../../App';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import './BarraLateral.css'; // Pode ser mesclado com LayoutModerno.css ou mantido separado

// Adicione className às props
const BarraLateral = ({ className }) => {
  const { usuarioLogado } = useContext(ContextoUsuarioLogado);
  const isAdmin = usuarioLogado?.role === 1;
  const [openMenus, setOpenMenus] = useState({ cadastros: false, admin: false, perfil: false });
  
  const toggleMenu = (menuKey) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };
  // Itens do menu básico para todos os usuários
  const baseMenuItems = [
    { path: '/boas-vindas', label: 'Início', icon: 'FaHome' },
    { path: '/ordens-servico', label: 'Ordens de Serviço', icon: 'FaBoxOpen' },
    { path: '/os-concluidas', label: 'OS Concluídas', icon: 'FaCheckCircle' },
    {
      path: '/cadastros',
      label: 'Cadastros',
      icon: 'FaCog',
      subItems: [
        { path: '/cadastros', label: '📋 Central de Cadastros' },
        { path: '/cadastrar-ordem-servico', label: '➕ Nova Ordem de Serviço' },
        { path: '/cadastros/clientes', label: '👥 Clientes' },
        { path: '/cadastros/modelo-equipamento', label: '⚙️ Modelos de Equipamento' },
        { path: '/cadastros/fabricante', label: '🏭 Fabricantes' },
        { path: '/cadastros/defeito-alegado', label: '⚠️ Defeitos Alegados' },
        { path: '/cadastros/tipo-analise', label: '🔬 Tipos de Análise' },
        { path: '/cadastros/tipo-lacre', label: '🔧 Tipos de Lacre' },
        { path: '/cadastros/tipo-limpeza', label: '🧹 Tipos de Limpeza' },
        { path: '/cadastros/tipo-transporte', label: '🚛 Tipos de Transporte' },
        { path: '/cadastros/servico-realizado', label: '🛠️ Serviços Padrão' },
        { path: '/cadastros/pagamento', label: '💳 Formas de Pagamento' },
        { path: '/cadastros/urgencia', label: '🚨 Níveis de Urgência' },
      ],
    },
  ];

  // Menu administrativo (apenas para Admin - role 1)
  const adminMenuItems = {
    label: 'Admin',
    icon: 'FaUserShield',
    subItems: [
      { path: '/admin/usuarios', label: 'Usuários do Sistema' },
      { path: '/meu-perfil', label: 'Meu Perfil' },
    ],
  };

  // Construir menu dinâmico baseado no role do usuário
  const menuItems = isAdmin ? [...baseMenuItems, adminMenuItems] : [...baseMenuItems, {
    label: 'Perfil',
    icon: 'FaUser',
    subItems: [
      { path: '/meu-perfil', label: 'Meu Perfil' },
    ],
  }];

  const navClass = `barra-lateral ${className || ''}`;

  return (
    <nav className={navClass}>
      <div className="logo-container">
        <h1 className="logo-texto">Alsten</h1>
      </div>
      <ul className="menu-lista">
        {menuItems.map((item, index) => {
          const menuKey = item.label.toLowerCase().replace(/\s+/g, '');
          const isOpen = openMenus[menuKey];
          
          return (
            <li key={index} className="menu-item">
              {item.subItems ? (
                <>
                  <div 
                    className="menu-link-header clickable" 
                    onClick={() => toggleMenu(menuKey)}
                    role="button"
                    tabIndex="0"
                    onKeyPress={(e) => e.key === 'Enter' && toggleMenu(menuKey)}
                  >
                    <span className="menu-header-content">
                      {item.label}
                    </span>
                    <span className="menu-toggle-icon">
                      {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                  </div>
                  <ul className={`submenu-lista ${isOpen ? 'open' : ''}`}>
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
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BarraLateral;