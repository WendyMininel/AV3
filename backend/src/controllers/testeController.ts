import { Request, Response } from 'express';
import { prisma } from '../index';

export const listarTestes = async (req: Request, res: Response) => {
  const { aeronaveCodigo } = req.query;
  
  const where: any = {};
  if (aeronaveCodigo) {
    where.aeronaveCodigo = aeronaveCodigo as string;
  }
  
  const testes = await prisma.teste.findMany({ where });
  res.json(testes);
};

export const criarTeste = async (req: Request, res: Response) => {
  const { tipo, resultado, aeronaveCodigo } = req.body;
  
  const teste = await prisma.teste.create({
    data: { tipo, resultado, aeronaveCodigo }
  });
  
  res.status(201).json(teste);
};