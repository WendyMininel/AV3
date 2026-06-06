import React, { useState } from 'react';
import { Peca, TipoPeca, StatusPeca } from '../../types';
import { pecaAPI } from '../../services/api';
import styles from './CadastroPeca.module.css';

interface CadastroPecaProps {
  onSalvar: (peca: Peca) => void;
  onCancelar: () => void;
  onAtualizar?: (peca: Peca) => void;
}

const CadastroPeca: React.FC<CadastroPecaProps> = ({ onSalvar, onCancelar, onAtualizar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: TipoPeca.NACIONAL,
    fornecedor: '',
    status: StatusPeca.EM_PRODUCAO
  });
  const [erros, setErros] = useState({
    nome: '',
    fornecedor: ''
  });
  const [loading, setLoading] = useState(false);
  const [verificando, setVerificando] = useState(false);

  const validarNome = (nome: string): boolean => {
    if (!nome.trim()) {
      setErros(prev => ({ ...prev, nome: 'Nome da peça é obrigatório' }));
      return false;
    }
    if (nome.trim().length < 3) {
      setErros(prev => ({ ...prev, nome: 'Nome deve ter pelo menos 3 caracteres' }));
      return false;
    }
    setErros(prev => ({ ...prev, nome: '' }));
    return true;
  };

  const validarFornecedor = (fornecedor: string): boolean => {
    if (!fornecedor.trim()) {
      setErros(prev => ({ ...prev, fornecedor: 'Fornecedor é obrigatório' }));
      return false;
    }
    if (fornecedor.trim().length < 2) {
      setErros(prev => ({ ...prev, fornecedor: 'Fornecedor deve ter pelo menos 2 caracteres' }));
      return false;
    }
    setErros(prev => ({ ...prev, fornecedor: '' }));
    return true;
  };

  const verificarPecaExistente = async (nome: string, fornecedor: string): Promise<any> => {
    try {
      const response = await fetch(`http://localhost:3333/api/pecas/buscar?nome=${encodeURIComponent(nome)}&fornecedor=${encodeURIComponent(fornecedor)}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Erro ao verificar peça:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNomeValido = validarNome(formData.nome);
    const isFornecedorValido = validarFornecedor(formData.fornecedor);
    
    if (isNomeValido && isFornecedorValido) {
      setVerificando(true);
      
      try {
        const pecaExistente = await verificarPecaExistente(formData.nome, formData.fornecedor);
        
        if (pecaExistente) {
          const userChoice = window.confirm(
            `Já existe uma peça "${pecaExistente.nome}" do fornecedor "${pecaExistente.fornecedor}".\n\n` +
            `Status atual: ${pecaExistente.status}\n\n` +
            `Clique em "OK" para atualizar esta peça existente.\n` +
            `Clique em "Cancelar" para criar uma nova peça mesmo assim.`
          );
          
          if (userChoice) {
            const pecaAtualizada = {
              ...pecaExistente,
              tipo: formData.tipo,
              status: formData.status
            };
            
            await fetch(`http://localhost:3333/api/pecas/${pecaExistente.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nome: formData.nome,
                tipo: formData.tipo,
                fornecedor: formData.fornecedor,
                status: formData.status
              })
            });
            
            if (onAtualizar) {
              onAtualizar(pecaAtualizada);
            } else {
              onSalvar(pecaAtualizada);
            }
            
            setFormData({
              nome: '',
              tipo: TipoPeca.NACIONAL,
              fornecedor: '',
              status: StatusPeca.EM_PRODUCAO
            });
            return;
          }
        }
        
        const novaPeca: Peca = {
          id: Date.now().toString(),
          nome: formData.nome,
          tipo: formData.tipo,
          fornecedor: formData.fornecedor,
          status: formData.status
        };
        
        onSalvar(novaPeca);
        
        setFormData({
          nome: '',
          tipo: TipoPeca.NACIONAL,
          fornecedor: '',
          status: StatusPeca.EM_PRODUCAO
        });
        
      } catch (error) {
        console.error('Erro ao processar peça:', error);
        alert('Erro ao processar peça');
      } finally {
        setVerificando(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Cadastrar Nova Peça</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="nome">Nome da Peça *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={(e) => {
              setFormData({ ...formData, nome: e.target.value });
              validarNome(e.target.value);
            }}
            placeholder="Digite o nome da peça"
            className={erros.nome ? styles.errorInput : ''}
          />
          {erros.nome && <span className={styles.errorMessage}>{erros.nome}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tipo">Tipo *</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoPeca })}
          >
            <option value={TipoPeca.NACIONAL}>Nacional</option>
            <option value={TipoPeca.IMPORTADA}>Importada</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fornecedor">Fornecedor *</label>
          <input
            type="text"
            id="fornecedor"
            name="fornecedor"
            value={formData.fornecedor}
            onChange={(e) => {
              setFormData({ ...formData, fornecedor: e.target.value });
              validarFornecedor(e.target.value);
            }}
            placeholder="Digite o nome do fornecedor"
            className={erros.fornecedor ? styles.errorInput : ''}
          />
          {erros.fornecedor && <span className={styles.errorMessage}>{erros.fornecedor}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Status Inicial *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusPeca })}
          >
            <option value={StatusPeca.EM_PRODUCAO}>Em Produção</option>
            <option value={StatusPeca.EM_TRANSPORTE}>Em Transporte</option>
            <option value={StatusPeca.PRONTA}>Pronta</option>
          </select>
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.submitButton} disabled={verificando}>
            {verificando ? 'Verificando...' : 'Cadastrar Peça'}
          </button>
          <button type="button" onClick={onCancelar} className={styles.cancelButton}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroPeca;