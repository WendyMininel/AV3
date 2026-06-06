import React from 'react';
import { Aeronave, TipoAeronave } from '../../types';
import styles from './ListaAeronaves.module.css';

interface ListaAeronavesProps {
  aeronaves: Aeronave[];
  onRemover: (codigo: string) => void;
}

const ListaAeronaves: React.FC<ListaAeronavesProps> = ({ aeronaves, onRemover }) => {
  const getTipoLabel = (tipo: TipoAeronave) => {
    return tipo === TipoAeronave.COMERCIAL ? 'Comercial' : 'Militar';
  };

  if (aeronaves.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Nenhuma aeronave cadastrada.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Modelo</th>
            <th>Tipo</th>
            <th>Capacidade</th>
            <th>Alcance (km)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {aeronaves.map((aeronave) => (
            <tr key={aeronave.codigo}>
              <td>{aeronave.codigo}</td>
              <td>{aeronave.modelo}</td>
              <td>
                <span className={`${styles.badge} ${aeronave.tipo === TipoAeronave.COMERCIAL ? styles.comercial : styles.militar}`}>
                  {getTipoLabel(aeronave.tipo)}
                </span>
              </td>
              <td>{aeronave.capacidade || '-'}</td>
              <td>{aeronave.alcance || '-'}</td>
              <td>
                <button
                  onClick={() => onRemover(aeronave.codigo)}
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
  );
};

export default ListaAeronaves;