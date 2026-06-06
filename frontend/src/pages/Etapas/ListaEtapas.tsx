import React, { useState } from 'react';
import { Etapa, StatusEtapa, Funcionario, Aeronave } from '../../types';
import styles from './ListaEtapas.module.css';

interface ListaEtapasProps {
  etapas: Etapa[];
  onIniciar: (index: number) => Promise<void>;
  onFinalizar: (index: number) => Promise<void>;
  onAssociarFuncionario: (etapaId: string, funcionario: Funcionario) => Promise<void>;
  onRemoverFuncionario: (etapaId: string, funcionarioId: string) => Promise<void>;
  onExcluirEtapa: (etapaId: string) => Promise<void>;
  funcionarios: Funcionario[];
  aeronaves: Aeronave[];
}

const ListaEtapas: React.FC<ListaEtapasProps> = ({ 
  etapas, 
  onIniciar, 
  onFinalizar, 
  onAssociarFuncionario,
  onRemoverFuncionario,
  onExcluirEtapa,
  funcionarios,
  aeronaves
}) => {
  const [etapaSelecionada, setEtapaSelecionada] = useState<string | null>(null);
  const [filtroAeronave, setFiltroAeronave] = useState<string>('');
  const [erroMensagem, setErroMensagem] = useState<string>('');
  const [loading, setLoading] = useState<string | null>(null);
  const [associando, setAssociando] = useState<string | null>(null);

  const getStatusLabel = (status: StatusEtapa) => {
    const labels = {
      [StatusEtapa.PENDENTE]: 'Pendente',
      [StatusEtapa.ANDAMENTO]: 'Em Andamento',
      [StatusEtapa.CONCLUIDA]: 'Concluída'
    };
    return labels[status];
  };

  const getStatusClass = (status: StatusEtapa) => {
    const classes = {
      [StatusEtapa.PENDENTE]: styles.pendente,
      [StatusEtapa.ANDAMENTO]: styles.andamento,
      [StatusEtapa.CONCLUIDA]: styles.concluida
    };
    return classes[status];
  };

  const getNomeAeronave = (codigo: string) => {
    const aeronave = aeronaves.find(a => a.codigo === codigo);
    return aeronave ? `${aeronave.modelo} (${codigo})` : codigo;
  };

  const handleIniciar = async (index: number) => {
    setErroMensagem('');
    setLoading(etapas[index].id);
    try {
      await onIniciar(index);
    } catch (error: any) {
      setErroMensagem(error.message || 'Erro ao iniciar etapa');
    } finally {
      setLoading(null);
    }
  };

  const handleFinalizar = async (index: number) => {
    setErroMensagem('');
    setLoading(etapas[index].id);
    try {
      await onFinalizar(index);
    } catch (error: any) {
      setErroMensagem(error.message || 'Erro ao finalizar etapa');
    } finally {
      setLoading(null);
    }
  };

  const handleExcluirEtapa = async (etapaId: string, etapaNome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a etapa "${etapaNome}"?\n\nTodas as associações com funcionários também serão removidas.`)) {
      setErroMensagem('');
      setLoading(etapaId);
      try {
        await onExcluirEtapa(etapaId);
      } catch (error: any) {
        setErroMensagem(error.message || 'Erro ao excluir etapa');
      } finally {
        setLoading(null);
      }
    }
  };

  const handleRemoverFuncionario = async (etapaId: string, funcionarioId: string, funcionarioNome: string) => {
    if (window.confirm(`Remover o funcionário "${funcionarioNome}" desta etapa?`)) {
      setErroMensagem('');
      setLoading(`${etapaId}_${funcionarioId}`);
      try {
        await fetch(`http://localhost:3333/api/etapas/${etapaId}/funcionarios/${funcionarioId}`, {
          method: 'DELETE'
        });
        await onRemoverFuncionario(etapaId, funcionarioId);
      } catch (error: any) {
        setErroMensagem(error.message || 'Erro ao remover funcionário');
      } finally {
        setLoading(null);
      }
    }
  };

  const handleAssociar = async (etapaId: string, funcionarioId: string) => {
    if (!funcionarioId) return;
    setAssociando(etapaId);
    try {
      const func = funcionarios.find(f => f.id === funcionarioId);
      if (func) {
        await onAssociarFuncionario(etapaId, func);
        setEtapaSelecionada(null);
      }
    } catch (error: any) {
      setErroMensagem(error.message || 'Erro ao associar funcionário');
    } finally {
      setAssociando(null);
    }
  };

  const etapasFiltradas = filtroAeronave 
    ? etapas.filter(e => e.aeronaveCodigo === filtroAeronave)
    : etapas;

  const etapasPorAeronave = etapasFiltradas.reduce((acc, etapa) => {
    if (!acc[etapa.aeronaveCodigo]) {
      acc[etapa.aeronaveCodigo] = [];
    }
    acc[etapa.aeronaveCodigo].push(etapa);
    return acc;
  }, {} as Record<string, Etapa[]>);

  if (etapas.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Nenhuma etapa cadastrada.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {erroMensagem && (
        <div className={styles.errorMessage}>
          {erroMensagem}
        </div>
      )}

      <div className={styles.filterContainer}>
        <label>Filtrar por aeronave:</label>
        <select
          value={filtroAeronave}
          onChange={(e) => setFiltroAeronave(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Todas as aeronaves</option>
          {aeronaves.map(aeronave => (
            <option key={aeronave.codigo} value={aeronave.codigo}>
              {aeronave.modelo} ({aeronave.codigo})
            </option>
          ))}
        </select>
      </div>

      {Object.entries(etapasPorAeronave).map(([aeronaveCodigo, etapasDaAeronave]) => (
        <div key={aeronaveCodigo} className={styles.aeronaveGroup}>
          <h3 className={styles.aeronaveTitle}>
            {getNomeAeronave(aeronaveCodigo)}
          </h3>
          <div className={styles.timeline}>
            {etapasDaAeronave.map((etapa, idx) => {
              const isPreviousCompleted = idx === 0 || etapasDaAeronave[idx - 1]?.status === StatusEtapa.CONCLUIDA;
              const canStart = etapa.status === StatusEtapa.PENDENTE && isPreviousCompleted;
              
              return (
                <div key={etapa.id} className={styles.timelineItem}>
                  <div className={`${styles.timelineMarker} ${getStatusClass(etapa.status)}`}>
                    {idx + 1}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.etapaHeader}>
                      <h3>{etapa.nome}</h3>
                      <div className={styles.etapaHeaderActions}>
                        <span className={`${styles.statusBadge} ${getStatusClass(etapa.status)}`}>
                          {getStatusLabel(etapa.status)}
                        </span>
                        <button
                          onClick={() => handleExcluirEtapa(etapa.id, etapa.nome)}
                          className={styles.excluirEtapaButton}
                          disabled={loading === etapa.id}
                          title="Excluir etapa"
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                    
                    <p className={styles.etapaPrazo}>
                      Prazo: {new Date(etapa.prazo).toLocaleDateString('pt-BR')}
                    </p>
                    
                    {etapa.funcionarios && etapa.funcionarios.length > 0 && (
                      <div className={styles.funcionariosList}>
                        <strong>Funcionários Responsáveis:</strong>
                        <div className={styles.funcionariosItems}>
                          {etapa.funcionarios.map(f => (
                            <div key={f.id} className={styles.funcionarioItem}>
                              <span className={styles.funcionarioNome}>{f.nome}</span>
                              <span className={styles.funcionarioNivel}> ({f.nivelPermissao})</span>
                              <button
                                onClick={() => handleRemoverFuncionario(etapa.id, f.id, f.nome)}
                                className={styles.removerFuncionarioButton}
                                disabled={loading === `${etapa.id}_${f.id}`}
                                title="Remover funcionário"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!etapa.funcionarios || etapa.funcionarios.length === 0) && (
                      <p className={styles.semFuncionarios}>
                        Nenhum funcionário associado a esta etapa
                      </p>
                    )}

                    <div className={styles.etapaActions}>
                      {etapa.status === StatusEtapa.PENDENTE && (
                        <button
                          onClick={() => handleIniciar(idx)}
                          className={`${styles.startButton} ${!canStart ? styles.disabled : ''}`}
                          disabled={loading === etapa.id || !canStart}
                        >
                          {loading === etapa.id ? 'Processando...' : 'Iniciar Etapa'}
                        </button>
                      )}
                      
                      {etapa.status === StatusEtapa.ANDAMENTO && (
                        <button
                          onClick={() => handleFinalizar(idx)}
                          className={styles.finishButton}
                          disabled={loading === etapa.id}
                        >
                          {loading === etapa.id ? 'Processando...' : 'Finalizar Etapa'}
                        </button>
                      )}

                      {etapa.status !== StatusEtapa.CONCLUIDA && (
                        <div className={styles.associarSection}>
                          {etapaSelecionada === etapa.id ? (
                            <select
                              onChange={(e) => handleAssociar(etapa.id, e.target.value)}
                              defaultValue=""
                              className={styles.funcionarioSelect}
                              disabled={associando === etapa.id}
                              autoFocus
                            >
                              <option value="" disabled>Selecione um funcionário</option>
                              {funcionarios.map(f => (
                                <option key={f.id} value={f.id}>{f.nome} - {f.nivelPermissao}</option>
                              ))}
                            </select>
                          ) : (
                            <button
                              onClick={() => setEtapaSelecionada(etapa.id)}
                              className={styles.associarButton}
                            >
                              + Associar Funcionário
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaEtapas;