import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { useAuth } from '../../contexts/AuthContext';
import { NivelPermissao } from '../../types';
import { funcionarioAPI } from '../../services/api';
import styles from './Perfil.module.css';

interface FuncionarioResponse {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  nivelPermissao: string;
}

const Perfil: React.FC = () => {
  const { usuario, logout, atualizarUsuario } = useAuth();
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: usuario?.funcionario.nome || '',
    telefone: usuario?.funcionario.telefone || '',
    endereco: usuario?.funcionario.endereco || '',
    usuario: usuario?.funcionario.usuario || '',
    senha: '',
    confirmarSenha: ''
  });
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [erroTelefone, setErroTelefone] = useState('');

  const getPermissaoLabel = (nivel: NivelPermissao) => {
    const labels = {
      [NivelPermissao.ADMINISTRADOR]: 'Administrador',
      [NivelPermissao.ENGENHEIRO]: 'Engenheiro',
      [NivelPermissao.OPERADOR]: 'Operador'
    };
    return labels[nivel];
  };

  // Função para formatar telefone
  const formatarTelefone = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '');
    
    if (numeros.length === 0) return '';
    
    if (numeros.length <= 2) {
      return `(${numeros}`;
    }
    if (numeros.length <= 6) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }
    if (numeros.length <= 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  };

  // Função para validar telefone
  const validarTelefone = (telefone: string): boolean => {
    const numeros = telefone.replace(/\D/g, '');
    if (numeros.length === 0) {
      setErroTelefone('');
      return true;
    }
    if (numeros.length !== 10 && numeros.length !== 11) {
      setErroTelefone('Telefone deve ter 10 ou 11 dígitos (com DDD)');
      return false;
    }
    setErroTelefone('');
    return true;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const telefoneFormatado = formatarTelefone(e.target.value);
    setFormData({ ...formData, telefone: telefoneFormatado });
    validarTelefone(telefoneFormatado);
  };

  const handleSalvar = async () => {
    if (!usuario) return;
    
    if (formData.senha && formData.senha !== formData.confirmarSenha) {
      setMensagem('As senhas não coincidem!');
      setTimeout(() => setMensagem(''), 3000);
      return;
    }

    if (!validarTelefone(formData.telefone)) {
      setMensagem('Telefone inválido!');
      setTimeout(() => setMensagem(''), 3000);
      return;
    }

    setLoading(true);

    try {
      const dadosAtualizar: any = {
        nome: formData.nome,
        telefone: formData.telefone,
        endereco: formData.endereco,
        usuario: formData.usuario
      };
      
      if (formData.senha && formData.senha.trim() !== '') {
        dadosAtualizar.senha = formData.senha;
      }
      
      const funcionarioAtualizado = await funcionarioAPI.atualizarPerfil(usuario.funcionario.id, dadosAtualizar) as FuncionarioResponse;
      
      const usuarioAtualizado = {
        ...usuario,
        funcionario: {
          ...usuario.funcionario,
          nome: funcionarioAtualizado.nome,
          telefone: funcionarioAtualizado.telefone,
          endereco: funcionarioAtualizado.endereco,
          usuario: funcionarioAtualizado.usuario,
          senha: formData.senha || usuario.funcionario.senha
        }
      };
      
      atualizarUsuario(usuarioAtualizado);
      
      setMensagem('Perfil atualizado com sucesso!');
      setEditando(false);
      setFormData({ ...formData, senha: '', confirmarSenha: '' });
      
      setTimeout(() => {
        setMensagem('');
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMensagem('Erro ao atualizar perfil. Tente novamente.');
      setTimeout(() => setMensagem(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) return null;

  return (
    <div className={styles.perfil}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Meu Perfil</h2>
            {!editando && (
              <button 
                className={styles.editButton}
                onClick={() => setEditando(true)}
              >
                Editar Perfil
              </button>
            )}
          </div>

          <div className={styles.profileCard}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                {usuario.funcionario.nome.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userInfo}>
                <h3>{usuario.funcionario.nome}</h3>
                <span className={`${styles.permissionBadge} ${styles[usuario.funcionario.nivelPermissao.toLowerCase()]}`}>
                  {getPermissaoLabel(usuario.funcionario.nivelPermissao)}
                </span>
              </div>
            </div>

            {mensagem && (
              <div className={styles.successMessage}>
                {mensagem}
              </div>
            )}

            {editando ? (
              <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formGroup}>
                  <label>Nome Completo</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Telefone (formato: (XX) XXXXX-XXXX)</label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={handleTelefoneChange}
                    placeholder="(11) 99999-9999"
                    maxLength={16}
                  />
                  {erroTelefone && <span className={styles.errorMessage}>{erroTelefone}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Endereço</label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Usuário</label>
                  <input
                    type="text"
                    value={formData.usuario}
                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Nova Senha</label>
                    <input
                      type="password"
                      placeholder="Deixe em branco para manter a atual"
                      value={formData.senha}
                      onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Confirmar Nova Senha</label>
                    <input
                      type="password"
                      placeholder="Digite a senha novamente"
                      value={formData.confirmarSenha}
                      onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <button 
                    type="button" 
                    onClick={handleSalvar} 
                    className={styles.saveButton}
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditando(false);
                      setFormData({
                        nome: usuario.funcionario.nome,
                        telefone: usuario.funcionario.telefone,
                        endereco: usuario.funcionario.endereco,
                        usuario: usuario.funcionario.usuario,
                        senha: '',
                        confirmarSenha: ''
                      });
                      setErroTelefone('');
                    }} 
                    className={styles.cancelButton}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.infoSection}>
                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <label>Nome</label>
                    <p>{usuario.funcionario.nome}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Telefone</label>
                    <p>{usuario.funcionario.telefone || 'Não informado'}</p>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <label>Endereço</label>
                    <p>{usuario.funcionario.endereco}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Usuário</label>
                    <p>{usuario.funcionario.usuario}</p>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <label>Nível de Permissão</label>
                    <p>{getPermissaoLabel(usuario.funcionario.nivelPermissao)}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>ID do Funcionário</label>
                    <p>{usuario.funcionario.id}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;