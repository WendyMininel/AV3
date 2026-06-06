import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import CadastroEtapa from './CadastroEtapa';
import ListaEtapas from './ListaEtapas';
import { Etapa, Funcionario, Aeronave } from '../../types';
import { etapaAPI, aeronaveAPI, funcionarioAPI } from '../../services/api';
import styles from './Etapas.module.css';

const Etapas: React.FC = () => {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [aeronavesData, funcionariosData, etapasData] = await Promise.all([
        aeronaveAPI.listar(),
        funcionarioAPI.listar(),
        etapaAPI.listar()
      ]);
      setAeronaves(aeronavesData);
      setFuncionarios(funcionariosData);
      setEtapas(etapasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvarEtapa = async (novaEtapa: Etapa) => {
    try {
      await etapaAPI.criar(novaEtapa);
      await carregarDados();
      setShowForm(false);
      alert('Etapa cadastrada com sucesso!');
    } catch (error: any) {
      const mensagem = error.message || 'Erro ao salvar etapa';
      alert(mensagem);
    }
  };

  const handleIniciar = async (index: number) => {
    try {
      await etapaAPI.iniciar(etapas[index].id);
      await carregarDados();
      alert('Etapa iniciada com sucesso!');
    } catch (error: any) {
      const mensagem = error.message || 'Erro ao iniciar etapa';
      alert(mensagem);
      throw error;
    }
  };

  const handleFinalizar = async (index: number) => {
    try {
      await etapaAPI.finalizar(etapas[index].id);
      await carregarDados();
      alert('Etapa finalizada com sucesso!');
    } catch (error: any) {
      const mensagem = error.message || 'Erro ao finalizar etapa';
      alert(mensagem);
      throw error;
    }
  };

  const handleAssociarFuncionario = async (etapaId: string, funcionario: Funcionario) => {
    try {
      await etapaAPI.associarFuncionario(etapaId, funcionario.id);
      await carregarDados();
      alert('Funcionário associado com sucesso!');
    } catch (error) {
      console.error('Erro ao associar funcionário:', error);
      alert('Erro ao associar funcionário');
    }
  };

  const handleRemoverFuncionario = async (etapaId: string, funcionarioId: string) => {
    try {
      await fetch(`http://localhost:3333/api/etapas/${etapaId}/funcionarios/${funcionarioId}`, {
        method: 'DELETE'
      });
      await carregarDados();
      alert('Funcionário removido da etapa com sucesso!');
    } catch (error) {
      console.error('Erro ao remover funcionário:', error);
      alert('Erro ao remover funcionário');
    }
  };

  const handleExcluirEtapa = async (etapaId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta etapa?\n\nTodas as associações com funcionários também serão removidas.')) {
      try {
        await etapaAPI.deletar(etapaId);
        await carregarDados();
        alert('Etapa excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir etapa:', error);
        alert('Erro ao excluir etapa');
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.etapas}>
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
    <div className={styles.etapas}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Gerenciamento de Etapas</h2>
            <button className={styles.createButton} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancelar' : '+ Nova Etapa'}
            </button>
          </div>

          {showForm && (
            <CadastroEtapa 
              onSalvar={handleSalvarEtapa}
              onCancelar={() => setShowForm(false)}
              aeronaves={aeronaves}
            />
          )}

          <ListaEtapas 
            etapas={etapas}
            onIniciar={handleIniciar}
            onFinalizar={handleFinalizar}
            onAssociarFuncionario={handleAssociarFuncionario}
            onRemoverFuncionario={handleRemoverFuncionario}
            onExcluirEtapa={handleExcluirEtapa}
            funcionarios={funcionarios}
            aeronaves={aeronaves}
          />
        </div>
      </div>
    </div>
  );
};

export default Etapas;