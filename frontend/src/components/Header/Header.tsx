import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { logout, usuario } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.pageTitle}>Sistema de Gestão de Produção</h1>
      </div>
      
      <div className={styles.headerRight}>
        <div className={styles.userBadge}>
          <span className={styles.userBadgeName}>{usuario?.funcionario.nome}</span>
          <span className={styles.userBadgeRole}>{usuario?.funcionario.nivelPermissao}</span>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;