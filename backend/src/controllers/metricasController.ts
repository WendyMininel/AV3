import { Request, Response } from 'express';
import { prisma } from '../index';

export const obterMetricas = async (req: Request, res: Response) => {
  const { horas = 24 } = req.query;
  
  const dataLimite = new Date();
  dataLimite.setHours(dataLimite.getHours() - Number(horas));
  
  const metricas = await prisma.metricaLatencia.findMany({
    where: {
      timestamp: {
        gte: dataLimite
      }
    },
    orderBy: {
      timestamp: 'asc'
    }
  });
  
  const latencias = metricas.map(m => m.latenciaMs);
  const temposResposta = metricas.map(m => m.tempoRespostaMs);
  const temposProcessamento = metricas.map(m => m.tempoProcessamentoMs);
  
  const calcularMedia = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
  const calcularMax = (arr: number[]) => Math.max(...arr, 0);
  const calcularMin = (arr: number[]) => Math.min(...arr, 0);
  
  res.json({
    periodo: `${horas} horas`,
    totalRequisicoes: metricas.length,
    latencia: {
      media: calcularMedia(latencias),
      maximo: calcularMax(latencias),
      minimo: calcularMin(latencias)
    },
    tempoResposta: {
      media: calcularMedia(temposResposta),
      maximo: calcularMax(temposResposta),
      minimo: calcularMin(temposResposta)
    },
    tempoProcessamento: {
      media: calcularMedia(temposProcessamento),
      maximo: calcularMax(temposProcessamento),
      minimo: calcularMin(temposProcessamento)
    },
    historico: metricas.map(m => ({
      timestamp: m.timestamp,
      endpoint: m.endpoint,
      latenciaMs: m.latenciaMs,
      tempoRespostaMs: m.tempoRespostaMs,
      tempoProcessamentoMs: m.tempoProcessamentoMs
    }))
  });
};

export const obterMetricasGraficos = async (req: Request, res: Response) => {
  const { horas = 24 } = req.query;
  
  const dataLimite = new Date();
  dataLimite.setHours(dataLimite.getHours() - Number(horas));
  
  const metricas = await prisma.metricaLatencia.findMany({
    where: {
      timestamp: {
        gte: dataLimite
      }
    },
    orderBy: {
      timestamp: 'asc'
    }
  });
  
  const grupos: { [key: string]: { latencias: number[], respostas: number[], processamentos: number[] } } = {};
  
  metricas.forEach(m => {
    const hora = m.timestamp.toISOString().slice(0, 13);
    if (!grupos[hora]) {
      grupos[hora] = { latencias: [], respostas: [], processamentos: [] };
    }
    grupos[hora].latencias.push(m.latenciaMs);
    grupos[hora].respostas.push(m.tempoRespostaMs);
    grupos[hora].processamentos.push(m.tempoProcessamentoMs);
  });
  
  const dadosGrafico = Object.entries(grupos).map(([hora, dados]) => ({
    hora: hora.replace('T', ' '),
    latenciaMedia: dados.latencias.reduce((a, b) => a + b, 0) / dados.latencias.length,
    tempoRespostaMedia: dados.respostas.reduce((a, b) => a + b, 0) / dados.respostas.length,
    tempoProcessamentoMedia: dados.processamentos.reduce((a, b) => a + b, 0) / dados.processamentos.length
  }));
  
  res.json(dadosGrafico);
};