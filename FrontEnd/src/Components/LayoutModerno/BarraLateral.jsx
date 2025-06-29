import { Link } from 'react-router-dom';
import './BarraLateral.css'; // Pode ser mesclado com LayoutModerno.css ou mantido separado

// Adicione className às props
const BarraLateral = ({ className }) => {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'FaTachometerAlt' }, // Substituir string por componente de ícone
    { path: '/cadastrar-os', label: 'Ordens de Serviço', icon: 'FaBoxOpen' },
    {
      label: 'Cadastros',
      icon: 'FaCog',
      subItems: [
        { path: '/cadastros/clientes', label: 'Clientes' },
        { path: '/cadastros/modelo-equipamento', label: 'Modelos de Equipamento' },
        { path: '/cadastros/pagamento', label: 'Formas de Pagamentos' },
        { path: '/cadastros/urgencia', label: 'Níveis de Urgência' },
        { path: '/cadastros/tipo-lacre', label: 'Tipos de Lacre' },
        { path: '/cadastros/tipo-analise', label: 'Tipos de Análise' },
        { path: '/cadastros/tipo-limpeza', label: 'Tipos de Limpeza' },
        { path: '/cadastros/tipo-transporte', label: 'Tipos de Transporte' },
        { path: '/cadastros/defeito-alegado', label: 'Defeito Alegado' },
      ],
    },
    // Adicionar mais itens de menu conforme necessário
  ];

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