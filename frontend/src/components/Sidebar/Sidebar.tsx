import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { NivelPermissao } from '../../types';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  const { usuario, hasPermission, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', roles: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR] },
    { path: '/aeronaves', label: 'Aeronaves', roles: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO] },
    { path: '/pecas', label: 'Peças', roles: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO] },
    { path: '/etapas', label: 'Etapas', roles: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR] },
    { path: '/funcionarios', label: 'Funcionários', roles: [NivelPermissao.ADMINISTRADOR] },
    { path: '/testes', label: 'Testes', roles: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR] },
    { path: '/relatorio', label: 'Relatório', roles: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO] },
    { path: '/qualidade', label: 'Qualidade', roles: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO] },
    { path: '/perfil', label: 'Meu Perfil', roles: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR] },
  ];

  const filteredItems = menuItems.filter(item => hasPermission(item.roles));

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
    if (!menuAberto) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  const fecharMenu = () => {
    setMenuAberto(false);
    document.body.classList.remove('menu-open');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <button className={styles.hamburger} onClick={toggleMenu}>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      {menuAberto && <div className={styles.overlay} onClick={fecharMenu}></div>}

      <aside className={`${styles.sidebar} ${menuAberto ? styles.mobileOpen : ''}`}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>A</span>
          <span className={styles.logoText}>Aerocode</span>
          <button className={styles.closeButton} onClick={fecharMenu}>×</button>
        </div>
        
        <nav className={styles.nav}>
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              onClick={fecharMenu}
            >
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {usuario?.funcionario.nome.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{usuario?.funcionario.nome}</span>
            <span className={styles.userRole}>{usuario?.funcionario.nivelPermissao}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;