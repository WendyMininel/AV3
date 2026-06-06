import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import CadastroFuncionario from './CadastroFuncionario';
import { Funcionario, NivelPermissao } from '../../types';
import { funcionarioAPI } from '../../services/api';
import styles from './Funcionarios.module.css';

const Funcionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const carregarFuncionarios = async () => {
    try {
      setLoading(true);
      const dados = await funcionarioAPI.listar();
      setFuncionarios(dados);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const handleSalvar = async (novoFuncionario: Funcionario) => {
    try {
      await funcionarioAPI.criar(novoFuncionario);
      await carregarFuncionarios();
      setShowForm(false);
      alert('Funcionário cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar funcionário:', error);
      alert('Erro ao cadastrar funcionário');
    }
  };

  const handleRemover = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este funcionário?')) {
      try {
        await funcionarioAPI.deletar(id);
        await carregarFuncionarios();
        alert('Funcionário removido com sucesso!');
      } catch (error) {
        console.error('Erro ao remover funcionário:', error);
        alert('Erro ao remover funcionário');
      }
    }
  };

  const getPermissaoLabel = (nivel: NivelPermissao) => {
    const labels = {
      [NivelPermissao.ADMINISTRADOR]: 'Administrador',
      [NivelPermissao.ENGENHEIRO]: 'Engenheiro',
      [NivelPermissao.OPERADOR]: 'Operador'
    };
    return labels[nivel];
  };

  if (loading) {
    return (
      <div className={styles.funcionarios}>
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
    <div className={styles.funcionarios}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Gerenciamento de Funcionários</h2>
            <button
              className={styles.createButton}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : '+ Novo Funcionário'}
            </button>
          </div>

          {showForm && (
            <CadastroFuncionario 
              onSalvar={handleSalvar} 
              onCancelar={() => setShowForm(false)}
              funcionariosExistentes={funcionarios}
            />
          )}

          <div className={styles.listContainer}>
            {funcionarios.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>Nenhum funcionário cadastrado.</p>
            ) : (
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
                  {funcionarios.map((funcionario) => (
                    <tr key={funcionario.id}>
                      <td>{funcionario.nome}</td>
                      <td>{funcionario.telefone}</td>
                      <td>{funcionario.endereco}</td>
                      <td>{funcionario.usuario}</td>
                      <td>
                        <span className={`${styles.permissionBadge} ${styles[funcionario.nivelPermissao.toLowerCase()]}`}>
                          {getPermissaoLabel(funcionario.nivelPermissao)}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleRemover(funcionario.id)}
                          className={styles.deleteButton}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funcionarios;