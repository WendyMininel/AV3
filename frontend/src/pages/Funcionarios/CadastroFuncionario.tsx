import React, { useState } from 'react';
import { Funcionario, NivelPermissao } from '../../types';
import styles from './CadastroFuncionario.module.css';

interface CadastroFuncionarioProps {
  onSalvar: (funcionario: Funcionario) => void;
  onCancelar: () => void;
  funcionariosExistentes?: Funcionario[];
}

const CadastroFuncionario: React.FC<CadastroFuncionarioProps> = ({ 
  onSalvar, 
  onCancelar,
  funcionariosExistentes = [] 
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    usuario: '',
    senha: '',
    confirmarSenha: '',
    nivelPermissao: NivelPermissao.OPERADOR
  });
  const [erros, setErros] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    usuario: '',
    senha: '',
    confirmarSenha: ''
  });

  const validarNome = (nome: string): boolean => {
    if (!nome.trim()) {
      setErros(prev => ({ ...prev, nome: 'Nome é obrigatório' }));
      return false;
    }
    if (nome.trim().length < 3) {
      setErros(prev => ({ ...prev, nome: 'Nome deve ter pelo menos 3 caracteres' }));
      return false;
    }
    const regexNome = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!regexNome.test(nome)) {
      setErros(prev => ({ ...prev, nome: 'Nome deve conter apenas letras e espaços' }));
      return false;
    }
    setErros(prev => ({ ...prev, nome: '' }));
    return true;
  };

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

  const validarTelefone = (telefone: string): boolean => {
    const numeros = telefone.replace(/\D/g, '');
    
    if (!numeros) {
      setErros(prev => ({ ...prev, telefone: 'Telefone é obrigatório' }));
      return false;
    }
    if (numeros.length !== 10 && numeros.length !== 11) {
      setErros(prev => ({ ...prev, telefone: 'Telefone deve ter 10 ou 11 dígitos (com DDD)' }));
      return false;
    }
    
    const telefoneExistente = funcionariosExistentes.some(f => 
      f.telefone.replace(/\D/g, '') === numeros
    );
    if (telefoneExistente) {
      setErros(prev => ({ ...prev, telefone: 'Este telefone já está cadastrado' }));
      return false;
    }
    
    setErros(prev => ({ ...prev, telefone: '' }));
    return true;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const telefoneFormatado = formatarTelefone(e.target.value);
    setFormData({ ...formData, telefone: telefoneFormatado });
    validarTelefone(telefoneFormatado);
  };

  const validarEndereco = (endereco: string): boolean => {
    if (!endereco.trim()) {
      setErros(prev => ({ ...prev, endereco: 'Endereço é obrigatório' }));
      return false;
    }
    if (endereco.trim().length < 5) {
      setErros(prev => ({ ...prev, endereco: 'Endereço deve ter pelo menos 5 caracteres' }));
      return false;
    }
    setErros(prev => ({ ...prev, endereco: '' }));
    return true;
  };

  const validarUsuario = (usuario: string): boolean => {
    if (!usuario.trim()) {
      setErros(prev => ({ ...prev, usuario: 'Usuário é obrigatório' }));
      return false;
    }
    if (usuario.trim().length < 3) {
      setErros(prev => ({ ...prev, usuario: 'Usuário deve ter pelo menos 3 caracteres' }));
      return false;
    }
    const regexUsuario = /^[A-Za-z0-9_]+$/;
    if (!regexUsuario.test(usuario)) {
      setErros(prev => ({ ...prev, usuario: 'Usuário deve conter apenas letras, números e _' }));
      return false;
    }
    
    const usuarioExistente = funcionariosExistentes.some(f => 
      f.usuario.toLowerCase() === usuario.toLowerCase()
    );
    if (usuarioExistente) {
      setErros(prev => ({ ...prev, usuario: 'Este usuário já está cadastrado' }));
      return false;
    }
    
    setErros(prev => ({ ...prev, usuario: '' }));
    return true;
  };

  const validarSenha = (senha: string): boolean => {
    if (!senha) {
      setErros(prev => ({ ...prev, senha: 'Senha é obrigatória' }));
      return false;
    }
    if (senha.length < 4) {
      setErros(prev => ({ ...prev, senha: 'Senha deve ter pelo menos 4 caracteres' }));
      return false;
    }
    setErros(prev => ({ ...prev, senha: '' }));
    return true;
  };

  const validarConfirmarSenha = (confirmarSenha: string): boolean => {
    if (confirmarSenha !== formData.senha) {
      setErros(prev => ({ ...prev, confirmarSenha: 'As senhas não coincidem' }));
      return false;
    }
    setErros(prev => ({ ...prev, confirmarSenha: '' }));
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNomeValido = validarNome(formData.nome);
    const isTelefoneValido = validarTelefone(formData.telefone);
    const isEnderecoValido = validarEndereco(formData.endereco);
    const isUsuarioValido = validarUsuario(formData.usuario);
    const isSenhaValida = validarSenha(formData.senha);
    const isConfirmarSenhaValida = validarConfirmarSenha(formData.confirmarSenha);
    
    if (isNomeValido && isTelefoneValido && isEnderecoValido && 
        isUsuarioValido && isSenhaValida && isConfirmarSenhaValida) {
      const novoFuncionario: Funcionario = {
        id: Date.now().toString(),
        nome: formData.nome,
        telefone: formData.telefone,
        endereco: formData.endereco,
        usuario: formData.usuario,
        senha: formData.senha,
        nivelPermissao: formData.nivelPermissao
      };
      onSalvar(novoFuncionario);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Cadastrar Novo Funcionário</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="nome">Nome Completo * (apenas letras)</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={(e) => {
              setFormData({ ...formData, nome: e.target.value });
              validarNome(e.target.value);
            }}
            placeholder="Digite o nome completo"
            className={erros.nome ? styles.errorInput : ''}
          />
          {erros.nome && <span className={styles.errorMessage}>{erros.nome}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="telefone">Telefone * (apenas números)</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleTelefoneChange}
            placeholder="(11) 99999-9999"
            maxLength={16}
            className={erros.telefone ? styles.errorInput : ''}
          />
          {erros.telefone && <span className={styles.errorMessage}>{erros.telefone}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endereco">Endereço *</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={(e) => {
              setFormData({ ...formData, endereco: e.target.value });
              validarEndereco(e.target.value);
            }}
            placeholder="Digite o endereço completo"
            className={erros.endereco ? styles.errorInput : ''}
          />
          {erros.endereco && <span className={styles.errorMessage}>{erros.endereco}</span>}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="usuario">Usuário * (letras, números e _)</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={(e) => {
                setFormData({ ...formData, usuario: e.target.value });
                validarUsuario(e.target.value);
              }}
              placeholder="Nome de usuário"
              className={erros.usuario ? styles.errorInput : ''}
            />
            {erros.usuario && <span className={styles.errorMessage}>{erros.usuario}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nivelPermissao">Nível de Permissão *</label>
            <select
              id="nivelPermissao"
              name="nivelPermissao"
              value={formData.nivelPermissao}
              onChange={(e) => setFormData({ ...formData, nivelPermissao: e.target.value as NivelPermissao })}
            >
              <option value={NivelPermissao.ADMINISTRADOR}>Administrador</option>
              <option value={NivelPermissao.ENGENHEIRO}>Engenheiro</option>
              <option value={NivelPermissao.OPERADOR}>Operador</option>
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="senha">Senha * (mínimo 4 caracteres)</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={(e) => {
                setFormData({ ...formData, senha: e.target.value });
                validarSenha(e.target.value);
                if (formData.confirmarSenha) {
                  validarConfirmarSenha(formData.confirmarSenha);
                }
              }}
              placeholder="********"
              className={erros.senha ? styles.errorInput : ''}
            />
            {erros.senha && <span className={styles.errorMessage}>{erros.senha}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmarSenha">Confirmar Senha *</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={(e) => {
                setFormData({ ...formData, confirmarSenha: e.target.value });
                validarConfirmarSenha(e.target.value);
              }}
              placeholder="********"
              className={erros.confirmarSenha ? styles.errorInput : ''}
            />
            {erros.confirmarSenha && <span className={styles.errorMessage}>{erros.confirmarSenha}</span>}
          </div>
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.submitButton}>
            Cadastrar Funcionário
          </button>
          <button type="button" onClick={onCancelar} className={styles.cancelButton}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroFuncionario;