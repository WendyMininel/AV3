import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.message}\n${err.stack}`);
  
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Registro duplicado' });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Registro não encontrado' });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
};