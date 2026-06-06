import React, { useState } from 'react';
import { Funcionario, NivelPermissao } from '../../types';
import styles from './ListaFuncionarios.module.css';

interface ListaFuncionariosProps {
  funcionarios: Funcionario[];
  onRemover: (id: string) => void;
}

const ListaFuncionarios: React.FC<ListaFuncionariosProps> = ({ funcionarios, onRemover }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPermissao, setFilterPermissao] = useState<string>('');

  const getPermissaoLabel = (nivel: NivelPermissao) => {
    const labels = {
      [NivelPermissao.ADMINISTRADOR]: 'Administrador',
      [NivelPermissao.ENGENHEIRO]: 'Engenheiro',
      [NivelPermissao.OPERADOR]: 'Operador'
    };
    return labels[nivel];
  };

  const getPermissaoClass = (nivel: NivelPermissao) => {
    const classes = {
      [NivelPermissao.ADMINISTRADOR]: styles.administrador,
      [NivelPermissao.ENGENHEIRO]: styles.engenheiro,
      [NivelPermissao.OPERADOR]: styles.operador
    };
    return classes[nivel];
  };

  const filteredFuncionarios = funcionarios.filter(func => {
    const matchesSearch = func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          func.usuario.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPermissao = !filterPermissao || func.nivelPermissao === filterPermissao;
    return matchesSearch && matchesPermissao;
  });

  if (funcionarios.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Nenhum funcionário cadastrado.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Pesquisar por nome ou usuário..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterPermissao}
          onChange={(e) => setFilterPermissao(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Todos os níveis</option>
          <option value={NivelPermissao.ADMINISTRADOR}>Administrador</option>
          <option value={NivelPermissao.ENGENHEIRO}>Engenheiro</option>
          <option value={NivelPermissao.OPERADOR}>Operador</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Usuário</th>
              <th>Permissão</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredFuncionarios.map((funcionario) => (
              <tr key={funcionario.id}>
                <td data-label="Nome">{funcionario.nome}</td>
                <td data-label="Telefone">{funcionario.telefone}</td>
                <td data-label="Endereço">{funcionario.endereco}</td>
                <td data-label="Usuário">{funcionario.usuario}</td>
                <td data-label="Permissão">
                  <span className={`${styles.permissionBadge} ${getPermissaoClass(funcionario.nivelPermissao)}`}>
                    {getPermissaoLabel(funcionario.nivelPermissao)}
                  </span>
                </td>
                <td data-label="Ações">
                  <button
                    onClick={() => onRemover(funcionario.id)}
                    className={styles.deleteButton}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaFuncionarios;