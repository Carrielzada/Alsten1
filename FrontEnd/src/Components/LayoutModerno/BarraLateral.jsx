import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ContextoUsuarioLogado } from '../../App';
import './BarraLateral.css'; // Pode ser mesclado com LayoutModerno.css ou mantido separado

// Adicione className às props
const BarraLateral = ({ className }) => {
  const { usuarioLogado } = useContext(ContextoUsuarioLogado);
  const isAdmin = usuarioLogado?.role === 1;
  // Itens do menu básico para todos os usuários
  const baseMenuItems = [
    { path: '/boas-vindas', label: 'Início', icon: 'FaHome' },
    { path: '/ordens-servico', label: 'Ordens de Serviço', icon: 'FaBoxOpen' },
    { path: '/os-concluidas', label: 'OS Concluídas', icon: 'FaCheckCircle' },
    { path: '/cadastros', label: 'Cadastros', icon: 'FaCog' },
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
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            {item.subItems ? (
              <>
                <span className="menu-link-header">{/* {item.icon && <span className="menu-icon"><item.icon /></span>} */} {item.label}</span>
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
                {/* {item.icon && <span className="menu-icon"><item.icon /></span>} */}
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