import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { useAuth } from '../../contexts/AuthContext';
import { aeronaveAPI, etapaAPI, pecaAPI, funcionarioAPI } from '../../services/api';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({ aeronaves: 0, pecas: 0, etapasConcluidas: 0, funcionarios: 0 });

  useEffect(() => {
    const carregarStats = async () => {
      try {
        const [aeronaves, pecas, etapas, funcionarios] = await Promise.all([
          aeronaveAPI.listar(), pecaAPI.listar(), etapaAPI.listar(), funcionarioAPI.listar()
        ]);
        setStats({
          aeronaves: aeronaves.length,
          pecas: pecas.length,
          etapasConcluidas: etapas.filter((e: any) => e.status === 'CONCLUIDA').length,
          funcionarios: funcionarios.length
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };
    carregarStats();
  }, []);

  const statsCards = [
    { label: 'Aeronaves em produção', value: stats.aeronaves, icon: '✈︎', color: '#5e9cde' },
    { label: 'Peças em estoque', value: stats.pecas, icon: '⚙', color: '#3d7abe' },
    { label: 'Etapas concluídas', value: stats.etapasConcluidas, icon: '✔', color: '#2c5a8c' },
    { label: 'Funcionários ativos', value: stats.funcionarios, icon: '🗣', color: '#1a3a5c' },
  ];

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.content}>
          <div className={styles.welcomeSection}>
            <h2 className={styles.welcomeTitle}>Bem-vindo, {usuario?.funcionario.nome}!</h2>
            <p className={styles.welcomeText}>Este é o sistema de gestão da produção de aeronaves da Aerocode.</p>
          </div>
          <div className={styles.statsGrid}>
            {statsCards.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon} style={{ backgroundColor: stat.color }}>{stat.icon}</div>
                <div className={styles.statInfo}>
                  <h3 className={styles.statValue}>{stat.value}</h3>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;