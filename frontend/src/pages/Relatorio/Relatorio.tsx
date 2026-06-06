import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { Aeronave } from '../../types';
import { aeronaveAPI, relatorioAPI } from '../../services/api';
import styles from './Relatorio.module.css';

const Relatorio: React.FC = () => {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [selectedAeronave, setSelectedAeronave] = useState<string>('');
  const [cliente, setCliente] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [relatorioGerado, setRelatorioGerado] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({
    cliente: '',
    dataEntrega: '',
    aeronave: '',
  });

  useEffect(() => {
    const carregarAeronaves = async () => {
      try {
        const dados = await aeronaveAPI.listar();
        setAeronaves(dados);
      } catch (error) {
        console.error('Erro ao carregar aeronaves:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarAeronaves();
  }, []);

  const validarCliente = (nome: string): boolean => {
    if (!nome.trim()) {
      setErros((prev) => ({
        ...prev,
        cliente: 'Nome do cliente é obrigatório',
      }));
      return false;
    }
    if (nome.trim().length < 3) {
      setErros((prev) => ({
        ...prev,
        cliente: 'Nome deve ter pelo menos 3 caracteres',
      }));
      return false;
    }
    const regexPermitido = /^[A-Za-z0-9À-ÿ\s\.\-]+$/;
    if (!regexPermitido.test(nome)) {
      setErros((prev) => ({
        ...prev,
        cliente: 'Nome pode conter letras, números, espaços, pontos e hífens',
      }));
      return false;
    }
    setErros((prev) => ({ ...prev, cliente: '' }));
    return true;
  };

  const validarData = (data: string): boolean => {
    if (!data) {
      setErros((prev) => ({
        ...prev,
        dataEntrega: 'Data de entrega é obrigatória',
      }));
      return false;
    }

    const dataObj = new Date(data);
    const ano = dataObj.getFullYear();
    const mes = dataObj.getMonth() + 1;
    const dia = dataObj.getDate();

    if (ano < 2026) {
      setErros((prev) => ({
        ...prev,
        dataEntrega: 'Ano deve ser 2026 ou superior',
      }));
      return false;
    }

    if (ano > 9999) {
      setErros((prev) => ({ ...prev, dataEntrega: 'Ano inválido' }));
      return false;
    }

    if (mes < 1 || mes > 12) {
      setErros((prev) => ({ ...prev, dataEntrega: 'Mês inválido (1-12)' }));
      return false;
    }

    if (dia < 1 || dia > 31) {
      setErros((prev) => ({ ...prev, dataEntrega: 'Dia inválido (1-31)' }));
      return false;
    }

    const dataValida = new Date(ano, mes - 1, dia);
    if (dataValida.getDate() !== dia || dataValida.getMonth() + 1 !== mes) {
      setErros((prev) => ({ ...prev, dataEntrega: 'Data inválida' }));
      return false;
    }

    setErros((prev) => ({ ...prev, dataEntrega: '' }));
    return true;
  };

  const validarAeronave = (codigo: string): boolean => {
    if (!codigo) {
      setErros((prev) => ({ ...prev, aeronave: 'Selecione uma aeronave' }));
      return false;
    }
    setErros((prev) => ({ ...prev, aeronave: '' }));
    return true;
  };

  const handleGerarRelatorio = async () => {
    const isClienteValido = validarCliente(cliente);
    const isDataValida = validarData(dataEntrega);
    const isAeronaveValida = validarAeronave(selectedAeronave);

    if (!isClienteValido || !isDataValida || !isAeronaveValida) {
      return;
    }

    try {
      const response = await relatorioAPI.gerar({
        aeronaveCodigo: selectedAeronave,
        cliente,
        dataEntrega,
      });
      setRelatorioGerado(response.relatorio);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório');
    }
  };

  const handleSalvarTXT = () => {
    if (!relatorioGerado) return;
    const blob = new Blob([relatorioGerado], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${selectedAeronave}_${cliente.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSalvarPDF = () => {
    if (!relatorioGerado) return;

    const janela = window.open('', '_blank');
    if (!janela) return;

    const conteudoHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório Aeronave - ${selectedAeronave}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', monospace;
              padding: 40px;
              background: white;
              line-height: 1.6;
            }
            h1 {
              color: #023261;
              text-align: center;
              margin-bottom: 10px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #26639d;
            }
            .content {
              white-space: pre-wrap;
              font-family: 'Courier New', monospace;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 10px;
              color: #666;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AEROCODE</h1>
            <p>Relatório de Entrega de Aeronave</p>
            <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          <div class="content">
            ${relatorioGerado.replace(/\n/g, '<br/>')}
          </div>
          <div class="footer">
            <p>Aerocode - Sistema de Gestão de Produção de Aeronaves</p>
            <p>Documento gerado eletronicamente - Válido em todo território nacional</p>
          </div>
        </body>
      </html>
    `;

    janela.document.write(conteudoHTML);
    janela.document.close();
    janela.print();
  };

  if (loading) {
    return (
      <div className={styles.relatorio}>
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
    <div className={styles.relatorio}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Relatório Final de Entrega</h2>
          </div>
          <div className={styles.formSection}>
            <h3>Informações para o Relatório</h3>

            <div className={styles.formGroup}>
              <label>Aeronave *</label>
              <select
                value={selectedAeronave}
                onChange={(e) => {
                  setSelectedAeronave(e.target.value);
                  validarAeronave(e.target.value);
                }}
                className={erros.aeronave ? styles.errorInput : ''}
              >
                <option value="">Selecione uma aeronave</option>
                {aeronaves.map((a) => (
                  <option key={a.codigo} value={a.codigo}>
                    {a.modelo} ({a.codigo})
                  </option>
                ))}
              </select>
              {erros.aeronave && (
                <span className={styles.errorMessage}>{erros.aeronave}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Nome do Cliente *</label>
              <input
                type="text"
                value={cliente}
                onChange={(e) => {
                  setCliente(e.target.value);
                  validarCliente(e.target.value);
                }}
                placeholder="Ex: Empresa Aérea 123"
                className={erros.cliente ? styles.errorInput : ''}
              />
              {erros.cliente && (
                <span className={styles.errorMessage}>{erros.cliente}</span>
              )}
              <small className={styles.hint}>
                Permitido: letras, números, espaços, pontos e hífens
              </small>
            </div>

            <div className={styles.formGroup}>
              <label>Data de Entrega * (mínimo 2026)</label>
              <input
                type="date"
                value={dataEntrega}
                onChange={(e) => {
                  setDataEntrega(e.target.value);
                  validarData(e.target.value);
                }}
                min="2026-01-01"
                className={erros.dataEntrega ? styles.errorInput : ''}
              />
              {erros.dataEntrega && (
                <span className={styles.errorMessage}>{erros.dataEntrega}</span>
              )}
            </div>

            <button
              onClick={handleGerarRelatorio}
              className={styles.generateButton}
            >
              Gerar Relatório
            </button>
          </div>

          {relatorioGerado && (
            <div className={styles.relatorioSection}>
              <div className={styles.relatorioHeader}>
                <h3>Pré-visualização do Relatório</h3>
                <div className={styles.buttonGroup}>
                  <button
                    onClick={handleSalvarPDF}
                    className={styles.pdfButton}
                  >
                    Salvar em PDF
                  </button>
                  <button
                    onClick={handleSalvarTXT}
                    className={styles.saveButton}
                  >
                    Salvar em TXT
                  </button>
                </div>
              </div>
              <pre className={styles.relatorioContent}>{relatorioGerado}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Relatorio;
