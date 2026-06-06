import React, { useState } from 'react';
import { Etapa, StatusEtapa, Aeronave } from '../../types';
import styles from './CadastroEtapa.module.css';

interface CadastroEtapaProps {
  onSalvar: (etapa: Etapa) => void;
  onCancelar: () => void;
  aeronaves: Aeronave[];
}

const CadastroEtapa: React.FC<CadastroEtapaProps> = ({ onSalvar, onCancelar, aeronaves }) => {
  const [formData, setFormData] = useState({
    nome: '',
    prazo: '',
    aeronaveCodigo: ''
  });
  const [erros, setErros] = useState({
    nome: '',
    prazo: '',
    aeronaveCodigo: ''
  });

  const validarNome = (nome: string): boolean => {
    if (!nome.trim()) {
      setErros(prev => ({ ...prev, nome: 'Nome da etapa é obrigatório' }));
      return false;
    }
    if (nome.trim().length < 3) {
      setErros(prev => ({ ...prev, nome: 'Nome deve ter pelo menos 3 caracteres' }));
      return false;
    }
    setErros(prev => ({ ...prev, nome: '' }));
    return true;
  };

  const validarData = (data: string): boolean => {
    if (!data) {
      setErros(prev => ({ ...prev, prazo: 'Prazo é obrigatório' }));
      return false;
    }

    const dataObj = new Date(data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataObj < hoje) {
      setErros(prev => ({ ...prev, prazo: 'Prazo não pode ser anterior à data atual' }));
      return false;
    }
    
    setErros(prev => ({ ...prev, prazo: '' }));
    return true;
  };

  const validarAeronave = (codigo: string): boolean => {
    if (!codigo) {
      setErros(prev => ({ ...prev, aeronaveCodigo: 'Selecione uma aeronave' }));
      return false;
    }
    setErros(prev => ({ ...prev, aeronaveCodigo: '' }));
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNomeValido = validarNome(formData.nome);
    const isDataValida = validarData(formData.prazo);
    const isAeronaveValida = validarAeronave(formData.aeronaveCodigo);
    
    if (isNomeValido && isDataValida && isAeronaveValida) {
      const novaEtapa: Etapa = {
        id: Date.now().toString(),
        nome: formData.nome,
        prazo: formData.prazo,
        status: StatusEtapa.PENDENTE,
        aeronaveCodigo: formData.aeronaveCodigo,
        funcionarios: []
      };
      onSalvar(novaEtapa);
      setFormData({ nome: '', prazo: '', aeronaveCodigo: '' });
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Cadastrar Nova Etapa</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="aeronave">Aeronave *</label>
          <select
            id="aeronave"
            name="aeronave"
            value={formData.aeronaveCodigo}
            onChange={(e) => {
              setFormData({ ...formData, aeronaveCodigo: e.target.value });
              validarAeronave(e.target.value);
            }}
            className={erros.aeronaveCodigo ? styles.errorInput : ''}
          >
            <option value="">Selecione uma aeronave</option>
            {aeronaves.map((aeronave) => (
              <option key={aeronave.codigo} value={aeronave.codigo}>
                {aeronave.modelo} ({aeronave.codigo})
              </option>
            ))}
          </select>
          {erros.aeronaveCodigo && <span className={styles.errorMessage}>{erros.aeronaveCodigo}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="nome">Nome da Etapa *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={(e) => {
              setFormData({ ...formData, nome: e.target.value });
              validarNome(e.target.value);
            }}
            placeholder="Ex: Montagem da Asa"
            className={erros.nome ? styles.errorInput : ''}
          />
          {erros.nome && <span className={styles.errorMessage}>{erros.nome}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="prazo">Prazo de Conclusão *</label>
          <input
            type="date"
            id="prazo"
            name="prazo"
            value={formData.prazo}
            onChange={(e) => {
              setFormData({ ...formData, prazo: e.target.value });
              validarData(e.target.value);
            }}
            min={new Date().toISOString().split('T')[0]}
            className={erros.prazo ? styles.errorInput : ''}
          />
          {erros.prazo && <span className={styles.errorMessage}>{erros.prazo}</span>}
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.submitButton}>
            Cadastrar Etapa
          </button>
          <button type="button" onClick={onCancelar} className={styles.cancelButton}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroEtapa;