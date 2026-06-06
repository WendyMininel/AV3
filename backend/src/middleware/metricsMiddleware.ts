import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

export const metricsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestStart = Date.now();

  const oldJson = res.json;

  res.json = function(data) {
    const endTime = Date.now();
    const latencyMs = requestStart - startTime;
    const tempoProcessamentoMs = endTime - requestStart;
    const tempoRespostaMs = endTime - startTime;

    prisma.metricaLatencia.create({
      data: {
        endpoint: req.route?.path || req.path,
        latenciaMs: Math.max(0, latencyMs),
        tempoRespostaMs,
        tempoProcessamentoMs
      }
    }).catch(err => console.error('Erro ao salvar métrica:', err));

    return oldJson.call(this, data);
  };

  next();
};