import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import styles from './Qualidade.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

interface DadosMetrica {
  usuarios: number;
  latenciaMedia: number;
  processamentoMedia: number;
  respostaMedia: number;
  latenciaP95: number;
  processamentoP95: number;
  respostaP95: number;
  latenciaMax: number;
  processamentoMax: number;
  respostaMax: number;
}

const Qualidade: React.FC = () => {
  const [dados, setDados] = useState<DadosMetrica[]>([]);
  const [loading, setLoading] = useState(true);
  const [executandoTeste, setExecutandoTeste] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const relatorioRef = useRef<HTMLDivElement>(null);

  const executarTesteCarga = async () => {
    setExecutandoTeste(true);
    setMensagem('Executando teste de carga real... Aguarde alguns segundos.');
    
    try {
      const response = await fetch('http://localhost:3333/api/teste-carga', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Erro ao executar teste');
      }
      
      const resultado = await response.json();
      setDados(resultado);
      setMensagem('Teste de carga concluído com sucesso!');
      
      setTimeout(() => setMensagem(''), 3000);
    } catch (error) {
      console.error('Erro ao executar teste de carga:', error);
      setMensagem('Erro ao executar teste de carga. Verifique se o back-end está rodando.');
    } finally {
      setExecutandoTeste(false);
    }
  };

  const imprimirPDF = () => {
    const conteudo = relatorioRef.current;
    if (!conteudo) return;
    
    const janela = window.open('', '_blank');
    if (!janela) return;
    
    janela.document.write(`
      <html>
        <head>
          <title>Relatório de Qualidade - Aerocode</title>
          <style>
            body {
              font-family: 'Poppins', Arial, sans-serif;
              padding: 40px;
              margin: 0;
            }
            h1 { color: #023261; }
            h2 { color: #26639d; margin-top: 30px; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: center;
            }
            th {
              background-color: #26639d;
              color: white;
            }
            .card {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              margin: 10px;
              display: inline-block;
              width: 200px;
              vertical-align: top;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { margin: 0; padding: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>AEROCODE - Relatório de Qualidade</h1>
          <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
          
          <h2>Resultados dos Testes de Carga</h2>
          ${dados.map(d => `
            <div class="card">
              <h3>${d.usuarios} Usuário${d.usuarios > 1 ? 's' : ''}</h3>
              <p><strong>Tempo de Resposta:</strong> ${d.respostaMedia.toFixed(2)} ms</p>
              <p><strong>Latência:</strong> ${d.latenciaMedia.toFixed(2)} ms</p>
              <p><strong>Processamento:</strong> ${d.processamentoMedia.toFixed(2)} ms</p>
              <hr/>
              <p><strong>P95 Resposta:</strong> ${d.respostaP95.toFixed(2)} ms</p>
              <p><strong>Máximo:</strong> ${d.respostaMax.toFixed(2)} ms</p>
            </div>
          `).join('')}
          
          <h2>Tabela Completa de Métricas</h2>
          <table>
            <thead>
              <tr>
                <th>Usuários</th>
                <th colspan="3">Média (ms)</th>
                <th colspan="3">Percentil 95 (ms)</th>
                <th colspan="3">Máximo (ms)</th>
               </tr>
              <tr>
                <th></th>
                <th>Latência</th><th>Processamento</th><th>Resposta</th>
                <th>Latência</th><th>Processamento</th><th>Resposta</th>
                <th>Latência</th><th>Processamento</th><th>Resposta</th>
               </tr>
            </thead>
            <tbody>
              ${dados.map(d => `
                <tr>
                  <td><strong>${d.usuarios}</strong></td>
                  <td>${d.latenciaMedia.toFixed(2)}</td>
                  <td>${d.processamentoMedia.toFixed(2)}</td>
                  <td>${d.respostaMedia.toFixed(2)}</td>
                  <td>${d.latenciaP95.toFixed(2)}</td>
                  <td>${d.processamentoP95.toFixed(2)}</td>
                  <td>${d.respostaP95.toFixed(2)}</td>
                  <td>${d.latenciaMax.toFixed(2)}</td>
                  <td>${d.processamentoMax.toFixed(2)}</td>
                  <td>${d.respostaMax.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Aerocode - Sistema de Gestão de Produção de Aeronaves</p>
            <p>Relatório gerado automaticamente pelo sistema de qualidade</p>
          </div>
        </body>
      </html>
    `);
    
    janela.document.close();
    janela.print();
  };

  const carregarDados = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3333/api/metricas/relatorio');
      const resultado = await response.json();
      if (resultado && resultado.length > 0) {
        setDados(resultado);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const dadosMedias = {
    labels: dados.map(d => `${d.usuarios} usuário${d.usuarios > 1 ? 's' : ''}`),
    datasets: [
      {
        label: 'Latência (ms)',
        data: dados.map(d => d.latenciaMedia),
        backgroundColor: 'rgba(38, 99, 157, 0.7)',
        borderColor: 'rgba(38, 99, 157, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tempo de Processamento (ms)',
        data: dados.map(d => d.processamentoMedia),
        backgroundColor: 'rgba(40, 167, 69, 0.7)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tempo de Resposta (ms)',
        data: dados.map(d => d.respostaMedia),
        backgroundColor: 'rgba(220, 53, 69, 0.7)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 1,
      },
    ],
  };

  const dadosPercentil95 = {
    labels: dados.map(d => `${d.usuarios} usuário${d.usuarios > 1 ? 's' : ''}`),
    datasets: [
      {
        label: 'Latência P95 (ms)',
        data: dados.map(d => d.latenciaP95),
        borderColor: 'rgba(38, 99, 157, 1)',
        backgroundColor: 'rgba(38, 99, 157, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Tempo de Processamento P95 (ms)',
        data: dados.map(d => d.processamentoP95),
        borderColor: 'rgba(40, 167, 69, 1)',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Tempo de Resposta P95 (ms)',
        data: dados.map(d => d.respostaP95),
        borderColor: 'rgba(220, 53, 69, 1)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Métricas de Performance por Número de Usuários', font: { size: 16 } },
      tooltip: { callbacks: { label: (context: any) => `${context.dataset.label}: ${context.raw.toFixed(2)} ms` } }
    },
    scales: {
      y: { title: { display: true, text: 'Tempo (milissegundos)', font: { weight: 'bold' as const } } },
      x: { title: { display: true, text: 'Número de Usuários Simultâneos', font: { weight: 'bold' as const } } }
    }
  };

  return (
    <div className={styles.qualidade}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.content} ref={relatorioRef}>
          <div className={styles.header}>
            <h2 className={styles.title}>Relatório de Qualidade</h2>
            <div className={styles.buttons}>
              <button 
                className={styles.testButton} 
                onClick={executarTesteCarga}
                disabled={executandoTeste}
              >
                {executandoTeste ? 'Executando...' : 'Executar Teste de Carga'}
              </button>
              <button 
                className={styles.printButton} 
                onClick={imprimirPDF}
                disabled={dados.length === 0}
              >
                Imprimir PDF
              </button>
            </div>
          </div>

          {mensagem && (
            <div className={`${styles.mensagem} ${mensagem.includes('sucesso') ? styles.success : mensagem.includes('Erro') ? styles.error : styles.info}`}>
              {mensagem}
            </div>
          )}

          {loading ? (
            <div className={styles.loading}><p>Carregando dados...</p></div>
          ) : dados.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum dado de qualidade disponível.</p>
              <p>Clique em "Executar Teste de Carga" para gerar as métricas reais.</p>
            </div>
          ) : (
            <>
              <div className={styles.cardsContainer}>
                {dados.map((d) => (
                  <div key={d.usuarios} className={styles.card}>
                    <h4>{d.usuarios} Usuário{d.usuarios > 1 ? 's' : ''}</h4>
                    <p><strong>Tempo de Resposta:</strong> {d.respostaMedia.toFixed(2)} ms</p>
                    <p><strong>Latência:</strong> {d.latenciaMedia.toFixed(2)} ms</p>
                    <p><strong>Processamento:</strong> {d.processamentoMedia.toFixed(2)} ms</p>
                    <hr />
                    <p><strong>P95 Resposta:</strong> {d.respostaP95.toFixed(2)} ms</p>
                    <p><strong>Máximo:</strong> {d.respostaMax.toFixed(2)} ms</p>
                  </div>
                ))}
              </div>

              <div className={styles.chartContainer}>
                <h3>Média das Métricas por Usuário</h3>
                <div className={styles.chartWrapper}>
                  <Bar data={dadosMedias} options={opcoesGrafico} />
                </div>
              </div>

              <div className={styles.chartContainer}>
                <h3>Percentil 95 (P95) das Métricas</h3>
                <div className={styles.chartWrapper}>
                  <Line data={dadosPercentil95} options={opcoesGrafico} />
                </div>
              </div>

              <div className={styles.tableContainer}>
                <h3>Tabela Completa de Métricas</h3>
                <table className={styles.table}>
                  <thead>
                    <tr><th>Usuários</th><th colSpan={3}>Média (ms)</th><th colSpan={3}>Percentil 95 (ms)</th><th colSpan={3}>Máximo (ms)</th></tr>
                    <tr><th></th><th>Latência</th><th>Processamento</th><th>Resposta</th><th>Latência</th><th>Processamento</th><th>Resposta</th><th>Latência</th><th>Processamento</th><th>Resposta</th></tr>
                  </thead>
                  <tbody>
                    {dados.map((d) => (
                      <tr key={d.usuarios}>
                        <td><strong>{d.usuarios}</strong></td>
                        <td>{d.latenciaMedia.toFixed(2)}</td>
                        <td>{d.processamentoMedia.toFixed(2)}</td>
                        <td>{d.respostaMedia.toFixed(2)}</td>
                        <td>{d.latenciaP95.toFixed(2)}</td>
                        <td>{d.processamentoP95.toFixed(2)}</td>
                        <td>{d.respostaP95.toFixed(2)}</td>
                        <td>{d.latenciaMax.toFixed(2)}</td>
                        <td>{d.processamentoMax.toFixed(2)}</td>
                        <td>{d.respostaMax.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.methodology}>
                <h3>Metodologia dos Testes</h3>
                <p><strong>Como as métricas foram obtidas:</strong></p>
                <ul>
                  <li><strong>Latência:</strong> Tempo de ida e volta da requisição na rede (medido em milissegundos)</li>
                  <li><strong>Tempo de Processamento:</strong> Tempo gasto pelo servidor para processar a requisição</li>
                  <li><strong>Tempo de Resposta:</strong> Latência + Tempo de Processamento</li>
                </ul>
                <p><strong>Condições do teste:</strong></p>
                <ul>
                  <li>10 requisições por usuário</li>
                  <li>Endpoints testados: /aeronaves, /pecas, /etapas, /funcionarios, /testes</li>
                  <li>Teste realizado com simulação de 1, 5 e 10 usuários simultâneos</li>
                  <li>Unidade de medida: milissegundos (ms)</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Qualidade;