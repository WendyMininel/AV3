import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import CadastroPeca from './CadastroPeca';
import { Peca, StatusPeca, TipoPeca, Aeronave } from '../../types';
import { pecaAPI, aeronaveAPI } from '../../services/api';
import styles from './Pecas.module.css';

const Pecas: React.FC = () => {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [associandoId, setAssociandoId] = useState<string | null>(null);

  const carregarPecas = async () => {
    try {
      setLoading(true);
      const dados = await pecaAPI.listar();
      console.log('Peças carregadas:', dados);
      setPecas(dados);
    } catch (error) {
      console.error('Erro ao carregar peças:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarAeronaves = async () => {
    try {
      const dados = await aeronaveAPI.listar();
      console.log('Aeronaves carregadas:', dados);
      setAeronaves(dados);
    } catch (error) {
      console.error('Erro ao carregar aeronaves:', error);
    }
  };

  useEffect(() => {
    carregarPecas();
    carregarAeronaves();
  }, []);

  const handleSalvar = async (novaPeca: Peca) => {
    try {
      await pecaAPI.criar(novaPeca);
      await carregarPecas();
      setShowForm(false);
      alert('Peça cadastrada com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar peça:', error);
      alert('Erro ao cadastrar peça');
    }
  };

  const handleAtualizar = async (pecaAtualizada: Peca) => {
    try {
      await fetch(`http://localhost:3333/api/pecas/${pecaAtualizada.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pecaAtualizada)
      });
      await carregarPecas();
      setShowForm(false);
      alert('Peça atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar peça:', error);
      alert('Erro ao atualizar peça');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: StatusPeca) => {
    try {
      await pecaAPI.atualizarStatus(id, newStatus);
      await carregarPecas();
      alert('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta peça?\n\nTodas as associações com aeronaves também serão removidas.')) {
      try {
        setLoading(true);
        await pecaAPI.deletar(id);
        await carregarPecas();
        alert('Peça removida com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar peça:', error);
        alert('Erro ao deletar peça');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAssociarAeronave = async (pecaId: string, aeronaveCodigo: string) => {
    if (!aeronaveCodigo) return;
    try {
      const response = await fetch(`http://localhost:3333/api/pecas/${pecaId}/aeronaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aeronaveCodigo })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao associar');
      }
      
      await carregarPecas();
      setAssociandoId(null);
      alert('Aeronave associada com sucesso!');
    } catch (error) {
      console.error('Erro ao associar aeronave:', error);
    }
  };

  const handleRemoverAssociacao = async (pecaId: string, aeronaveCodigo: string) => {
    try {
      const response = await fetch(`http://localhost:3333/api/pecas/${pecaId}/aeronaves/${aeronaveCodigo}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Erro ao remover associação');
      }
      
      await carregarPecas();
      alert('Associação removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover associação:', error);
      alert('Erro ao remover associação');
    }
  };

  const getStatusLabel = (status: StatusPeca) => {
    const labels = {
      [StatusPeca.EM_PRODUCAO]: 'Em Produção',
      [StatusPeca.EM_TRANSPORTE]: 'Em Transporte',
      [StatusPeca.PRONTA]: 'Pronta'
    };
    return labels[status];
  };

  const getTipoLabel = (tipo: TipoPeca) => {
    return tipo === TipoPeca.NACIONAL ? 'Nacional' : 'Importada';
  };

  if (loading) {
    return (
      <div className={styles.pecas}>
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
    <div className={styles.pecas}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Gerenciamento de Peças</h2>
            <button className={styles.createButton} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancelar' : '+ Nova Peça'}
            </button>
          </div>

          {showForm && (
            <CadastroPeca 
              onSalvar={handleSalvar} 
              onCancelar={() => setShowForm(false)}
              onAtualizar={handleAtualizar}
            />
          )}

          <div className={styles.listContainer}>
            {pecas.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>Nenhuma peça cadastrada.</p>
            ) : (
              <div>
                {pecas.map((peca) => (
                  <div key={peca.id} className={styles.pecaCard}>
                    <div className={styles.pecaHeader}>
                      <div className={styles.pecaInfo}>
                        <h3>{peca.nome}</h3>
                        <span className={`${styles.statusBadge} ${styles[peca.status.toLowerCase()]}`}>
                          {getStatusLabel(peca.status)}
                        </span>
                      </div>
                      <div className={styles.pecaActions}>
                        <select
                          value={peca.status}
                          onChange={(e) => handleUpdateStatus(peca.id, e.target.value as StatusPeca)}
                          className={styles.statusSelect}
                        >
                          <option value={StatusPeca.EM_PRODUCAO}>Em Produção</option>
                          <option value={StatusPeca.EM_TRANSPORTE}>Em Transporte</option>
                          <option value={StatusPeca.PRONTA}>Pronta</option>
                        </select>
                        <button onClick={() => handleDelete(peca.id)} className={styles.deleteButton}>
                          Remover Peça
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.pecaDetails}>
                      <p><strong>Tipo:</strong> {getTipoLabel(peca.tipo)}</p>
                      <p><strong>Fornecedor:</strong> {peca.fornecedor}</p>
                    </div>
                    
                    <div className={styles.aeronavesSection}>
                      <div className={styles.aeronavesHeader}>
                        <strong>Aeronaves que utilizam esta peça:</strong>
                        {associandoId === peca.id ? (
                          <select
                            onChange={(e) => handleAssociarAeronave(peca.id, e.target.value)}
                            defaultValue=""
                            className={styles.aeronaveSelect}
                            autoFocus
                          >
                            <option value="">Selecione uma aeronave</option>
                            {aeronaves.map(a => (
                              <option key={a.codigo} value={a.codigo}>{a.modelo} ({a.codigo})</option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={() => setAssociandoId(peca.id)}
                            className={styles.associarButton}
                          >
                            + Associar Aeronave
                          </button>
                        )}
                      </div>
                      
                      {peca.aeronaves && peca.aeronaves.length > 0 ? (
                        <div className={styles.aeronavesList}>
                          {peca.aeronaves.map((aeronave) => (
                            <div key={aeronave.codigo} className={styles.aeronaveItem}>
                              <span className={styles.aeronaveNome}>{aeronave.modelo}</span>
                              <span className={styles.aeronaveCodigo}> ({aeronave.codigo})</span>
                              <button
                                onClick={() => handleRemoverAssociacao(peca.id, aeronave.codigo)}
                                className={styles.removerAssociacaoButton}
                                title="Remover associação"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={styles.semAeronaves}>Nenhuma aeronave associada a esta peça</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pecas;