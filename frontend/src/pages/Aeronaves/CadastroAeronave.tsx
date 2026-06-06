import React, { useState } from 'react';
import { Aeronave, TipoAeronave } from '../../types';
import styles from './CadastroAeronave.module.css';

interface CadastroAeronaveProps {
  onSalvar: (aeronave: Aeronave) => void;
}

const CadastroAeronave: React.FC<CadastroAeronaveProps> = ({ onSalvar }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    modelo: '',
    tipo: TipoAeronave.COMERCIAL,
    capacidade: 0,
    alcance: 0
  });
  const [erros, setErros] = useState({
    codigo: '',
    modelo: '',
    capacidade: '',
    alcance: ''
  });

  const validarCodigo = (codigo: string): boolean => {
    if (!codigo.trim()) {
      setErros(prev => ({ ...prev, codigo: 'Código é obrigatório' }));
      return false;
    }
    if (codigo.length < 2) {
      setErros(prev => ({ ...prev, codigo: 'Código deve ter pelo menos 2 caracteres' }));
      return false;
    }
    setErros(prev => ({ ...prev, codigo: '' }));
    return true;
  };

  const validarModelo = (modelo: string): boolean => {
    if (!modelo.trim()) {
      setErros(prev => ({ ...prev, modelo: 'Modelo é obrigatório' }));
      return false;
    }
    if (modelo.length < 2) {
      setErros(prev => ({ ...prev, modelo: 'Modelo deve ter pelo menos 2 caracteres' }));
      return false;
    }
    setErros(prev => ({ ...prev, modelo: '' }));
    return true;
  };

  const validarCapacidade = (capacidade: number): boolean => {
    if (capacidade === null || capacidade === undefined || capacidade === 0) {
      setErros(prev => ({ ...prev, capacidade: 'Capacidade é obrigatória e deve ser no mínimo 1' }));
      return false;
    }
    if (!Number.isInteger(capacidade)) {
      setErros(prev => ({ ...prev, capacidade: 'Capacidade deve ser um número inteiro' }));
      return false;
    }
    if (capacidade < 1) {
      setErros(prev => ({ ...prev, capacidade: 'Capacidade deve ser no mínimo 1 passageiro' }));
      return false;
    }
    setErros(prev => ({ ...prev, capacidade: '' }));
    return true;
  };

  const validarAlcance = (alcance: number): boolean => {
    if (alcance === null || alcance === undefined) {
      setErros(prev => ({ ...prev, alcance: 'Alcance é obrigatório' }));
      return false;
    }
    if (!Number.isInteger(alcance)) {
      setErros(prev => ({ ...prev, alcance: 'Alcance deve ser um número inteiro' }));
      return false;
    }
    if (alcance < 10) {
      setErros(prev => ({ ...prev, alcance: 'Alcance mínimo é 10 km' }));
      return false;
    }
    setErros(prev => ({ ...prev, alcance: '' }));
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isCodigoValido = validarCodigo(formData.codigo);
    const isModeloValido = validarModelo(formData.modelo);
    const isCapacidadeValida = validarCapacidade(formData.capacidade);
    const isAlcanceValido = validarAlcance(formData.alcance);
    
    if (isCodigoValido && isModeloValido && isCapacidadeValida && isAlcanceValido) {
      onSalvar(formData as Aeronave);
      setFormData({
        codigo: '',
        modelo: '',
        tipo: TipoAeronave.COMERCIAL,
        capacidade: 0,
        alcance: 0
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'capacidade' || name === 'alcance') {
      const numValue = value === '' ? 0 : Number(value);
      setFormData({
        ...formData,
        [name]: numValue
      });
      
      if (name === 'capacidade') validarCapacidade(numValue);
      if (name === 'alcance') validarAlcance(numValue);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      
      if (name === 'codigo') validarCodigo(value);
      if (name === 'modelo') validarModelo(value);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.formTitle}>Cadastrar Nova Aeronave</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="codigo">Código *</label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            placeholder="Digite o código da aeronave"
            className={erros.codigo ? styles.errorInput : ''}
          />
          {erros.codigo && <span className={styles.errorMessage}>{erros.codigo}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="modelo">Modelo *</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            placeholder="Digite o modelo da aeronave"
            className={erros.modelo ? styles.errorInput : ''}
          />
          {erros.modelo && <span className={styles.errorMessage}>{erros.modelo}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tipo">Tipo *</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
          >
            <option value={TipoAeronave.COMERCIAL}>Comercial</option>
            <option value={TipoAeronave.MILITAR}>Militar</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="capacidade">Capacidade</label>
          <input
            type="number"
            id="capacidade"
            name="capacidade"
            value={formData.capacidade === 0 ? '' : formData.capacidade}
            onChange={handleChange}
            min="1"
            step="1"
            placeholder="Digite a capacidade"
            className={erros.capacidade ? styles.errorInput : ''}
          />
          {erros.capacidade && <span className={styles.errorMessage}>{erros.capacidade}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="alcance">Alcance (km) </label>
          <input
            type="number"
            id="alcance"
            name="alcance"
            value={formData.alcance === 0 ? '' : formData.alcance}
            onChange={handleChange}
            min="10"
            step="1"
            placeholder="Digite o alcance"
            className={erros.alcance ? styles.errorInput : ''}
          />
          {erros.alcance && <span className={styles.errorMessage}>{erros.alcance}</span>}
        </div>

        <button type="submit" className={styles.submitButton}>
          Cadastrar Aeronave
        </button>
      </form>
    </div>
  );
};

export default CadastroAeronave;