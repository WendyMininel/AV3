import React, { useState } from 'react';
import { Peca, StatusPeca, TipoPeca } from '../../types';
import styles from './ListaPecas.module.css';

interface ListaPecasProps {
  pecas: Peca[];
  onUpdateStatus: (id: string, newStatus: StatusPeca) => void;
}

const ListaPecas: React.FC<ListaPecasProps> = ({ pecas, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const getTipoLabel = (tipo: TipoPeca) => {
    return tipo === TipoPeca.NACIONAL ? 'Nacional' : 'Importada';
  };

  const getStatusLabel = (status: StatusPeca) => {
    const labels = {
      [StatusPeca.EM_PRODUCAO]: 'Em Produção',
      [StatusPeca.EM_TRANSPORTE]: 'Em Transporte',
      [StatusPeca.PRONTA]: 'Pronta'
    };
    return labels[status];
  };

  const getStatusClass = (status: StatusPeca) => {
    const classes = {
      [StatusPeca.EM_PRODUCAO]: styles.emProducao,
      [StatusPeca.EM_TRANSPORTE]: styles.emTransporte,
      [StatusPeca.PRONTA]: styles.pronta
    };
    return classes[status];
  };

  const filteredPecas = pecas.filter(peca => {
    const matchesSearch = peca.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          peca.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !filterTipo || peca.tipo === filterTipo;
    const matchesStatus = !filterStatus || peca.status === filterStatus;
    return matchesSearch && matchesTipo && matchesStatus;
  });

  if (pecas.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Nenhuma peça cadastrada.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Pesquisar por nome ou fornecedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Todos os tipos</option>
          <option value={TipoPeca.NACIONAL}>Nacional</option>
          <option value={TipoPeca.IMPORTADA}>Importada</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Todos os status</option>
          <option value={StatusPeca.EM_PRODUCAO}>Em Produção</option>
          <option value={StatusPeca.EM_TRANSPORTE}>Em Transporte</option>
          <option value={StatusPeca.PRONTA}>Pronta</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Fornecedor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPecas.map((peca) => (
              <tr key={peca.id}>
                <td data-label="Nome">{peca.nome}</td>
                <td data-label="Tipo">{getTipoLabel(peca.tipo)}</td>
                <td data-label="Fornecedor">{peca.fornecedor}</td>
                <td data-label="Status">
                  <span className={`${styles.statusBadge} ${getStatusClass(peca.status)}`}>
                    {getStatusLabel(peca.status)}
                  </span>
                </td>
                <td data-label="Ações">
                  <select
                    value={peca.status}
                    onChange={(e) => onUpdateStatus(peca.id, e.target.value as StatusPeca)}
                    className={styles.statusSelect}
                  >
                    <option value={StatusPeca.EM_PRODUCAO}>Em Produção</option>
                    <option value={StatusPeca.EM_TRANSPORTE}>Em Transporte</option>
                    <option value={StatusPeca.PRONTA}>Pronta</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaPecas;