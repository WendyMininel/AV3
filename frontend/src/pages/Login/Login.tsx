import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';
import fundoImage from '../../assets/fundo.jpg';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return; 
    
    setLoading(true);
    setErro('');
    
    try {
      const success = await login(usuario, senha);
      if (success) {
        navigate('/dashboard');
      } else {
        setErro('Usuário ou senha inválidos');
      }
    } catch (error) {
      setErro('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={styles.container}
      style={{ backgroundImage: `url(${fundoImage})` }}
    >
      <div className={styles.content}>
        <h1 className={styles.logoTitle}>Aerocode</h1>
        
        <div className={styles.loginCard}>
          <h2 className={styles.welcomeText}>Bem vindo à bordo</h2>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className={styles.input}
                disabled={loading}
                autoComplete="off"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={styles.input}
                disabled={loading}
              />
            </div>
            
            {erro && <div className={styles.errorMessage}>{erro}</div>}
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Embarcar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;