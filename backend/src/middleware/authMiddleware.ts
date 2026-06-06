import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  usuario?: {
    id: string;
    nome: string;
    nivelPermissao: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const verificarPermissao = (niveisPermitidos: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    
    if (!niveisPermitidos.includes(req.usuario.nivelPermissao)) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    
    next();
  };
};