import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { Teste, TipoTeste, ResultadoTeste, Aeronave } from '../../types';
import { testeAPI, aeronaveAPI } from '../../services/api';
import styles from './Testes.module.css';

const Testes: React.FC = () => {
  const [testes, setTestes] = useState<Teste[]>([]);
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    tipo: TipoTeste.ELETRICO,
    resultado: ResultadoTeste.APROVADO,
    aeronaveCodigo: ''
  });
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [testesData, aeronavesData] = await Promise.all([
        testeAPI.listar(),
        aeronaveAPI.listar()
      ]);
      setTestes(testesData);
      setAeronaves(aeronavesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.aeronaveCodigo) {
      setMensagem({ texto: 'Selecione uma aeronave', tipo: 'error' });
      setTimeout(() => setMensagem(null), 3000);
      return;
    }
    
    try {
      await testeAPI.criar(formData);
      await carregarDados();
      setShowForm(false);
      
      const tipoLabel = getTipoLabel(formData.tipo);
      const resultadoLabel = formData.resultado === ResultadoTeste.APROVADO ? 'Aprovado' : 'Reprovado';
      setMensagem({ texto: `Teste ${tipoLabel} registrado como ${resultadoLabel} com sucesso!`, tipo: 'success' });
      
      setFormData({
        tipo: TipoTeste.ELETRICO,
        resultado: ResultadoTeste.APROVADO,
        aeronaveCodigo: ''
      });
      
      setTimeout(() => setMensagem(null), 3000);
    } catch (error) {
      console.error('Erro ao registrar teste:', error);
      setMensagem({ texto: 'Erro ao registrar teste', tipo: 'error' });
      setTimeout(() => setMensagem(null), 3000);
    }
  };

  const getTipoLabel = (tipo: TipoTeste) => {
    const labels = {
      [TipoTeste.ELETRICO]: 'Elétrico',
      [TipoTeste.HIDRAULICO]: 'Hidráulico',
      [TipoTeste.AERODINAMICO]: 'Aerodinâmico'
    };
    return labels[tipo];
  };

  const getResultadoLabel = (resultado: ResultadoTeste) => {
    return resultado === ResultadoTeste.APROVADO ? 'Aprovado' : 'Reprovado';
  };

  const testesPorAeronave = testes.reduce((acc, teste) => {
    if (!acc[teste.aeronaveCodigo]) {
      acc[teste.aeronaveCodigo] = [];
    }
    acc[teste.aeronaveCodigo].push(teste);
    return acc;
  }, {} as Record<string, Teste[]>);

  if (loading) {
    return (
      <div className={styles.testes}>
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
    <div className={styles.testes}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Testes de Qualidade</h2>
            <button
              className={styles.createButton}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : '+ Novo Teste'}
            </button>
          </div>

          {mensagem && (
            <div className={`${styles.mensagem} ${styles[mensagem.tipo]}`}>
              {mensagem.texto}
            </div>
          )}

          {showForm && (
            <div className={styles.formContainer}>
              <h3>Registrar Novo Teste</h3>
              <p className={styles.formHint}>
                Cada aeronave pode ter apenas um resultado por tipo de teste. 
                Um novo teste do mesmo tipo substituirá o resultado anterior.
              </p>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Aeronave *</label>
                  <select
                    value={formData.aeronaveCodigo}
                    onChange={(e) => setFormData({ ...formData, aeronaveCodigo: e.target.value })}
                    required
                  >
                    <option value="">Selecione uma aeronave</option>
                    {aeronaves.map(a => (
                      <option key={a.codigo} value={a.codigo}>{a.modelo} ({a.codigo})</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Tipo de Teste *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoTeste })}
                  >
                    <option value={TipoTeste.ELETRICO}>Elétrico</option>
                    <option value={TipoTeste.HIDRAULICO}>Hidráulico</option>
                    <option value={TipoTeste.AERODINAMICO}>Aerodinâmico</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Resultado *</label>
                  <select
                    value={formData.resultado}
                    onChange={(e) => setFormData({ ...formData, resultado: e.target.value as ResultadoTeste })}
                  >
                    <option value={ResultadoTeste.APROVADO}>Aprovado</option>
                    <option value={ResultadoTeste.REPROVADO}>Reprovado</option>
                  </select>
                </div>
                <button type="submit" className={styles.submitButton}>Registrar Teste</button>
              </form>
            </div>
          )}

          <div className={styles.listContainer}>
            {testes.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>Nenhum teste registrado.</p>
            ) : (
              <div>
                {Object.entries(testesPorAeronave).map(([aeronaveCodigo, testesDaAeronave]) => {
                  const aeronave = aeronaves.find(a => a.codigo === aeronaveCodigo);
                  return (
                    <div key={aeronaveCodigo} className={styles.aeronaveGroup}>
                      <h3 className={styles.aeronaveTitle}>
                        {aeronave?.modelo || aeronaveCodigo} ({aeronaveCodigo})
                      </h3>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Tipo de Teste</th>
                            <th>Resultado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testesDaAeronave.map((teste) => (
                            <tr key={teste.id}>
                              <td>{getTipoLabel(teste.tipo)}</td>
                              <td>
                                <span className={`${styles.resultBadge} ${styles[teste.resultado.toLowerCase()]}`}>
                                  {getResultadoLabel(teste.resultado)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testes;