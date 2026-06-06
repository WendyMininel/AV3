import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import CadastroAeronave from './CadastroAeronave';
import ListaAeronaves from './ListaAeronaves';
import { Aeronave } from '../../types';
import { aeronaveAPI } from '../../services/api';
import styles from './Aeronaves.module.css';

const Aeronaves: React.FC = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarAeronaves = async () => {
    try {
      setLoading(true);
      const dados = await aeronaveAPI.listar();
      setAeronaves(dados);
    } catch (error) {
      console.error('Erro ao carregar aeronaves:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAeronaves();
  }, []);

  const handleCadastrar = async (novaAeronave: Aeronave) => {
    try {
      await aeronaveAPI.criar(novaAeronave);
      await carregarAeronaves();
      setView('list');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar aeronave');
    }
  };

  const handleRemover = async (codigo: string) => {
    if (window.confirm('Tem certeza que deseja remover esta aeronave?')) {
      try {
        await aeronaveAPI.deletar(codigo);
        await carregarAeronaves();
      } catch (error) {
        console.error('Erro ao remover:', error);
        alert('Erro ao remover aeronave');
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.aeronaves}>
        <Sidebar />
        <div className={styles.mainContent}>
          <Header />
          <div className={styles.content}>
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.aeronaves}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Gerenciamento de Aeronaves</h2>
            <div className={styles.actions}>
              {view === 'list' && (
                <button 
                  className={styles.createButton}
                  onClick={() => setView('create')}
                >
                  + Nova Aeronave
                </button>
              )}
              {view === 'create' && (
                <button 
                  className={styles.backButton}
                  onClick={() => setView('list')}
                >
                  ← Voltar
                </button>
              )}
            </div>
          </div>
          
          {view === 'list' && (
            <ListaAeronaves aeronaves={aeronaves} onRemover={handleRemover} />
          )}
          
          {view === 'create' && (
            <CadastroAeronave onSalvar={handleCadastrar} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Aeronaves;